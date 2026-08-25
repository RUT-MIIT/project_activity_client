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
