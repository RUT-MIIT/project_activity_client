import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { IDashboardStore, TDashboardStudentStatus } from './types';

import * as actions from './actions';

const initialState: IDashboardStore = {
	students: [],

	mentors: [],
	mentorDetail: null,

	projects: [],
	projectDetail: null,

	groups: [],
	groupDetail: null,

	isLoadingStudents: false,

	isLoadingMentors: false,
	isLoadingMentorDetail: false,

	isLoadingProjects: false,
	isLoadingProjectDetail: false,

	isLoadingGroups: false,
	isLoadingGroupDetail: false,

	error: null,

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
		/* =========================
		 * Студенты
		 * ========================= */

		builder.addCase(actions.getStudentsStatsAction.pending, (state) => {
			state.isLoadingStudents = true;
			state.error = null;
		});

		builder.addCase(
			actions.getStudentsStatsAction.fulfilled,
			(state, action) => {
				state.isLoadingStudents = false;
				state.students = action.payload;
			}
		);

		builder.addCase(
			actions.getStudentsStatsAction.rejected,
			(state, action) => {
				state.isLoadingStudents = false;
				state.error =
					action.error.message || 'Не удалось загрузить статистику студентов';
			}
		);

		/* =========================
		 * Наставники
		 * ========================= */

		builder.addCase(actions.getMentorsAction.pending, (state) => {
			state.isLoadingMentors = true;
			state.error = null;
		});

		builder.addCase(actions.getMentorsAction.fulfilled, (state, action) => {
			state.isLoadingMentors = false;
			state.mentors = action.payload;
		});

		builder.addCase(actions.getMentorsAction.rejected, (state, action) => {
			state.isLoadingMentors = false;
			state.error = action.error.message || 'Не удалось загрузить наставников';
		});

		/* =========================
		 * Детали наставника
		 * ========================= */

		builder.addCase(actions.getMentorDetailAction.pending, (state) => {
			state.isLoadingMentorDetail = true;
			state.error = null;
		});

		builder.addCase(
			actions.getMentorDetailAction.fulfilled,
			(state, action) => {
				state.isLoadingMentorDetail = false;
				state.mentorDetail = action.payload;
			}
		);

		builder.addCase(actions.getMentorDetailAction.rejected, (state, action) => {
			state.isLoadingMentorDetail = false;
			state.error =
				action.error.message || 'Не удалось загрузить данные наставника';
		});

		/* =========================
		 * Проекты
		 * ========================= */

		builder.addCase(actions.getProjectsAction.pending, (state) => {
			state.isLoadingProjects = true;
			state.error = null;
		});

		builder.addCase(actions.getProjectsAction.fulfilled, (state, action) => {
			state.isLoadingProjects = false;
			state.projects = action.payload;
		});

		builder.addCase(actions.getProjectsAction.rejected, (state, action) => {
			state.isLoadingProjects = false;
			state.error = action.error.message || 'Не удалось загрузить проекты';
		});

		/* =========================
		 * Детали проекта
		 * ========================= */

		builder.addCase(actions.getProjectDetailAction.pending, (state) => {
			state.isLoadingProjectDetail = true;
			state.error = null;
		});

		builder.addCase(
			actions.getProjectDetailAction.fulfilled,
			(state, action) => {
				state.isLoadingProjectDetail = false;
				state.projectDetail = action.payload;
			}
		);

		builder.addCase(
			actions.getProjectDetailAction.rejected,
			(state, action) => {
				state.isLoadingProjectDetail = false;
				state.error =
					action.error.message || 'Не удалось загрузить данные проекта';
			}
		);

		/* =========================
		 * Группы
		 * ========================= */

		builder.addCase(actions.getGroupsStatsAction.pending, (state) => {
			state.isLoadingGroups = true;
			state.error = null;
		});

		builder.addCase(actions.getGroupsStatsAction.fulfilled, (state, action) => {
			state.isLoadingGroups = false;
			state.groups = action.payload;
		});

		builder.addCase(actions.getGroupsStatsAction.rejected, (state, action) => {
			state.isLoadingGroups = false;
			state.error =
				action.error.message || 'Не удалось загрузить статистику групп';
		});

		/* =========================
		 * Детали группы
		 * ========================= */

		builder.addCase(actions.getGroupStatsDetailAction.pending, (state) => {
			state.isLoadingGroupDetail = true;
			state.error = null;
		});

		builder.addCase(
			actions.getGroupStatsDetailAction.fulfilled,
			(state, action) => {
				state.isLoadingGroupDetail = false;
				state.groupDetail = action.payload;
			}
		);

		builder.addCase(
			actions.getGroupStatsDetailAction.rejected,
			(state, action) => {
				state.isLoadingGroupDetail = false;
				state.error =
					action.error.message || 'Не удалось загрузить данные группы';
			}
		);
	},
});

export const { setInstitute, setCourse, setStudentStatus, resetFilters } =
	dashboardSlice.actions;
