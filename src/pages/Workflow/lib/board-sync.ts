import type { Diff, Snapshot } from '@quickdrawjs/react';

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
	  }
	| {
			type: 'diff';
			clientId: string;
			diff: Diff;
	  };

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

			socket.send(JSON.stringify(message));
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
