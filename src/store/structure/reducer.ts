import type { IStructureStore, IDivisionStats, IDivisionTag } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState: IStructureStore = {
	semesters: [],
	currentSemester: null,
	myDivisionStats: null,
	divisionsPlans: [],
	divisionsTags: [],
	currentDivision: null,
	currentTag: null,
	isLoadingStats: true,
	isLoadingPlans: true,
	isLoadingSemesters: false,
	isLoadingTags: true,
	isLoadingAction: false,
	isOpenSetDivisionPlanModal: false,
	isOpenCreateDivisionTagModal: false,
	isOpenRemoveDivisionTagModal: false,
	error: null,
};

export const structureSlice = createSlice({
	name: 'structure',
	initialState,
	reducers: {
		setCurrentDivision(state, action: PayloadAction<IDivisionStats>) {
			state.currentDivision = action.payload;
		},
		setCurrentTag(state, action: PayloadAction<IDivisionTag>) {
			state.currentTag = action.payload;
		},
		openSetDivisionPlanModal(state) {
			state.isOpenSetDivisionPlanModal = true;
		},
		openCreateDivisionTagModal(state) {
			state.isOpenCreateDivisionTagModal = true;
		},
		openRemoveDivisionTagModal(state) {
			state.isOpenRemoveDivisionTagModal = true;
		},
		closeModals(state) {
			state.isOpenSetDivisionPlanModal = false;
			state.isOpenCreateDivisionTagModal = false;
			state.isOpenRemoveDivisionTagModal = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getSemestersAction.pending, (state) => {
				state.isLoadingSemesters = true;
				state.error = null;
			})
			.addCase(actions.getSemestersAction.fulfilled, (state, action) => {
				state.isLoadingSemesters = false;
				state.semesters = action.payload;
				const activeSemester = action.payload.find((elem) => elem.is_active);
				state.currentSemester = activeSemester ? activeSemester : null;
			})
			.addCase(actions.getSemestersAction.rejected, (state, action) => {
				state.isLoadingSemesters = false;
				state.error = action.error?.message || 'Не удалось загрузить семестры';
			})
			.addCase(actions.getMyDivisionStatsAction.pending, (state) => {
				state.isLoadingStats = true;
				state.error = null;
			})
			.addCase(actions.getMyDivisionStatsAction.fulfilled, (state, action) => {
				state.isLoadingStats = false;
				state.myDivisionStats = action.payload;
			})
			.addCase(actions.getMyDivisionStatsAction.rejected, (state, action) => {
				state.isLoadingStats = false;
				state.error =
					action.error?.message || 'Не удалось загрузить статистику';
			})
			.addCase(actions.getMyDivisionPlansAction.pending, (state) => {
				state.isLoadingPlans = true;
				state.error = null;
			})
			.addCase(actions.getMyDivisionPlansAction.fulfilled, (state, action) => {
				state.isLoadingPlans = false;
				state.divisionsPlans = action.payload;
			})
			.addCase(actions.getMyDivisionPlansAction.rejected, (state, action) => {
				state.isLoadingPlans = false;
				state.error = action.error?.message || 'Не удалось загрузить нормативы';
			})
			.addCase(actions.getMyDivisionTagsAction.pending, (state) => {
				state.isLoadingTags = true;
				state.error = null;
			})
			.addCase(actions.getMyDivisionTagsAction.fulfilled, (state, action) => {
				state.isLoadingTags = false;
				state.divisionsTags = action.payload;
			})
			.addCase(actions.getMyDivisionTagsAction.rejected, (state, action) => {
				state.isLoadingTags = false;
				state.error =
					action.error?.message || 'Не удалось загрузить статистику';
			})
			.addCase(actions.setDivisionPlanAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.setDivisionPlanAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				state.isOpenSetDivisionPlanModal = false;
				state.currentDivision = null;

				const { department_id, plan } = action.payload;

				const division = state.divisionsPlans.find(
					(item) => item.department_id === department_id
				);

				if (division) {
					division.plan = plan;
				}
			})
			.addCase(actions.setDivisionPlanAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось загрузить нормативы';
			})
			.addCase(actions.createDivisionTagAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.createDivisionTagAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				state.isOpenCreateDivisionTagModal = false;
				state.divisionsTags.unshift(action.payload);
			})
			.addCase(actions.createDivisionTagAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось загрузить нормативы';
			})
			.addCase(actions.removeDivisionTagAction.pending, (state) => {
				state.isLoadingAction = true;
				state.error = null;
			})
			.addCase(actions.removeDivisionTagAction.fulfilled, (state, action) => {
				state.isLoadingAction = false;
				state.isOpenRemoveDivisionTagModal = false;

				const { tag_id } = action.meta.arg;
				console.log(tag_id);

				state.divisionsTags = state.divisionsTags.filter(
					(tag) => tag.id !== tag_id
				);
			})
			.addCase(actions.removeDivisionTagAction.rejected, (state, action) => {
				state.isLoadingAction = false;
				state.error = action.error?.message || 'Не удалось загрузить нормативы';
			});
	},
});

export const {
	setCurrentDivision,
	setCurrentTag,
	openSetDivisionPlanModal,
	openCreateDivisionTagModal,
	openRemoveDivisionTagModal,
	closeModals,
} = structureSlice.actions;
