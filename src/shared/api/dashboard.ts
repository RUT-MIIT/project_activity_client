import { request } from './utils';

const getAuthHeaders = () => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

export const getMentors = () => {
	return request('/teams/institute-responsible/mentors/?semester_id=actual', {
		method: 'GET',
		headers: getAuthHeaders(),
	});
};

export const getMentorDetail = (id: number) => {
	return request(
		`/teams/institute-responsible/mentors/${id}/?semester_id=actual`,
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};
