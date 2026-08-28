import type {
	ICreateTeam,
	ICreateTeamInvitation,
} from '../../store/student/types';

import { request } from './utils';

export const getMyGroup = () => {
	return request('/teams/study-groups/my/?semester_id=actual', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getMyTeam = () => {
	return request('/teams/my-team/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getTeamLobby = () => {
	return request('/teams/lobby/?semester_id=actual', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const createTeam = (data: ICreateTeam) => {
	return request('/teams/lobby/teams/?semester_id=actual', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify(data),
	});
};

export const deleteMyTeam = () => {
	return request('/teams/my-team/', {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const createTeamInvitation = (data: ICreateTeamInvitation) => {
	return request('/teams/my-team/invitations/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify(data),
	});
};

export const acceptTeamInvitation = (invitationId: number) => {
	return request(`/teams/lobby/invitations/${invitationId}/accept/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const rejectTeamInvitation = (invitationId: number) => {
	return request(`/teams/lobby/invitations/${invitationId}/reject/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const deleteTeamMember = (userId: number) => {
	return request(`/teams/my-team/members/${userId}/`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const leaveMyTeam = () => {
	return request('/teams/my-team/leave/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getMyTeamEventLog = () => {
	return request('/teams/my-team/event-log/?semester_id=actual', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const createTeamJoinRequest = (teamSemesterId: number) => {
	return request(`/teams/lobby/teams/${teamSemesterId}/join-requests/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const approveTeamJoinRequest = (requestId: number) => {
	return request(`/teams/my-team/join-requests/${requestId}/approve/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify({
			role: 'member',
		}),
	});
};

export const rejectTeamJoinRequest = (requestId: number) => {
	return request(`/teams/my-team/join-requests/${requestId}/reject/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const confirmTeamComposition = () => {
	return request('/teams/my-team/confirm-composition/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getStudentShowcase = () => {
	return request('/showcase/student-showcase/?semester_id=actual', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getStudentShowcaseDetail = (projectId: number) => {
	return request(
		`/showcase/student-showcase/projects/${projectId}/?semester_id=actual`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
			},
		}
	);
};
