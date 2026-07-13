import type { ICreateTrack } from '../../store/track/types';

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
