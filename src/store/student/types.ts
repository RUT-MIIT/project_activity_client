import type { IDirection, IInstitute } from '../catalog/types';

export interface IStudentStore {
	group: IGroup | null;

	isLoadingGroup: boolean;
	isLoadingAction: boolean;

	error: string | null;
}

export interface IGroup {
	id: number;
	name: string;
	code: string;
	course_number: number;
	form: string;
	profile: string;
	direction: IDirection;
	institute: IInstitute;

	mentor: IGroupMentor | null;
	members: IGroupMember[];
	students_count: number;
	registered_students_count: number;
}

export interface IGroupMentor {
	id: number;
	last_name: string;
	first_name: string;
	middle_name: string;
	email: string;
	position: string;
	academic_degree: string;
	academic_title: string;
}

export interface IGroupMember {
	id: number;
	last_name: string;
	first_name: string;
	middle_name: string;

	is_registered: boolean;
	user_id: number | null;
	email: string | null;
	team: string | null;
}
