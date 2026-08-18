import type {
	ITrack,
	IProject,
	ITrackGroup,
	ITrackGroupDetail,
	ITrackProject,
	ITrackProjectDetail,
	ITrackStats,
	ISubdivisionStats,
	ICreateTrack,
	IAddGroupsToTrack,
	IAddProjectsToTrack,
	IRemoveGroupFromTrack,
	IRemoveProjectFromTrack,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getTrackList,
	getTrackProjects,
	getTrackProjectsList,
	getTrackProjectDetail,
	getTrackGroups,
	getTrackStats,
	getSubdivisionStats,
	getTrackGroupDetail,
	createTrack,
	addGroupsToTrack,
	addProjectsToTrack,
	removeTrack,
	removeGroupFromTrack,
	removeProjectFromTrack,
	removeLink,
} from '../../shared/api/track';

export const getTrackListAction = createAsyncThunk<ITrack[], string>(
	'track/getTrackList',
	getTrackList
);

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

export const getSubdivisionStatsAction = createAsyncThunk<ISubdivisionStats>(
	'track/getSubdivisionStats',
	getSubdivisionStats
);

export const createTrackAction = createAsyncThunk<ITrack, ICreateTrack>(
	'track/createTrack',
	createTrack
);

export const addGroupsToTrackAction = createAsyncThunk<
	ITrack,
	IAddGroupsToTrack
>('track/addGroupsToTrack', addGroupsToTrack);

export const addProjectsToTrackAction = createAsyncThunk<
	ITrack,
	IAddProjectsToTrack
>('track/addProjectsToTrack', addProjectsToTrack);

export const createFullTrackAction = createAsyncThunk<
	ITrack,
	{
		track: ICreateTrack;
		group_ids: number[];
		projects: {
			id: number;
			teamsCount: number;
		}[];
	}
>('track/createFullTrack', async (data, { dispatch }) => {
	const track = await dispatch(createTrackAction(data.track)).unwrap();

	const trackId = track.id;

	if (data.group_ids.length > 0) {
		await dispatch(
			addGroupsToTrackAction({
				trackId,
				group_ids: data.group_ids,
			})
		).unwrap();
	}

	if (data.projects.length > 0) {
		await dispatch(
			addProjectsToTrackAction({
				trackId,
				projects: data.projects,
			})
		).unwrap();
	}

	return track;
});

export const removeTrackAction = createAsyncThunk<number, number>(
	'track/removeTrack',
	async (trackId) => {
		await removeTrack(trackId);
		return trackId;
	}
);

export const removeGroupFromTrackAction = createAsyncThunk<
	IRemoveGroupFromTrack,
	IRemoveGroupFromTrack
>('track/removeGroupFromTrack', async (data) => {
	await removeGroupFromTrack(data.trackId, data.groupId);

	return data;
});

export const removeProjectFromTrackAction = createAsyncThunk<
	IRemoveProjectFromTrack,
	IRemoveProjectFromTrack
>('track/removeProjectFromTrack', async (data) => {
	await removeProjectFromTrack(data.trackId, data.projectId);

	return data;
});

export const removeLinkAction = createAsyncThunk<
	void,
	{
		semester_id: string;
		group_id: number;
		project_application_id: number;
	}
>('track/removeLink', removeLink);
