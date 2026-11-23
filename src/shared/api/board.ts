import type { Snapshot } from '@quickdrawjs/react';

import { API_URL } from '../config';
import { request } from './utils';

const getAuthHeaders = () => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

const getBoardPath = (semesterId?: number | null) => {
	if (semesterId) {
		return `/teams/my-team/board/?semester_id=${semesterId}`;
	}

	return '/teams/my-team/board/';
};

export const getTeamBoard = (semesterId?: number | null) => {
	return request(getBoardPath(semesterId), {
		method: 'GET',
		headers: getAuthHeaders(),
	}) as Promise<{ snapshot: Snapshot }>;
};

export const putTeamBoard = (
	snapshot: Snapshot,
	semesterId?: number | null
) => {
	return request(getBoardPath(semesterId), {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify({ snapshot }),
	}) as Promise<{ snapshot: Snapshot }>;
};

export const getBoardWebSocketUrl = (teamId: number) => {
	const apiUrl = new URL(API_URL);
	const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
	const token = encodeURIComponent(localStorage.getItem('accessToken') || '');

	return `${protocol}//${apiUrl.host}/ws/teams/${teamId}/board/?token=${token}&sync=2`;
};
