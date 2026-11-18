import type { Store } from '@quickdrawjs/react';

import { useEffect, useRef, useState } from 'react';
import { isDiffEmpty } from '@quickdrawjs/core';

import { createBoardSocketTransport } from './board-sync';

const RECONNECT_DELAY_MS = 1000;

export const useBoardSync = (store: Store, teamId: number | null) => {
	const [isSynced, setIsSynced] = useState(teamId === null);
	const clientIdRef = useRef(
		typeof crypto !== 'undefined' && crypto.randomUUID
			? crypto.randomUUID()
			: `client-${Date.now()}`
	);

	useEffect(() => {
		if (teamId === null) {
			setIsSynced(true);

			return;
		}

		let isUnmounted = false;
		let reconnectTimer: number | null = null;
		let transport: ReturnType<typeof createBoardSocketTransport> | null =
			null;
		let unsubStore: (() => void) | null = null;
		let unsubTransport: (() => void) | null = null;
		let unsubClose: (() => void) | null = null;

		const disconnect = () => {
			unsubStore?.();
			unsubStore = null;
			unsubTransport?.();
			unsubTransport = null;
			unsubClose?.();
			unsubClose = null;
			transport?.close();
			transport = null;
		};

		const connect = () => {
			if (isUnmounted) {
				return;
			}

			disconnect();
			setIsSynced(false);

			const nextTransport = createBoardSocketTransport(teamId);
			let canSendDiffs = false;

			transport = nextTransport;

			unsubStore = store.listen(
				(diff) => {
					if (!canSendDiffs || isDiffEmpty(diff)) {
						return;
					}

					nextTransport.send({
						type: 'diff',
						clientId: clientIdRef.current,
						diff,
					});
				},
				{ source: 'user' }
			);

			unsubTransport = nextTransport.subscribe((message) => {
				if (message.clientId === clientIdRef.current) {
					return;
				}

				if (message.type === 'snapshot') {
					store.loadSnapshot(message.snapshot, 'remote');
					canSendDiffs = true;
					setIsSynced(true);
					return;
				}

				if (message.type === 'diff' && canSendDiffs) {
					store.applyDiff(message.diff, 'remote');
				}
			});

			unsubClose = nextTransport.onClose((event) => {
				canSendDiffs = false;
				setIsSynced(false);

				console.warn('Board websocket closed', {
					code: event.code,
					reason: event.reason || '(empty)',
					wasClean: event.wasClean,
				});

				if (isUnmounted) {
					return;
				}

				reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
			});
		};

		connect();

		return () => {
			isUnmounted = true;

			if (reconnectTimer !== null) {
				window.clearTimeout(reconnectTimer);
			}

			disconnect();
		};
	}, [store, teamId]);

	return { isSynced };
};
