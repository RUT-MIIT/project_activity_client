import type { ITrackStore } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: ITrackStore = {
	projects: [],
	trackList: [],
	trackGroups: [],
	trackGroupDetail: null,
	trackProjects: [],
	trackProjectDetail: null,
	trackStats: null,
	subdivisionStats: null,
	selectedInstitute: null,
	isLoadingProjects: false,
	isLoadingTrackGroups: false,
	isLoadingTrackProjects: false,
	isLoadingDetail: false,
	isLoading: false,
	isLoadingAction: false,
	isLoadingStats: false,
	error: null,
};

export const trackSlice = createSlice({
	name: 'track',
	initialState,
	reducers: {
		setSelectedInstitute: (state, action: PayloadAction<string>) => {
			state.selectedInstitute = action.payload;
		},
		clearSelectedInstitute: (state) => {
			state.selectedInstitute = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getTrackListAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.getTrackListAction.fulfilled, (state, action) => {
				state.isLoading = false;
				state.trackList = action.payload;
			})
			.addCase(actions.getTrackListAction.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Не удалось загрузить треки';
			})
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
			.addCase(actions.getTrackProjectsListAction.pending, (state) => {
				state.isLoadingTrackProjects = true;
				state.error = null;
			})
			.addCase(
				actions.getTrackProjectsListAction.fulfilled,
				(state, action) => {
					state.isLoadingTrackProjects = false;
					state.trackProjects = action.payload;
				}
			)
			.addCase(actions.getTrackProjectsListAction.rejected, (state, action) => {
				state.isLoadingTrackProjects = false;
				state.error =
					action.error?.message || 'Не удалось загрузить список проектов';
			})

			.addCase(actions.getTrackProjectDetailAction.pending, (state) => {
				state.isLoadingDetail = true;
				state.error = null;
			})
			.addCase(
				actions.getTrackProjectDetailAction.fulfilled,
				(state, action) => {
					state.isLoadingDetail = false;
					state.trackProjectDetail = action.payload;
				}
			)
			.addCase(
				actions.getTrackProjectDetailAction.rejected,
				(state, action) => {
					state.isLoadingDetail = false;
					state.error =
						action.error?.message || 'Не удалось загрузить данные проекта';
				}
			)
			.addCase(actions.getTrackStatsAction.pending, (state) => {
				state.isLoadingStats = true;
				state.error = null;
			})
			.addCase(actions.getTrackStatsAction.fulfilled, (state, action) => {
				state.isLoadingStats = false;
				state.trackStats = action.payload;
			})
			.addCase(actions.getTrackStatsAction.rejected, (state, action) => {
				state.isLoadingStats = false;
				state.error =
					action.error?.message || 'Не удалось загрузить статистику';
			})
			.addCase(actions.getSubdivisionStatsAction.pending, (state) => {
				state.isLoadingStats = true;
				state.error = null;
			})
			.addCase(actions.getSubdivisionStatsAction.fulfilled, (state, action) => {
				state.isLoadingStats = false;
				state.subdivisionStats = action.payload;
			})
			.addCase(actions.getSubdivisionStatsAction.rejected, (state, action) => {
				state.isLoadingStats = false;
				state.error =
					action.error?.message || 'Не удалось загрузить статистику';
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
			.addCase(actions.createFullTrackAction.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			.addCase(actions.createFullTrackAction.fulfilled, (state, action) => {
				state.isLoading = false;
				console.log('Создан трек:', action.payload);
			})

			.addCase(actions.createFullTrackAction.rejected, (state, action) => {
				state.isLoading = false;

				state.error = action.error?.message || 'Не удалось создать трек';
			})
			.addCase(actions.removeTrackAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.removeTrackAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;

				state.trackList = state.trackList.filter(
					(track) => track.id !== action.payload
				);
			})
			.addCase(actions.removeTrackAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error.message || 'Не удалось удалить трек';
			})
			.addCase(actions.removeGroupFromTrackAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(
				actions.removeGroupFromTrackAction.fulfilled,
				(state, action) => {
					state.isLoadingAction = false;

					const { trackId, groupId } = action.payload;

					const track = state.trackList.find((t) => t.id === trackId);

					if (track) {
						track.groups = track.groups.filter((group) => group.id !== groupId);
					}
				}
			)
			.addCase(actions.removeGroupFromTrackAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error.message || 'Не удалось удалить группу';
			})
			.addCase(actions.removeProjectFromTrackAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(
				actions.removeProjectFromTrackAction.fulfilled,
				(state, action) => {
					state.isLoadingAction = false;

					const { trackId, projectId } = action.payload;

					const track = state.trackList.find((t) => t.id === trackId);

					if (track) {
						track.applications = track.applications.filter(
							(project) => project.id !== projectId
						);
					}
				}
			)
			.addCase(
				actions.removeProjectFromTrackAction.rejected,
				(state, action) => {
					state.isLoadingAction = false;
					state.error = action.error.message || 'Не удалось удалить проект';
				}
			)
			.addCase(actions.removeLinkAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.removeLinkAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;

				const { group_id, project_application_id } = action.meta.arg;

				// Детали группы
				if (state.trackGroupDetail) {
					state.trackGroupDetail.projects =
						state.trackGroupDetail.projects.filter(
							(project) => project.id !== project_application_id
						);
				}

				// Список групп
				const group = state.trackGroups.find((g) => g.id === group_id);

				if (group && group.assigned_projects_count > 0) {
					group.assigned_projects_count -= 1;
				}

				// Детали проекта
				if (state.trackProjectDetail) {
					state.trackProjectDetail.groups =
						state.trackProjectDetail.groups.filter(
							(group) => group.id !== group_id
						);
				}

				// Список проектов
				const project = state.trackProjects.find(
					(p) => p.id === project_application_id
				);

				if (project && project.assigned_groups_count > 0) {
					project.assigned_groups_count -= 1;
				}
			})
			.addCase(actions.removeLinkAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error.message || 'Не удалось удалить связь';
			});
	},
});

export const { setSelectedInstitute, clearSelectedInstitute } =
	trackSlice.actions;
