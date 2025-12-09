import type { IUserStore } from './types';

import { createSlice } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IUserStore = {
	user: null,
	isAuthChecked: false,
	isLoading: false,
	isLoadingRequest: false,
	error: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsAuthChecked: (state, action) => {
			state.isAuthChecked = action.payload;
		},
	},
	selectors: {
		getUser: (state) => state.user,
		getIsAuthChecked: (state) => state.isAuthChecked,
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.setUser, (state, action) => {
				state.user = action.payload || null;
			})
			.addCase(actions.loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.isAuthChecked = true;
			})
			.addCase(actions.loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Произошла ошибка';
			})
			.addCase(actions.registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(actions.registerUser.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(actions.registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message || 'Произошла ошибка';
			})
			.addCase(actions.logoutUser.fulfilled, (state) => {
				state.user = null;
			})
			.addCase(actions.changePasswordAction.pending, (state) => {
				state.isLoadingRequest = true;
				state.error = null;
			})
			.addCase(actions.changePasswordAction.fulfilled, (state) => {
				state.isLoadingRequest = false;
			})
			.addCase(actions.changePasswordAction.rejected, (state, action) => {
				state.isLoadingRequest = false;

				if (action.payload) {
					state.error = String(action.payload);
				} else {
					state.error =
						action.error?.message || 'Произошла ошибка при смене пароля';
				}
			})
			.addCase(actions.forgotPasswordAction.pending, (state) => {
				state.isLoadingRequest = true;
				state.error = null;
			})
			.addCase(actions.forgotPasswordAction.fulfilled, (state) => {
				state.isLoadingRequest = false;
			})
			.addCase(actions.forgotPasswordAction.rejected, (state, action) => {
				state.isLoadingRequest = false;

				if (action.payload) {
					state.error = String(action.payload);
				} else {
					state.error =
						action.error?.message || 'Произошла ошибка при сбросе пароля';
				}
			})
			.addCase(actions.resetPasswordAction.pending, (state) => {
				state.isLoadingRequest = true;
				state.error = null;
			})
			.addCase(actions.resetPasswordAction.fulfilled, (state) => {
				state.isLoadingRequest = false;
			})
			.addCase(actions.resetPasswordAction.rejected, (state, action) => {
				state.isLoadingRequest = false;

				if (action.payload) {
					state.error = String(action.payload);
				} else {
					state.error =
						action.error?.message || 'Произошла ошибка при смене пароля';
				}
			});
	},
});

export const { setIsAuthChecked } = userSlice.actions;
export const { getIsAuthChecked, getUser } = userSlice.selectors;
