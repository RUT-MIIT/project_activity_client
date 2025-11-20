import type { ILog } from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAppHistory } from '../../shared/api/history';

export const getAppHistoryAction = createAsyncThunk<ILog[], string>(
	'history/getHistory',
	getAppHistory
);
