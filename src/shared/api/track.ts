import type {
	ICreateTrack,
	IAddGroupsToTrack,
	IAddProjectsToTrack,
} from '../../store/track/types';

import { request } from './utils';

export const getTrackProjects = () => {
	return request('/showcase/projects/?semester_id=actual', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getTrackList = (instituteCode: string) => {
	return request(
		`/showcase/project-tracks/?institute_code=${instituteCode}&semester_id=actual`,
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

export const getTrackGroups = (instituteCode: string) => {
	return request(
		`/showcase/project-tracks/groups/?institute_code=${instituteCode}&semester_id=actual`,
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

export const getTrackGroupDetail = ({
	groupId,
	instituteCode,
}: {
	groupId: number;
	instituteCode: string;
}) => {
	return request(
		`/showcase/project-tracks/groups/${groupId}/?institute_code=${instituteCode}&semester_id=actual`,
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

export const getTrackProjectsList = (instituteCode: string) => {
	return request(
		`/showcase/project-tracks/projects/?institute_code=${instituteCode}&semester_id=actual`,
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

export const getTrackProjectDetail = ({
	projectId,
	instituteCode,
}: {
	projectId: number;
	instituteCode: string;
}) => {
	return request(
		`/showcase/project-tracks/projects/${projectId}/?institute_code=${instituteCode}&semester_id=actual`,
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

export const getTrackStats = (instituteCode: string) => {
	return request(
		`/showcase/project-tracks/statistics/?institute_code=${instituteCode}&semester_id=actual`,
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

export const getSubdivisionStats = () => {
	return request('/showcase/project-tracks/statistics/?semester_id=actual', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const createTrack = (data: ICreateTrack) => {
	return request('/showcase/project-tracks/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify(data),
	});
};

export const addGroupsToTrack = (data: IAddGroupsToTrack) => {
	return request(`/showcase/project-tracks/${data.trackId}/groups/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify({ group_ids: data.group_ids }),
	});
};

export const addProjectsToTrack = (data: IAddProjectsToTrack) => {
	return request(`/showcase/project-tracks/${data.trackId}/applications/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify(data.projects),
	});
};

export const removeTrack = (trackId: number) => {
	return request(`/showcase/project-tracks/${trackId}/`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const removeGroupFromTrack = (trackId: number, groupId: number) => {
	return request(`/showcase/project-tracks/${trackId}/groups/${groupId}/`, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const removeProjectFromTrack = (
	trackId: number,
	applicationId: number
) => {
	return request(
		`/showcase/project-tracks/${trackId}/applications/${applicationId}/`,
		{
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
			},
		}
	);
};

export const removeLink = (data: {
	semester_id: string;
	group_id: number;
	project_application_id: number;
}) => {
	return request('/showcase/project-tracks/', {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify(data),
	});
};
