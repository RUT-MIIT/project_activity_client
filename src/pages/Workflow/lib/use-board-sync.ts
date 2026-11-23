import type { Diff, Store } from '@quickdrawjs/core';

import { useEffect, useRef, useState } from 'react';
import { composeDiff, isDiffEmpty } from '@quickdrawjs/core';

import { decodeBoardChanges, encodeBoardChanges } from './board-edits';
import type { BoardChanges } from './board-edits';
import { createBoardSocketTransport } from './board-sync';

const RECONNECT_DELAY_MS = 1000;
const EDIT_INTERVAL_MS = 50;

function mergeDiff(first: Diff | null, second: Diff | null) {
	const combined =
		first && second ? composeDiff(first, second) : first ?? second;

	return isDiffEmpty(combined) ? null : combined;
}

export const useBoardSync = (
	store: Store,
	teamId: number | null,
	userId: number | undefined
) => {
	const [isSynced, setIsSynced] = useState(teamId === null);
	const [serverPersists, setServerPersists] = useState(false);
	const [saveFailed, setSaveFailed] = useState(false);
	const clientIdRef = useRef(
		typeof crypto !== 'undefined' && crypto.randomUUID
			? crypto.randomUUID()
			: `client-${Date.now()}`
	);

	useEffect(() => {
		if (teamId === null) {
			setIsSynced(true);
			setServerPersists(false);
			setSaveFailed(false);

			return;
		}

		const clientId = clientIdRef.current;
		const draftKey =
			userId === undefined ? null : `quickdraw-draft:${userId}:${teamId}`;
		let isUnmounted = false;
		let durable = false;
		let draftRead = false;
		let hasStashedDraft = false;
		let ready = false;
		let revision = 0;
		let sequence = 0;
		let pending: Diff | null = null;
		let inFlight: { sequence: number; diff: Diff } | null = null;
		let useFullRecords = false;
		let rejected = false;
		let editTimer: number | null = null;
		let reconnectTimer: number | null = null;
		let transport: ReturnType<typeof createBoardSocketTransport> | null =
			null;
		let unsubTransport: (() => void) | null = null;
		let unsubOpen: (() => void) | null = null;
		let unsubClose: (() => void) | null = null;

		const stashDraft = () => {
			if (!durable || draftKey === null) {
				return;
			}

			const draft = mergeDiff(inFlight?.diff ?? null, pending);

			try {
				if (draft) {
					sessionStorage.setItem(
						draftKey,
						JSON.stringify(encodeBoardChanges(draft, false))
					);
					hasStashedDraft = true;
				} else {
					sessionStorage.removeItem(draftKey);
					hasStashedDraft = false;
				}
			} catch {
				setSaveFailed(true);
			}
		};

		const flush = () => {
			if (
				!transport ||
				!ready ||
				!durable ||
				inFlight ||
				!pending ||
				rejected
			) {
				return;
			}

			const diff = pending;
			pending = null;
			inFlight = { sequence: ++sequence, diff };
			transport.send({
				type: 'edit',
				clientId,
				sequence,
				changes: encodeBoardChanges(diff, !useFullRecords),
			});
			useFullRecords = false;
		};

		const schedule = () => {
			if (editTimer === null) {
				editTimer = window.setTimeout(() => {
					editTimer = null;
					flush();
				}, EDIT_INTERVAL_MS);
			}
		};

		const saveBeforeLeaving = () => {
			stashDraft();
			flush();
		};

		const unsubscribeStore = store.listen(
			(diff) => {
				if (isDiffEmpty(diff)) {
					return;
				}

				if (!durable) {
					if (ready) {
						transport?.send({ type: 'diff', clientId, diff });
					}

					return;
				}

				pending = mergeDiff(pending, diff);
				rejected = false;
				const strokeEnded = Object.values(diff.updated).some(
					([before, after]) =>
						before.typeName === 'shape' &&
						after.typeName === 'shape' &&
						after.type === 'draw' &&
						before.props.done !== true &&
						after.props.done === true
				);

				if (strokeEnded || Object.keys(diff.added).length > 0) {
					flush();
				}

				schedule();
			},
			{ source: 'user' }
		);

		const disconnect = () => {
			unsubTransport?.();
			unsubOpen?.();
			unsubClose?.();
			unsubTransport = null;
			unsubOpen = null;
			unsubClose = null;
			transport?.close();
			transport = null;
		};

		const requestSnapshot = () => {
			if (!ready) {
				return;
			}

			ready = false;
			transport?.send({ type: 'hello', clientId });
		};

		const resumeFrom = (newRevision: number) => {
			if (newRevision <= revision) {
				return;
			}

			if (newRevision === revision + 1) {
				revision = newRevision;
			} else {
				requestSnapshot();
			}
		};

		const requeueFlight = () => {
			if (inFlight) {
				pending = mergeDiff(inFlight.diff, pending);
				inFlight = null;
				useFullRecords = true;
			}
		};

		const connect = () => {
			if (isUnmounted) {
				return;
			}

			disconnect();
			ready = false;
			setIsSynced(false);
			const socket = createBoardSocketTransport(teamId);
			transport = socket;

			unsubOpen = socket.onOpen(() => {
				socket.send({ type: 'hello', clientId });
			});

			unsubTransport = socket.subscribe((message) => {
				if (message.type === 'snapshot') {
					durable = message.protocol === 2;
					setServerPersists(durable);

					if (
						inFlight?.sequence === message.retry &&
						message.retry !== undefined
					) {
						requeueFlight();
					}

					store.loadSnapshot(message.snapshot, 'remote');
					revision = message.revision ?? 0;

					if (durable && !draftRead) {
						draftRead = true;

						try {
							const stored =
								draftKey === null
									? null
									: sessionStorage.getItem(draftKey);

							if (stored) {
								hasStashedDraft = true;
								const restored = decodeBoardChanges(
									store,
									JSON.parse(stored) as BoardChanges
								);
								pending = mergeDiff(restored, pending);
								useFullRecords = true;
							}
						} catch {
							setSaveFailed(true);
						}
					}

					const local = mergeDiff(inFlight?.diff ?? null, pending);

					if (durable && local) {
						store.applyDiff(local, 'remote');
					}

					ready = true;
					setIsSynced(true);
					flush();
					return;
				}

				if (
					message.type === 'ack' &&
					inFlight?.sequence === message.sequence
				) {
					inFlight = null;
					setSaveFailed(false);

					if (hasStashedDraft) {
						stashDraft();
					}

					resumeFrom(message.revision);

					if (editTimer === null) {
						flush();
					}

					return;
				}

				if (
					message.type === 'edit-rejected' &&
					inFlight?.sequence === message.sequence
				) {
					requeueFlight();
					rejected = true;
					setSaveFailed(true);
					return;
				}

				if (!ready) {
					return;
				}

				if (message.type === 'invalidate' && message.revision > revision) {
					requestSnapshot();
				} else if (
					message.type === 'diff' &&
					!durable &&
					message.clientId !== clientId
				) {
					store.applyDiff(message.diff, 'remote');
				} else if (
					message.type === 'edit' &&
					message.revision !== undefined
				) {
					if (message.revision <= revision) {
						return;
					}

					if (message.revision !== revision + 1) {
						requestSnapshot();
						return;
					}

					const local = mergeDiff(inFlight?.diff ?? null, pending);
					const localIds = local
						? new Set([
								...Object.keys(local.added),
								...Object.keys(local.updated),
								...Object.keys(local.removed),
						  ])
						: undefined;
					const diff = decodeBoardChanges(
						store,
						message.changes,
						localIds
					);

					if (diff) {
						store.applyDiff(diff, 'remote');
						revision = message.revision;
					} else {
						requestSnapshot();
					}
				}
			});

			unsubClose = socket.onClose(() => {
				ready = false;
				requeueFlight();
				setIsSynced(false);

				if (!isUnmounted) {
					reconnectTimer = window.setTimeout(
						connect,
						RECONNECT_DELAY_MS
					);
				}
			});
		};

		window.addEventListener('pagehide', saveBeforeLeaving);
		connect();

		return () => {
			isUnmounted = true;
			saveBeforeLeaving();
			window.removeEventListener('pagehide', saveBeforeLeaving);

			if (editTimer !== null) {
				window.clearTimeout(editTimer);
			}

			if (reconnectTimer !== null) {
				window.clearTimeout(reconnectTimer);
			}

			unsubscribeStore();
			disconnect();
		};
	}, [store, teamId, userId]);

	return { isSynced, serverPersists, saveFailed };
};
