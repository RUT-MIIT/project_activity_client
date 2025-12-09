import type {
	ILoginRequest,
	IRegistrationRequest,
	IAuthResponse,
	IUser,
	IMessageResponse,
} from './types';

import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
	login,
	registration,
	getUser,
	changePassword,
	forgotPassword,
	resetPassword,
} from '../../shared/api/user';

import { setIsAuthChecked } from './reducer';

export const loginUser = createAsyncThunk<IAuthResponse, ILoginRequest>(
	'user/login',
	login
);

export const registerUser = createAsyncThunk<
	IAuthResponse,
	IRegistrationRequest
>('user/registration', registration);

export const setUser = createAction<IUser | null>('auth/setUser');

export const checkUserAuth = createAsyncThunk(
	'user/checkUser',
	async (_, { dispatch }) => {
		if (localStorage.getItem('accessToken')) {
			try {
				const user = await getUser();
				dispatch(setUser(user || null));
			} catch (error) {
				dispatch(setUser(null));
			} finally {
				dispatch(setIsAuthChecked(true));
			}
		} else {
			dispatch(setIsAuthChecked(true));
		}
	}
);

export const changePasswordAction = createAsyncThunk<
	IMessageResponse,
	{ current_password: string; new_password: string }
>('user/changePassword', async (data, thunkAPI) => {
	try {
		return await changePassword(data);
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const forgotPasswordAction = createAsyncThunk<
	IMessageResponse,
	{ email: string }
>('user/forgotPassword', async (email, thunkAPI) => {
	try {
		return await forgotPassword(email);
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const resetPasswordAction = createAsyncThunk<
	IMessageResponse,
	{ uid: string; token: string; new_password: string }
>('user/resetPassword', async ({ uid, token, new_password }, thunkAPI) => {
	try {
		return await resetPassword({ uid, token, new_password });
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const logoutUser = createAsyncThunk<IMessageResponse>(
	'auth/logout',
	async () => {
		localStorage.removeItem('accessToken');
		return { message: 'Logged out' };
	}
);
