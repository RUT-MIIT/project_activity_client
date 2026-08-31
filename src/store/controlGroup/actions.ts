import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getInstituteGroups,
	getInstituteEmployees,
	getGroupMentors,
	assignGroupMentor,
	removeGroupMentor,
} from '../../shared/api/controlGroup';

import type {
	IResponsibleGroup,
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
