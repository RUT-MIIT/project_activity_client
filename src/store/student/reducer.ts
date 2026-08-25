import type { IStudentStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IStudentStore = {
	group: null,
	isLoadingGroup: false,
	isLoadingAction: false,
	error: null,
};

export const studentSlice = createSlice({
	name: 'student',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getMyGroupAction.pending, (state) => {
				state.isLoadingGroup = true;
				state.error = null;
			})
			.addCase(actions.getMyGroupAction.fulfilled, (state, action) => {
				state.isLoadingGroup = false;
				state.group = action.payload;
			})
			.addCase(actions.getMyGroupAction.rejected, (state, action) => {
				state.isLoadingGroup = false;
				state.error = action.error?.message || 'Не удалось загрузить группу';
			});
	},
});
