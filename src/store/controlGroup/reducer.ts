import type { IInstituteResponsibleStore } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IInstituteResponsibleStore = {
	groups: [],
	groupsWithTeams: [],
	teams: [],
	students: [],
	employees: [],
	groupMentors: [],

	registrationSettings: null,
	currentGroup: null,

	isLoadingGroups: false,
	isLoadingGroupsWithTeams: false,
	isLoadingTeams: false,
	isLoadingStudents: false,
	isLoadingEmployees: false,
	isLoadingGroupMentors: false,
	isLoadingMentorRequest: false,
	isLoadingRegistrationSettings: false,
	isUpdatingRegistrationSettings: false,

	error: null,
};

export const controlGroupSlice = createSlice({
	name: 'controlGroup',
	initialState,

	reducers: {
		setCurrentGroup(state, action: PayloadAction<typeof state.currentGroup>) {
			state.currentGroup = action.payload;
		},

		clearCurrentGroup(state) {
			state.currentGroup = null;
		},

		clearError(state) {
			state.error = null;
		},
	},

	extraReducers: (builder) => {
		builder

			// =========================
			// Группы
			// =========================

			.addCase(actions.getInstituteGroupsAction.pending, (state) => {
				state.isLoadingGroups = true;
				state.error = null;
			})

			.addCase(actions.getInstituteGroupsAction.fulfilled, (state, action) => {
				state.isLoadingGroups = false;
				state.groups = action.payload;
			})

			.addCase(actions.getInstituteGroupsAction.rejected, (state, action) => {
				state.isLoadingGroups = false;
				state.error = action.error?.message || 'Не удалось загрузить группы';
			})

			// =========================
			// Сотрудники
			// =========================

			.addCase(actions.getInstituteEmployeesAction.pending, (state) => {
				state.isLoadingEmployees = true;
				state.error = null;
			})

			.addCase(
				actions.getInstituteEmployeesAction.fulfilled,
				(state, action) => {
					state.isLoadingEmployees = false;
					state.employees = action.payload;
				}
			)

			.addCase(
				actions.getInstituteEmployeesAction.rejected,
				(state, action) => {
					state.isLoadingEmployees = false;
					state.error =
						action.error?.message || 'Не удалось загрузить сотрудников';
				}
			)

			// =========================
			// Группы + наставники
			// =========================

			.addCase(actions.getGroupMentorsAction.pending, (state) => {
				state.isLoadingGroupMentors = true;
				state.error = null;
			})
			.addCase(actions.getGroupMentorsAction.fulfilled, (state, action) => {
				state.isLoadingGroupMentors = false;
				state.groupMentors = action.payload;
			})
			.addCase(actions.getGroupMentorsAction.rejected, (state, action) => {
				state.isLoadingGroupMentors = false;
				state.error =
					action.error?.message || 'Не удалось загрузить наставников групп';
			})

			// =========================
			// Назначение наставника
			// =========================

			.addCase(actions.assignGroupMentorAction.pending, (state) => {
				state.isLoadingMentorRequest = true;
				state.error = null;
			})
			.addCase(actions.assignGroupMentorAction.fulfilled, (state, action) => {
				const updatedGroup = action.payload;

				state.groupMentors = state.groupMentors.map((group) =>
					group.id === updatedGroup.groupId
						? {
								...group,
								mentorIds: updatedGroup.mentorIds,
						  }
						: group
				);

				state.isLoadingMentorRequest = false;
			})
			.addCase(actions.assignGroupMentorAction.rejected, (state, action) => {
				state.isLoadingMentorRequest = false;
				state.error =
					action.error?.message || 'Не удалось назначить наставника';
			})
			// =========================
			// Снятие наставника
			// =========================

			.addCase(actions.removeGroupMentorAction.pending, (state) => {
				state.isLoadingMentorRequest = true;
				state.error = null;
			})
			.addCase(actions.removeGroupMentorAction.fulfilled, (state, action) => {
				const updatedGroup = action.payload;

				state.groupMentors = state.groupMentors.map((group) =>
					group.id === updatedGroup.groupId
						? {
								...group,
								mentorIds: updatedGroup.mentorIds,
						  }
						: group
				);

				state.isLoadingMentorRequest = false;
			})
			.addCase(actions.removeGroupMentorAction.rejected, (state, action) => {
				state.isLoadingMentorRequest = false;
				state.error = action.error?.message || 'Не удалось снять наставника';
			})

			.addCase(actions.getInstituteGroupsWithTeamsAction.pending, (state) => {
				state.isLoadingGroupsWithTeams = true;
				state.error = null;
			})

			.addCase(
				actions.getInstituteGroupsWithTeamsAction.fulfilled,
				(state, action) => {
					state.isLoadingGroupsWithTeams = false;
					state.groupsWithTeams = action.payload;
				}
			)

			.addCase(
				actions.getInstituteGroupsWithTeamsAction.rejected,
				(state, action) => {
					state.isLoadingGroupsWithTeams = false;
					state.error =
						action.error?.message || 'Не удалось загрузить группы и команды';
				}
			)
			.addCase(actions.getInstituteTeamsAction.pending, (state) => {
				state.isLoadingTeams = true;
				state.error = null;
			})
			.addCase(actions.getInstituteTeamsAction.fulfilled, (state, action) => {
				state.isLoadingTeams = false;
				state.teams = action.payload;
			})
			.addCase(actions.getInstituteTeamsAction.rejected, (state, action) => {
				state.isLoadingTeams = false;
				state.error = action.error?.message || 'Не удалось загрузить команды';
			})

			.addCase(actions.getInstituteStudentsAction.pending, (state) => {
				state.isLoadingStudents = true;
				state.error = null;
			})
			.addCase(
				actions.getInstituteStudentsAction.fulfilled,
				(state, action) => {
					state.isLoadingStudents = false;
					state.students = action.payload;
				}
			)
			.addCase(actions.getInstituteStudentsAction.rejected, (state, action) => {
				state.isLoadingStudents = false;
				state.error = action.error?.message || 'Не удалось загрузить студентов';
			})
			.addCase(actions.getRegistrationSettingsAction.pending, (state) => {
				state.isLoadingRegistrationSettings = true;
				state.error = null;
			})
			.addCase(
				actions.getRegistrationSettingsAction.fulfilled,
				(state, action) => {
					state.isLoadingRegistrationSettings = false;
					state.registrationSettings = action.payload;
				}
			)
			.addCase(
				actions.getRegistrationSettingsAction.rejected,
				(state, action) => {
					state.isLoadingRegistrationSettings = false;
					state.error =
						action.error?.message ||
						'Не удалось загрузить настройки регистрации';
				}
			)

			.addCase(actions.updateRegistrationSettingsAction.pending, (state) => {
				state.isUpdatingRegistrationSettings = true;
				state.error = null;
			})
			.addCase(
				actions.updateRegistrationSettingsAction.fulfilled,
				(state, action) => {
					state.isUpdatingRegistrationSettings = false;
					state.registrationSettings = action.payload;
				}
			)
			.addCase(
				actions.updateRegistrationSettingsAction.rejected,
				(state, action) => {
					state.isUpdatingRegistrationSettings = false;
					state.error =
						action.error?.message ||
						'Не удалось изменить настройки регистрации';
				}
			);
	},
});

export const { setCurrentGroup, clearCurrentGroup, clearError } =
	controlGroupSlice.actions;

export default controlGroupSlice.reducer;
