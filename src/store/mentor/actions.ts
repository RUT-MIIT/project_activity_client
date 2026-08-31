import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getMyGroups,
	getMyGroupDetail,
	getMyGroupShowcase,
	getMyGroupShowcaseDetail,
	getMentorTeam,
	updateMentorTeamName,
	updateMentorTeamCaptain,
	confirmMentorTeamComposition,
	unconfirmMentorTeamComposition,
	addMentorTeamMember,
	removeMentorTeamMember,
	deleteMentorTeam,
} from '../../shared/api/mentor';

import type {
	IMentorGroup,
	IMentorGroupDetail,
	IMentorShowcaseTrack,
	IMentorShowcaseDetail,
	IMentorTeam,
	IUpdateMentorTeamNameRequest,
	IUpdateMentorTeamCaptainRequest,
	IConfirmMentorTeamCompositionRequest,
	IUnconfirmMentorTeamCompositionRequest,
	IAddMentorTeamMemberRequest,
	IRemoveMentorTeamMemberRequest,
	IDeleteMentorTeamRequest,
} from './types';

/* =========================
 * Группы
 * ========================= */

export const getMyGroupsAction = createAsyncThunk<IMentorGroup[]>(
	'mentor/getMyGroups',
	getMyGroups
);

export const getMyGroupDetailAction = createAsyncThunk<
	IMentorGroupDetail,
	number
>('mentor/getMyGroupDetail', getMyGroupDetail);

/* =========================
 * Витрина проектов
 * ========================= */

export const getMyGroupShowcaseAction = createAsyncThunk<
	IMentorShowcaseTrack[],
	number
>('mentor/getMyGroupShowcase', getMyGroupShowcase);

export const getMyGroupShowcaseDetailAction = createAsyncThunk<
	IMentorShowcaseDetail,
	number
>('mentor/getMyGroupShowcaseDetail', getMyGroupShowcaseDetail);

/* =========================
 * Управление командой
 * ========================= */

/**
 * Переименовать команду
 */
export const updateMentorTeamNameAction = createAsyncThunk<
	IMentorTeam,
	IUpdateMentorTeamNameRequest
>('mentor/updateTeamName', updateMentorTeamName);

/**
 * Назначить капитана
 */
export const updateMentorTeamCaptainAction = createAsyncThunk<
	IMentorTeam,
	IUpdateMentorTeamCaptainRequest
>('mentor/updateTeamCaptain', updateMentorTeamCaptain);

/**
 * Подтвердить состав
 */
export const confirmMentorTeamCompositionAction = createAsyncThunk<
	IMentorTeam,
	IConfirmMentorTeamCompositionRequest
>('mentor/confirmTeamComposition', confirmMentorTeamComposition);

/**
 * Вернуть состав на редактирование
 */
export const unconfirmMentorTeamCompositionAction = createAsyncThunk<
	IMentorTeam,
	IUnconfirmMentorTeamCompositionRequest
>('mentor/unconfirmTeamComposition', unconfirmMentorTeamComposition);

/**
 * Добавить участника
 */
export const addMentorTeamMemberAction = createAsyncThunk<
	IMentorTeam,
	IAddMentorTeamMemberRequest
>('mentor/addTeamMember', addMentorTeamMember);

/**
 * Удалить участника
 */
export const removeMentorTeamMemberAction = createAsyncThunk<
	IMentorTeam,
	IRemoveMentorTeamMemberRequest
>('mentor/removeTeamMember', removeMentorTeamMember);

/**
 * Удалить команду
 */
export const deleteMentorTeamAction = createAsyncThunk<
	void,
	IDeleteMentorTeamRequest
>('mentor/deleteTeam', deleteMentorTeam);

export const getMentorTeamAction = createAsyncThunk<
	IMentorTeam,
	{
		groupId: number;
		teamId: number;
	}
>('mentor/getMentorTeam', ({ groupId, teamId }) =>
	getMentorTeam(groupId, teamId)
);
