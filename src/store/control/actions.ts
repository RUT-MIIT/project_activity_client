import type {
	IApproveUser,
	IControlApp,
	IControlUser,
	IApproveUserRequest,
	IRejectUserRequest,
	IEditUserRequest,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getApproveUsers,
	getControlApps,
	getControlUsers,
	approveUser,
	rejectUser,
	editUser,
} from '../../shared/api/control';

export const getApproveUsersAction = createAsyncThunk<IApproveUser[]>(
	'control/getApproveUsers',
	getApproveUsers
);

export const approveUserAction = createAsyncThunk<
	IApproveUser,
	IApproveUserRequest
>('control/approveUser', approveUser);

export const rejectUserAction = createAsyncThunk<
	IApproveUser,
	IRejectUserRequest
>('control/rejectUser', rejectUser);

export const getControlAppsAction = createAsyncThunk<IControlApp[], number>(
	'control/getControlApps',
	getControlApps
);

export const getControlUsersAction = createAsyncThunk<IControlUser[]>(
	'control/getControlUsers',
	getControlUsers
);

export const editUserAction = createAsyncThunk<IControlUser, IEditUserRequest>(
	'control/editUser',
	editUser
);
