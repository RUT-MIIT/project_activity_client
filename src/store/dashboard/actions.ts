import type {
	IStatsGroup,
	IStatsGroupDetail,
	IStatsMentor,
	IStatsMentorDetail,
	IStatsProject,
	IStatsProjectDetail,
	IStatsStudent,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getGroupStatsDetail,
	getGroupsStats,
	getMentorDetail,
	getMentors,
	getProjectDetail,
	getProjects,
	getStudentsStats,
} from '../../shared/api/dashboard';

export const getStudentsStatsAction = createAsyncThunk<IStatsStudent[]>(
	'dashboard/getStudentsStats',
	getStudentsStats
);

export const getMentorsAction = createAsyncThunk<IStatsMentor[]>(
	'dashboard/getMentors',
	getMentors
);

export const getMentorDetailAction = createAsyncThunk<
	IStatsMentorDetail,
	number
>('dashboard/getMentorDetail', getMentorDetail);

export const getProjectsAction = createAsyncThunk<IStatsProject[]>(
	'dashboard/getProjects',
	getProjects
);

export const getProjectDetailAction = createAsyncThunk<
	IStatsProjectDetail,
	number
>('dashboard/getProjectDetail', getProjectDetail);

export const getGroupsStatsAction = createAsyncThunk<IStatsGroup[]>(
	'dashboard/getGroupsStats',
	getGroupsStats
);

export const getGroupStatsDetailAction = createAsyncThunk<
	IStatsGroupDetail,
	number
>('dashboard/getGroupStatsDetail', getGroupStatsDetail);
