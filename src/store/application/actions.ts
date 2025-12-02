import type {
	IApplication,
	IApplicationItem,
	ICreateAppMain,
	ICreateAppPublic,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getApplications,
	createMainApplication,
	createPublicApplication,
	getExternalApplications,
} from '../../shared/api/application';

export const getAppsAction = createAsyncThunk<IApplicationItem[]>(
	'application/getApps',
	getApplications
);

export const createAppMainAction = createAsyncThunk<
	IApplication,
	ICreateAppMain
>('application/createAppMain', createMainApplication);

export const createAppPublicAction = createAsyncThunk<
	IApplication,
	ICreateAppPublic
>('application/createAppPublic', createPublicApplication);

export const getExternalAppsAction = createAsyncThunk<IApplicationItem[]>(
	'application/getExternalApps',
	getExternalApplications
);
