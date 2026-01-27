export interface IStructureStore {
	semesters: ISemester[];
	currentSemester: ISemester | null;
	myDivisionStats: IDivisionStats | null;
	divisionsPlans: IDivisionStats[];
	divisionsTags: IDivisionTag[];
	currentDivision: IDivisionStats | null;
	currentTag: IDivisionTag | null;
	isLoadingStats: boolean;
	isLoadingPlans: boolean;
	isLoadingTags: boolean;
	isLoadingSemesters: boolean;
	isLoadingAction: boolean;
	isOpenSetDivisionPlanModal: boolean;
	isOpenCreateDivisionTagModal: boolean;
	isOpenRemoveDivisionTagModal: boolean;
	error: string | null;
}

export interface ISemester {
	name: string;
	id: number;
	is_active: boolean;
	position: number;
}

export interface IDivisionTag {
	id: number;
	name: string;
	category: string;
	is_base: boolean;
}

export interface IDivisionStats {
	department_id: number;
	department_name: string;
	department_short_name: string;
	plan: number;
	applications_by_status: {
		created?: number;
		work_department?: number;
		approved_with_changes_department?: number;
		returned_department?: number;
		rejected_department?: number;
		work_institute?: number;
		approved_with_changes_institute?: number;
		returned_institute?: number;
		rejected_institute?: number;
		work_cpds?: number;
		approved_cpds?: number;
		approved_with_changes_cpds?: number;
		returned_cpds?: number;
		rejected_cpds?: number;
		approved_department?: number;
		approved_institute?: number;
		await_cpds?: number;
		await_department?: number;
		await_institute?: number;
		approved?: number;
		rejected?: number;
		returned_author?: number;
		require_assignment?: number;
		unknown?: number;
	};
}

export interface IAppActionResponse {
	message: string;
	status: string;
	status_name: string;
}
