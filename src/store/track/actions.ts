import type {
	IProject,
	ITrackGroup,
	ITrackGroupDetail,
	ICreateTrack,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getTrackProjects,
	getTrackGroups,
	getTrackGroupDetail,
	createTrack,
} from '../../shared/api/track';

export const getTrackProjectsAction = createAsyncThunk<IProject[]>(
	'track/getProjects',
	getTrackProjects
);

export const getTrackGroupsAction = createAsyncThunk<ITrackGroup[]>(
	'track/getTrackGroups',
	getTrackGroups
);

export const getTrackGroupDetailAction = createAsyncThunk<
	ITrackGroupDetail,
	number
>('track/getTrackGroupDetail', getTrackGroupDetail);

export const createTrackAction = createAsyncThunk<number, ICreateTrack>(
	'track/createTrack',
	createTrack
);
