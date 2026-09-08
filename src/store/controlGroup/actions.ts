import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getInstituteGroups,
	getInstituteGroupsWithTeams,
	getInstituteTeams,
	getInstituteStudents,
	getInstituteEmployees,
	getGroupMentors,
	assignGroupMentor,
	removeGroupMentor,
} from '../../shared/api/controlGroup';

import type {
	IResponsibleGroup,
	IResponsibleGroupWithTeams,
	IInstituteTeam,
	IInstituteStudent,
	IResponsibleEmployee,
	IGroupMentors,
	IAssignMentorRequest,
	IAssignMentorResponse,
	IRemoveMentorRequest,
	IRemoveMentorResponse,
} from './types';

export const getInstituteGroupsAction = createAsyncThunk<IResponsibleGroup[]>(
	'controlGroup/getGroups',
	getInstituteGroups
);

export const getInstituteGroupsWithTeamsAction = createAsyncThunk<
	IResponsibleGroupWithTeams[]
>('controlGroup/getGroupsWithTeams', getInstituteGroupsWithTeams);

export const getInstituteTeamsAction = createAsyncThunk<IInstituteTeam[]>(
	'controlGroup/getTeams',
	getInstituteTeams
);

export const getInstituteStudentsAction = createAsyncThunk<IInstituteStudent[]>(
	'controlGroup/getStudents',
	getInstituteStudents
);

export const getInstituteEmployeesAction = createAsyncThunk<
	IResponsibleEmployee[]
>('controlGroup/getEmployees', getInstituteEmployees);

export const getGroupMentorsAction = createAsyncThunk<IGroupMentors[]>(
	'controlGroup/getGroupMentors',
	getGroupMentors
);

export const assignGroupMentorAction = createAsyncThunk<
	IAssignMentorResponse,
	IAssignMentorRequest
>('controlGroup/assignGroupMentor', assignGroupMentor);

export const removeGroupMentorAction = createAsyncThunk<
	IRemoveMentorResponse,
	IRemoveMentorRequest
>('controlGroup/removeGroupMentor', removeGroupMentor);
