import type {
	IInstitute,
	IDirection,
	IGroup,
	IDepartment,
	IRole,
	ITag,
} from './types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getInstitutesCatalog,
	getDirectionsCatalog,
	getGroupsCatalog,
	getDepartmentsCatalog,
	getRolesCatalog,
	getTagsCatalog,
	getExternalTagsCatalog,
} from '../../shared/api/catalog';

export const getInstitutesAction = createAsyncThunk<IInstitute[]>(
	'catalog/getInstitutes',
	getInstitutesCatalog
);

export const getDirectionsAction = createAsyncThunk<IDirection[]>(
	'catalog/getDirections',
	getDirectionsCatalog
);

export const getGroupsAction = createAsyncThunk<IGroup[]>(
	'catalog/getGroups',
	getGroupsCatalog
);

export const getDepartmentsAction = createAsyncThunk<IDepartment[]>(
	'catalog/getDepartments',
	getDepartmentsCatalog
);

export const getRolesAction = createAsyncThunk<IRole[]>(
	'catalog/getRoles',
	getRolesCatalog
);

export const getTagsAction = createAsyncThunk<ITag[]>(
	'catalog/getTags',
	getTagsCatalog
);

export const getExternalTagsAction = createAsyncThunk<ITag[]>(
	'catalog/getExternalTags',
	getExternalTagsCatalog
);
