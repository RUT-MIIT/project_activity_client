import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { IDashboardStore, TDashboardStudentStatus } from './types';

import * as actions from './actions';

const initialState: IDashboardStore = {
	mentors: [],
	mentorDetail: null,
	selectedInstitute: null,
	selectedCourse: null,
	selectedStudentStatus: 'all',
};

export const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,

	reducers: {
		setInstitute(state, action: PayloadAction<string | null>) {
			state.selectedInstitute = action.payload;
		},

		setCourse(state, action: PayloadAction<number | null>) {
			state.selectedCourse = action.payload;
		},

		setStudentStatus(state, action: PayloadAction<TDashboardStudentStatus>) {
			state.selectedStudentStatus = action.payload;
		},

		resetFilters(state) {
			state.selectedInstitute = null;
			state.selectedCourse = null;
			state.selectedStudentStatus = 'all';
		},
	},

	extraReducers: (builder) => {
		builder.addCase(actions.getMentorsAction.fulfilled, (state, action) => {
			state.mentors = action.payload;
		});
		builder.addCase(
			actions.getMentorDetailAction.fulfilled,
			(state, action) => {
				state.mentorDetail = action.payload;
			}
		);
	},
});

export const { setInstitute, setCourse, setStudentStatus, resetFilters } =
	dashboardSlice.actions;
