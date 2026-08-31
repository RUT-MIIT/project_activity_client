import type {
	IUpdateMentorTeamNameRequest,
	IUpdateMentorTeamCaptainRequest,
	IConfirmMentorTeamCompositionRequest,
	IUnconfirmMentorTeamCompositionRequest,
	IAddMentorTeamMemberRequest,
	IRemoveMentorTeamMemberRequest,
	IDeleteMentorTeamRequest,
} from '../../store/mentor/types';

import { request } from './utils';

const getAuthHeaders = () => ({
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

/* =========================
 * Мои группы
 * ========================= */

/**
 * Группы, в которых текущий пользователь является наставником.
 */
export const getMyGroups = () => {
	return request('/teams/study-groups/my-groups/?semester_id=actual', {
		method: 'GET',
		headers: getAuthHeaders(),
	});
};

/**
 * Детальная информация об учебной группе.
 */
export const getMyGroupDetail = (groupId: number) => {
	return request(
		`/teams/study-groups/${groupId}/mentor-detail/?semester_id=actual`,
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};

/* =========================
 * Витрина проектов группы
 * ========================= */

/**
 * Витрина проектов конкретной группы.
 */
export const getMyGroupShowcase = (groupId: number) => {
	return request(
		`/teams/study-groups/${groupId}/project-showcase/?semester_id=actual`,
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};

/**
 * Детальная информация о проекте.
 *
 * Используется существующий endpoint showcase.
 */
export const getMyGroupShowcaseDetail = (projectId: number) => {
	return request(`/showcase/project-applications/${projectId}/`, {
		method: 'GET',
		headers: getAuthHeaders(),
	});
};

/* =========================
 * Управление командой
 * ========================= */

/**
 * Переименовать команду.
 */
export const updateMentorTeamName = (data: IUpdateMentorTeamNameRequest) => {
	return request(
		`/teams/study-groups/${data.groupId}/teams/${
			data.teamSemesterId
		}/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'PATCH',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				name: data.name,
			}),
		}
	);
};

/**
 * Назначить капитана команды.
 */
export const updateMentorTeamCaptain = (
	data: IUpdateMentorTeamCaptainRequest
) => {
	return request(
		`/teams/study-groups/${data.groupId}/teams/${
			data.teamSemesterId
		}/captain/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'PATCH',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				captainId: data.captainId,
			}),
		}
	);
};

/**
 * Подтвердить состав команды.
 */
export const confirmMentorTeamComposition = (
	data: IConfirmMentorTeamCompositionRequest
) => {
	return request(
		`/teams/study-groups/${data.groupId}/teams/${
			data.teamSemesterId
		}/confirm-composition/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'POST',
			headers: getAuthHeaders(),
		}
	);
};

/**
 * Вернуть состав команды на редактирование.
 */
export const unconfirmMentorTeamComposition = (
	data: IUnconfirmMentorTeamCompositionRequest
) => {
	return request(
		`/teams/study-groups/${data.groupId}/teams/${
			data.teamSemesterId
		}/unconfirm-composition/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'POST',
			headers: getAuthHeaders(),
		}
	);
};

/**
 * Добавить участника в команду.
 *
 * Передаётся ровно одно из:
 * - userId
 * - preRegisteredStudentId
 */
export const addMentorTeamMember = (data: IAddMentorTeamMemberRequest) => {
	const body: {
		userId?: number;
		preRegisteredStudentId?: number;
	} = {};

	if (data.userId !== undefined) {
		body.userId = data.userId;
	}

	if (data.preRegisteredStudentId !== undefined) {
		body.preRegisteredStudentId = data.preRegisteredStudentId;
	}

	return request(
		`/teams/study-groups/${data.groupId}/teams/${
			data.teamSemesterId
		}/members/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify(body),
		}
	);
};

/**
 * Удалить участника из команды.
 */
export const removeMentorTeamMember = (
	data: IRemoveMentorTeamMemberRequest
) => {
	return request(
		`/teams/study-groups/${data.groupId}/teams/${data.teamSemesterId}/members/${
			data.userId
		}/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'DELETE',
			headers: getAuthHeaders(),
		}
	);
};

/**
 * Удалить команду.
 *
 * По API команда может быть удалена только при нулевом составе.
 */
export const deleteMentorTeam = (data: IDeleteMentorTeamRequest) => {
	return request(
		`/teams/study-groups/${data.groupId}/teams/${
			data.teamSemesterId
		}/?semester_id=${data.semesterId || 'actual'}`,
		{
			method: 'DELETE',
			headers: getAuthHeaders(),
		}
	);
};

export const getMentorTeam = (groupId: number, teamId: number) => {
	return request(
		`/teams/study-groups/${groupId}/teams/${teamId}/?semester_id=actual`,
		{
			method: 'GET',
			headers: getAuthHeaders(),
		}
	);
};
