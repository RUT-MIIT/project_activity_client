export interface ICatalogStore {
	institutes: IInstitute[];
	directions: IDirection[];
	courses: ICourse[];
	groups: IGroup[];
	departments: IDepartment[];
	roles: IRole[];
	tags: ITag[];
	isLoadingCatalog: boolean;
	error: string | null;
}

export interface IInstitute {
	code: string;
	name: string;
}

export interface IDirection {
	code: string;
	name: string;
	level: string;
}

export interface ICourse {
	id: number;
	name: string;
}

export interface IGroup {
	id: number;
	course_number: number;
	direction_code: string;
	name: string;
	students_count: number;
}

export interface IDepartment {
	id: number;
	name: string;
	short_name: string;
}

export interface IRole {
	code: string;
	name: string;
}

export interface ITag {
	id: number;
	name: string;
}
