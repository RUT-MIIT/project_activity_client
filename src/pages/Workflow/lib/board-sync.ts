import type { Diff, Snapshot } from '@quickdrawjs/react';
import type { BoardChanges } from './board-edits';

import { getBoardWebSocketUrl } from '../../../shared/api/board';

export type BoardSyncMessage =
	| {
			type: 'hello';
			clientId: string;
	  }
	| {
			type: 'snapshot';
			clientId: string;
			snapshot: Snapshot;
			protocol?: number;
			revision?: number;
			retry?: number;
	  }
	| {
			type: 'diff';
			clientId: string;
			diff: Diff;
	  }
	| {
			type: 'edit';
			clientId: string;
			changes: BoardChanges;
			revision?: number;
			sequence?: number;
	  }
	| { type: 'ack'; sequence: number; revision: number }
	| { type: 'edit-rejected'; sequence: number }
	| { type: 'invalidate'; revision: number };

type BoardEditChunkMessage = {
	type: 'edit-chunk';
	clientId: string;
	offset: number;
	data: string;
	final: boolean;
};

const MAX_SOCKET_BYTES = 512 * 1024;
const CHUNK_BYTES = 64 * 1024;

const encodeBytes = (bytes: Uint8Array) =>
	btoa(
		Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
	);

export const createBoardSocketTransport = (teamId: number) => {
	const socket = new WebSocket(getBoardWebSocketUrl(teamId));
	const handlers = new Set<(message: BoardSyncMessage) => void>();

	socket.addEventListener('message', (event: MessageEvent<string>) => {
		try {
			const message = JSON.parse(event.data) as BoardSyncMessage;

			handlers.forEach((handler) => handler(message));
		} catch {
			return;
		}
	});

	return {
		send: (message: BoardSyncMessage) => {
			if (socket.readyState !== WebSocket.OPEN) {
				return;
			}

			const serialized = JSON.stringify(message);

			if (message.type !== 'edit') {
				socket.send(serialized);
				return;
			}

			const bytes = new TextEncoder().encode(serialized);

			if (bytes.length <= MAX_SOCKET_BYTES) {
				socket.send(serialized);
				return;
			}

			for (let offset = 0; offset < bytes.length; offset += CHUNK_BYTES) {
				const end = Math.min(offset + CHUNK_BYTES, bytes.length);
				const chunk: BoardEditChunkMessage = {
					type: 'edit-chunk',
					clientId: message.clientId,
					offset,
					data: encodeBytes(bytes.subarray(offset, end)),
					final: end === bytes.length,
				};

				socket.send(JSON.stringify(chunk));
			}
		},
		subscribe: (handler: (message: BoardSyncMessage) => void) => {
			handlers.add(handler);

			return () => {
				handlers.delete(handler);
			};
		},
		close: () => {
			handlers.clear();
			socket.close();
		},
		get readyState() {
			return socket.readyState;
		},
		onOpen: (handler: () => void) => {
			socket.addEventListener('open', handler);

			return () => socket.removeEventListener('open', handler);
		},
		onClose: (handler: (event: CloseEvent) => void) => {
			socket.addEventListener('close', handler);

			return () => socket.removeEventListener('close', handler);
		},
	};
};
