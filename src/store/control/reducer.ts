import type { IControlStore, IApproveUser, IControlUser } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IControlStore = {
	approveUsers: [],
	apps: [],
	users: [],
	currentApproveUser: null,
	currentUser: null,
	isOpenApproveModal: false,
	isOpenRejectModal: false,
	isOpenApproveDetailModal: false,
	isOpenEditModal: false,
	isLoadingApprove: false,
	isLoadingRequest: false,
	isLoadingApps: false,
	isLoadingUsers: false,
	error: null,
};

export const controlSlice = createSlice({
	name: 'control',
	initialState,
	reducers: {
		setCurrentApproveUser(state, action: PayloadAction<IApproveUser>) {
			state.currentApproveUser = action.payload;
		},
		clearCurrentApproveUser(state) {
			state.currentApproveUser = null;
		},
		setCurrentUser(state, action: PayloadAction<IControlUser>) {
			state.currentUser = action.payload;
		},
		clearCurrentUser(state) {
			state.currentUser = null;
		},
		openApproveModal(state) {
			state.isOpenApproveModal = true;
		},
		openRejectModal(state) {
			state.isOpenRejectModal = true;
		},
		openApproveDetailModal(state) {
			state.isOpenApproveDetailModal = true;
		},
		openEditModal(state) {
			state.isOpenEditModal = true;
		},
		closeModals(state) {
			state.isOpenApproveModal = false;
			state.isOpenRejectModal = false;
			state.isOpenApproveDetailModal = false;
			state.isOpenEditModal = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getApproveUsersAction.pending, (state) => {
				state.isLoadingApprove = true;
				state.error = null;
			})
			.addCase(actions.getApproveUsersAction.fulfilled, (state, action) => {
				state.isLoadingApprove = false;
				state.approveUsers = action.payload;
			})
			.addCase(actions.getApproveUsersAction.rejected, (state, action) => {
				state.isLoadingApprove = false;
				state.error =
					action.error?.message || 'Не удалось загрузить пользователей';
			})
			.addCase(actions.getControlAppsAction.pending, (state) => {
				state.isLoadingApps = true;
				state.error = null;
			})
			.addCase(actions.getControlAppsAction.fulfilled, (state, action) => {
				state.isLoadingApps = false;
				state.apps = action.payload;
			})
			.addCase(actions.getControlAppsAction.rejected, (state, action) => {
				state.isLoadingApps = false;
				state.error = action.error?.message || 'Не удалось загрузить заявки';
			})
			.addCase(actions.getControlUsersAction.pending, (state) => {
				state.isLoadingUsers = true;
				state.error = null;
			})
			.addCase(actions.getControlUsersAction.fulfilled, (state, action) => {
				state.isLoadingUsers = false;
				state.users = action.payload;
			})
			.addCase(actions.getControlUsersAction.rejected, (state, action) => {
				state.isLoadingUsers = false;
				state.error =
					action.error?.message || 'Не удалось загрузить пользователей';
			})
			.addCase(actions.approveUserAction.pending, (state) => {
				state.isLoadingRequest = true;
				state.error = null;
			})
			.addCase(actions.approveUserAction.fulfilled, (state, action) => {
				const updatedUser = action.payload;
				state.approveUsers = state.approveUsers.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				);
				state.isLoadingRequest = false;
				state.currentApproveUser = null;
				state.isOpenApproveModal = false;
			})
			.addCase(actions.approveUserAction.rejected, (state, action) => {
				state.isLoadingRequest = false;
				state.error =
					action.error?.message || 'Не удалось подтвердить пользователя';
			})
			.addCase(actions.rejectUserAction.pending, (state) => {
				state.isLoadingRequest = true;
				state.error = null;
			})
			.addCase(actions.rejectUserAction.fulfilled, (state, action) => {
				const updatedUser = action.payload;
				state.approveUsers = state.approveUsers.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				);
				state.isLoadingRequest = false;
				state.currentApproveUser = null;
				state.isOpenRejectModal = false;
			})
			.addCase(actions.rejectUserAction.rejected, (state, action) => {
				state.isLoadingRequest = false;
				state.error =
					action.error?.message || 'Не удалось отклонить пользователя';
			})
			.addCase(actions.editUserAction.pending, (state) => {
				state.isLoadingRequest = true;
				state.error = null;
			})
			.addCase(actions.editUserAction.fulfilled, (state, action) => {
				const updatedUser = action.payload;
				state.users = state.users.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				);
				state.isLoadingRequest = false;
				state.currentUser = null;
				state.isOpenEditModal = false;
			})
			.addCase(actions.editUserAction.rejected, (state, action) => {
				state.isLoadingRequest = false;
				state.error =
					action.error?.message || 'Не удалось отредактировать данные';
			});
	},
});

export const {
	setCurrentApproveUser,
	clearCurrentApproveUser,
	setCurrentUser,
	clearCurrentUser,
	openApproveModal,
	openRejectModal,
	openApproveDetailModal,
	openEditModal,
	closeModals,
} = controlSlice.actions;
