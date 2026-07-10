import type {
	IProject,
	ITrackGroup,
	ITrackGroupDetail,
	ITrackProject,
	ITrackProjectDetail,
	ITrackStats,
	ICreateTrack,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getTrackProjects,
	getTrackProjectsList,
	getTrackProjectDetail,
	getTrackGroups,
	getTrackStats,
	getTrackGroupDetail,
	createTrack,
	removeLink,
} from '../../shared/api/track';

export const getTrackProjectsAction = createAsyncThunk<IProject[]>(
	'track/getProjects',
	getTrackProjects
);

export const getTrackGroupsAction = createAsyncThunk<ITrackGroup[], string>(
	'track/getTrackGroups',
	getTrackGroups
);

export const getTrackGroupDetailAction = createAsyncThunk<
	ITrackGroupDetail,
	{
		groupId: number;
		instituteCode: string;
	}
>('track/getTrackGroupDetail', getTrackGroupDetail);

export const getTrackProjectsListAction = createAsyncThunk<
	ITrackProject[],
	string
>('track/getProjectsList', getTrackProjectsList);

export const getTrackProjectDetailAction = createAsyncThunk<
	ITrackProjectDetail,
	{
		projectId: number;
		instituteCode: string;
	}
>('track/getProjectDetail', getTrackProjectDetail);

export const getTrackStatsAction = createAsyncThunk<ITrackStats, string>(
	'track/getTrackStats',
	getTrackStats
);

export const createTrackAction = createAsyncThunk<number, ICreateTrack>(
	'track/createTrack',
	createTrack
);

export const removeLinkAction = createAsyncThunk<
	void,
	{
		semester_id: string;
		group_id: number;
		project_application_id: number;
	}
>('track/removeLink', removeLink);
