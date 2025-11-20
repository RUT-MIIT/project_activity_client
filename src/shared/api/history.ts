import { request } from './utils';

export const getAppHistory = (appId: string) => {
	return request(`/showcase/project-applications/${appId}/status_logs`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};
