import type { IStats } from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getStats } from '../../shared/api/stats';

export const getStatsAction = createAsyncThunk<
	IStats,
	| {
			institute_code?: string;
			department_id?: string;
	  }
	| undefined
>('stats/getStats', (params) => getStats(params ?? {}));
