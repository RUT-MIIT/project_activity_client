import type { ISemester, IDivisionStats, IDivisionTag } from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getSemesters,
	getMyDivisionStats,
	getMyDivisionPlans,
	getMyDivisionTags,
	setDivisionPlan,
	createDivisionTag,
	removeDivisionTag,
} from '../../shared/api/structure';

export const getSemestersAction = createAsyncThunk<ISemester[]>(
	'structure/getSemesters',
	getSemesters
);

export const getMyDivisionStatsAction = createAsyncThunk<
	IDivisionStats,
	number
>('structure/getMyDivisionStats', getMyDivisionStats);

export const getMyDivisionPlansAction = createAsyncThunk<
	IDivisionStats[],
	{ divisionCode?: string; semesterId: number }
>('structure/getMyDivisionNorms', async (params) => {
	return getMyDivisionPlans(params);
});

export const setDivisionPlanAction = createAsyncThunk<
	{ department_id: number; semester_id: number; plan: number },
	{ department_id: number; semester_id: number; plan: number }
>('structure/setDivisionPlan', async ({ department_id, semester_id, plan }) => {
	return setDivisionPlan(department_id, semester_id, plan);
});

export const getMyDivisionTagsAction = createAsyncThunk<IDivisionTag[]>(
	'structure/getMyDivisionTags',
	getMyDivisionTags
);

export const createDivisionTagAction = createAsyncThunk<
	IDivisionTag,
	{ name: string; category: string }
>('structure/createDivisionTag', async ({ name, category }) => {
	return createDivisionTag(name, category);
});

export const removeDivisionTagAction = createAsyncThunk<
	{ message: string },
	{ tag_id: number; department_id: number }
>('structure/removeDivisionTag', async ({ tag_id, department_id }) => {
	return removeDivisionTag(tag_id, department_id);
});
