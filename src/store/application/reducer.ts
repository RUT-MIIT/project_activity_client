import type { IApplicationStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IApplicationStore = {
	application: null,
	applications: [],
	externalApplications: [],
	isLoading: false,
	error: null,
};

export const applicationSlice = createSlice({
	name: 'application',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getAppsAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.getAppsAction.fulfilled, (state, action) => {
				state.isLoading = false;
				state.applications = action.payload;
			})
			.addCase(actions.getAppsAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Не удалось загрузить заявки';
			})
			.addCase(actions.createAppMainAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.createAppMainAction.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(actions.createAppMainAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Произошла ошибка';
			})
			.addCase(actions.createAppPublicAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.createAppPublicAction.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(actions.createAppPublicAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Произошла ошибка';
			})
			.addCase(actions.getExternalAppsAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.getExternalAppsAction.fulfilled, (state, action) => {
				state.isLoading = false;
				state.externalApplications = action.payload;
			})
			.addCase(actions.getExternalAppsAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Не удалось загрузить заявки';
			});
	},
});
