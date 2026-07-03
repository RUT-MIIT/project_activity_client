import type { IStatsStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IStatsStore = {
	stats: null,
	selectedInstitute: null,
	isLoading: false,
	error: null,
};

export const statsSlice = createSlice({
	name: 'stats',
	initialState,
	reducers: {
		setInstitute(state, action) {
			state.selectedInstitute = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getStatsAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.getStatsAction.fulfilled, (state, action) => {
				state.isLoading = false;
				state.stats = action.payload;
			})
			.addCase(actions.getStatsAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error =
					action.error?.message || 'Не удалось загрузить статистику';
			});
	},
});

export const { setInstitute } = statsSlice.actions;
