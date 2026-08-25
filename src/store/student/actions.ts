import type { IGroup } from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { getMyGroup } from '../../shared/api/student';

export const getMyGroupAction = createAsyncThunk<IGroup>(
	'student/getMyGroup',
	getMyGroup
);
