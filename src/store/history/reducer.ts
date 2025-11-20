import type { IHistoryStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IHistoryStore = {
	logs: [],
	isLoadingLogs: false,
	error: null,
};

export const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getAppHistoryAction.pending, (state) => {
				state.isLoadingLogs = true;
				state.error = null;
			})
			.addCase(actions.getAppHistoryAction.fulfilled, (state, action) => {
				state.isLoadingLogs = false;
				state.logs = action.payload;
			})
			.addCase(actions.getAppHistoryAction.rejected, (state, action) => {
				state.isLoadingLogs = false;
				state.error = action.error?.message || 'Не удалось загрузить заявки';
			});
	},
});
