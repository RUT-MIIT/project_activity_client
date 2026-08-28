import type {
	IGroup,
	IMyTeam,
	ITeamLobby,
	ICreateTeam,
	ICreateTeamInvitation,
	ITeamInvitationResponse,
	ITeamInvitationRejectResponse,
	ITeamEventLogResponse,
	ITeamJoinRequestResponse,
	IStudentShowcase,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getMyGroup,
	getMyTeam,
	getTeamLobby,
	createTeam,
	deleteMyTeam,
	createTeamInvitation,
	acceptTeamInvitation,
	rejectTeamInvitation,
	deleteTeamMember,
	leaveMyTeam,
	getMyTeamEventLog,
	createTeamJoinRequest,
	approveTeamJoinRequest,
	rejectTeamJoinRequest,
	confirmTeamComposition,
	getStudentShowcase,
	getStudentShowcaseDetail,
} from '../../shared/api/student';

export const getMyGroupAction = createAsyncThunk<IGroup>(
	'student/getMyGroup',
	getMyGroup
);

export const getMyTeamAction = createAsyncThunk<IMyTeam>(
	'student/getMyTeam',
	getMyTeam
);

export const getTeamLobbyAction = createAsyncThunk<ITeamLobby>(
	'student/getTeamLobby',
	getTeamLobby
);

export const createTeamAction = createAsyncThunk<IMyTeam, ICreateTeam>(
	'student/createTeam',
	createTeam
);

export const deleteMyTeamAction = createAsyncThunk<void>(
	'student/deleteMyTeam',
	deleteMyTeam
);

export const createTeamInvitationAction = createAsyncThunk<
	ITeamInvitationResponse,
	ICreateTeamInvitation
>('student/createTeamInvitation', createTeamInvitation);

export const acceptTeamInvitationAction = createAsyncThunk<IMyTeam, number>(
	'student/acceptTeamInvitation',
	acceptTeamInvitation
);

export const rejectTeamInvitationAction = createAsyncThunk<
	ITeamInvitationRejectResponse,
	number
>('student/rejectTeamInvitation', rejectTeamInvitation);

export const deleteTeamMemberAction = createAsyncThunk<IMyTeam, number>(
	'student/deleteTeamMember',
	deleteTeamMember
);

export const leaveMyTeamAction = createAsyncThunk<void>(
	'student/leaveMyTeam',
	leaveMyTeam
);

export const getMyTeamEventLogAction = createAsyncThunk<ITeamEventLogResponse>(
	'student/getMyTeamEventLog',
	getMyTeamEventLog
);

export const createTeamJoinRequestAction = createAsyncThunk<
	ITeamJoinRequestResponse,
	number
>('student/createTeamJoinRequest', createTeamJoinRequest);

export const approveTeamJoinRequestAction = createAsyncThunk<IMyTeam, number>(
	'student/approveTeamJoinRequest',
	approveTeamJoinRequest
);

export const rejectTeamJoinRequestAction = createAsyncThunk<IMyTeam, number>(
	'student/rejectTeamJoinRequest',
	rejectTeamJoinRequest
);

export const confirmTeamCompositionAction = createAsyncThunk<IMyTeam>(
	'student/confirmTeamComposition',
	confirmTeamComposition
);

export const getStudentShowcaseAction = createAsyncThunk<IStudentShowcase>(
	'student/getStudentShowcase',
	getStudentShowcase
);

export const getStudentShowcaseDetailAction = createAsyncThunk(
	'student/getStudentShowcaseDetail',
	async (projectId: number, { rejectWithValue }) => {
		try {
			return await getStudentShowcaseDetail(projectId);
		} catch (error) {
			return rejectWithValue(error);
		}
	}
);
