import { combineSlices } from '@reduxjs/toolkit';
import { userSlice } from './user/reducer';
import { catalogSlice } from './catalog/reducer';
import { applicationSlice } from './application/reducer';
import { coordinationSlice } from './coordination/reducer';
import { structureSlice } from './structure/reducer';
import { historySlice } from './history/reducer';
import { trackSlice } from './track/reducer';
import { controlSlice } from './control/reducer';
import { statsSlice } from './stats/reducer';
import { studentSlice } from './student/reducer';

export const rootReducer = combineSlices(
	userSlice,
	catalogSlice,
	applicationSlice,
	coordinationSlice,
	structureSlice,
	historySlice,
	trackSlice,
	controlSlice,
	statsSlice,
	studentSlice
);
