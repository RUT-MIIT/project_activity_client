import type { IField, IApplicationComment } from '../application/types';
import type { ICoordinationStore } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: ICoordinationStore = {
	application: null,
	applications: [],
	applicationDetail: null,
	currentField: null,
	isLoadingApps: false,
	isLoadingDetail: false,
	isLoadingComment: false,
	isLoadingAction: false,
	error: null,
};

export const coordinationSlice = createSlice({
	name: 'coordination',
	initialState,
	reducers: {
		setCurrentField(state, action: PayloadAction<IField | null>) {
			state.currentField = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getCoordinationAppsAction.pending, (state) => {
				state.isLoadingApps = true;
				state.error = null;
			})
			.addCase(actions.getCoordinationAppsAction.fulfilled, (state, action) => {
				state.isLoadingApps = false;
				state.applications = action.payload;
			})
			.addCase(actions.getCoordinationAppsAction.rejected, (state, action) => {
				state.isLoadingApps = false;
				state.error = action.error?.message || 'Не удалось загрузить заявки';
			})
			.addCase(actions.getCoordinationAppDetailAction.pending, (state) => {
				state.isLoadingDetail = true;
				state.error = null;
			})
			.addCase(
				actions.getCoordinationAppDetailAction.fulfilled,
				(state, action) => {
					state.isLoadingDetail = false;
					state.applicationDetail = action.payload;
				}
			)
			.addCase(
				actions.getCoordinationAppDetailAction.rejected,
				(state, action) => {
					state.isLoadingDetail = false;
					state.error = action.error?.message || 'Не удалось загрузить заявку';
				}
			)

			.addCase(actions.editAppAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.editAppAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				const updatedApp = action.payload;

				state.applications = state.applications.map((app) =>
					app.id === updatedApp.id
						? {
								...app,
								title: updatedApp.title,
								company: updatedApp.company,
								comments_count: updatedApp.comments.length,
								status: updatedApp.status,
						  }
						: app
				);
			})
			.addCase(actions.editAppAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось сохранить заявку';
			})
			.addCase(actions.approveAppAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.approveAppAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				const response = action.payload;
				const appId = action.meta.arg.applicationId;

				state.applications = state.applications.map((app) =>
					app.id === appId
						? {
								...app,
								status: { code: response.status, name: response.status_name },
						  }
						: app
				);
			})
			.addCase(actions.approveAppAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось согласовать заявку';
			})
			.addCase(actions.reworkAppAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.reworkAppAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				const response = action.payload;
				const appId = action.meta.arg.applicationId;

				state.applications = state.applications.map((app) =>
					app.id === appId
						? {
								...app,
								status: { code: response.status, name: response.status_name },
						  }
						: app
				);
			})
			.addCase(actions.reworkAppAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error =
					action.error?.message || 'Не удалось вернуть заявку на доработку';
			})
			.addCase(actions.rejectAppAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.rejectAppAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				const appId = action.meta.arg.applicationId;

				state.applications = state.applications.filter(
					(app) => app.id !== appId
				);
			})
			.addCase(actions.rejectAppAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error =
					action.error?.message || 'Не удалось вернуть заявку на доработку';
			})

			.addCase(actions.createCommentToFieldAction.pending, (state) => {
				state.isLoadingComment = true;
				state.error = null;
			})
			.addCase(
				actions.createCommentToFieldAction.fulfilled,
				(state, action: PayloadAction<IApplicationComment>) => {
					state.isLoadingComment = false;
					if (state.applicationDetail) {
						state.applicationDetail.comments = [
							action.payload,
							...state.applicationDetail.comments,
						];
					}
				}
			)
			.addCase(actions.createCommentToFieldAction.rejected, (state, action) => {
				state.isLoadingComment = false;
				state.error = action.error?.message || 'Не удалось создать комментарий';
			});
	},
});

export const { setCurrentField } = coordinationSlice.actions;
