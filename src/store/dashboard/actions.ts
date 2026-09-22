import type { IStatsMentor, IStatsMentorDetail } from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getMentorDetail, getMentors } from '../../shared/api/dashboard';

export const getMentorsAction = createAsyncThunk<IStatsMentor[]>(
	'dashboard/getMentors',
	getMentors
);

export const getMentorDetailAction = createAsyncThunk<
	IStatsMentorDetail,
	number
>('dashboard/getMentorDetail', getMentorDetail);
