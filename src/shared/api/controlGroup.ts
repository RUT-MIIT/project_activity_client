import type {
	IAssignMentorRequest,
	IRemoveMentorRequest,
} from '../../store/controlGroup/types';

import { request } from './utils';

const getAuthHeaders = () => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

export const getInstituteGroups = () => {
	return request('/teams/institute-responsible/groups/?semester_id=actual', {
		method: 'GET',
		headers: getAuthHeaders(),
	});
};

export const getInstituteEmployees = () => {
	return request('/teams/institute-responsible/employees/', {
		method: 'GET',
		headers: getAuthHeaders(),
	});
};

export const getGroupMentors = () => {
	return request(
		'/teams/institute-responsible/group-mentors/?semester_id=actual',
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};

export const assignGroupMentor = (data: IAssignMentorRequest) => {
	return request(
		`/teams/institute-responsible/groups/${data.groupId}/mentor/?semester_id=${
			data.semesterId || 'actual'
		}`,
		{
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				mentorId: data.mentorId,
			}),
		}
	);
};

export const removeGroupMentor = (data: IRemoveMentorRequest) => {
	return request(
		`/teams/institute-responsible/groups/${data.groupId}/mentor/?semester_id=${
			data.semesterId || 'actual'
		}&mentor_id=${data.mentorId}`,
		{
			method: 'DELETE',
			headers: getAuthHeaders(),
		}
	);
};
