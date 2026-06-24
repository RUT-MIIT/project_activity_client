import type { ITrackStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: ITrackStore = {
	projects: [],
	trackGroups: [],
	trackGroupDetail: null,
	isLoadingProjects: false,
	isLoadingTrackGroups: false,
	isLoadingDetail: false,
	isLoading: false,
	error: null,
};

export const trackSlice = createSlice({
	name: 'track',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getTrackProjectsAction.pending, (state) => {
				state.isLoadingProjects = true;
				state.error = null;
			})
			.addCase(actions.getTrackProjectsAction.fulfilled, (state, action) => {
				state.isLoadingProjects = false;
				state.projects = action.payload;
			})
			.addCase(actions.getTrackProjectsAction.rejected, (state, action) => {
				state.isLoadingProjects = false;
				state.error = action.error?.message || 'Не удалось загрузить проекты';
			})
			.addCase(actions.getTrackGroupsAction.pending, (state) => {
				state.isLoadingTrackGroups = true;
				state.error = null;
			})
			.addCase(actions.getTrackGroupsAction.fulfilled, (state, action) => {
				state.isLoadingTrackGroups = false;
				state.trackGroups = action.payload;
			})
			.addCase(actions.getTrackGroupsAction.rejected, (state, action) => {
				state.isLoadingTrackGroups = false;
				state.error = action.error?.message || 'Не удалось загрузить группы';
			})
			.addCase(actions.getTrackGroupDetailAction.pending, (state) => {
				state.isLoadingDetail = true;
				state.error = null;
			})
			.addCase(actions.getTrackGroupDetailAction.fulfilled, (state, action) => {
				state.isLoadingDetail = false;
				state.trackGroupDetail = action.payload;
			})
			.addCase(actions.getTrackGroupDetailAction.rejected, (state, action) => {
				state.isLoadingDetail = false;
				state.error = action.error?.message || 'Не удалось загрузить данные';
			})
			.addCase(actions.createTrackAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.createTrackAction.fulfilled, (state, action) => {
				state.isLoading = false;
				console.log(action.payload);
			})
			.addCase(actions.createTrackAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Не удалось создать трек';
			});
	},
});
