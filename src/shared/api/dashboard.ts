import { request } from './utils';

const getAuthHeaders = () => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

export const getStudentsStats = () => {
	return request(
		'/teams/institute-responsible/students-stats/?semester_id=actual',
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};

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

export const getProjects = () => {
	return request('/teams/institute-responsible/projects/?semester_id=actual', {
		method: 'GET',
		headers: getAuthHeaders(),
	});
};

export const getProjectDetail = (id: number) => {
	return request(
		`/teams/institute-responsible/projects/${id}/?semester_id=actual`,
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};

export const getGroupsStats = () => {
	return request(
		'/teams/institute-responsible/groups-stats/?semester_id=actual',
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};

export const getGroupStatsDetail = (id: number) => {
	return request(
		`/teams/institute-responsible/groups-stats/${id}/?semester_id=actual`,
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};
