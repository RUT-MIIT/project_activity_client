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

export const getTrackGroups = () => {
	return request(
		'/showcase/project-tracks/groups/?institute_code=IEF&semester_id=2',
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

export const getTrackGroupDetail = (groupId: number) => {
	return request(
		`/showcase/project-tracks/groups/${groupId}/?institute_code=IEF&semester_id=2`,
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
