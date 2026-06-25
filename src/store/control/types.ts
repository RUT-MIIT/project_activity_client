import type { IRole, IDepartment, ITag } from '../catalog/types';

export interface IControlStore {
	approveUsers: IApproveUser[];
	apps: IControlApp[];
	users: IControlUser[];
	currentApproveUser: IApproveUser | null;
	currentUser: IControlUser | null;
	isOpenApproveModal: boolean;
	isOpenRejectModal: boolean;
	isOpenApproveDetailModal: boolean;
	isOpenEditModal: boolean;
	isLoadingApprove: boolean;
	isLoadingApps: boolean;
	isLoadingUsers: boolean;
	isLoadingRequest: boolean;
	error: string | null;
}

export interface IApproveUser {
	id: number;
	first_name: string;
	last_name: string;
	middle_name: string;
	email: string;
	phone: string;
	comment: string;
	created_at: string;
	status: 'submitted' | 'approved' | 'rejected';
	role?: IRole;
	department?: IDepartment;
	actor?: { id: number; full_name: string; email: string };
	reason?: string;
}

export interface IApproveUserRequest {
	userId: number;
	role_id: string;
	department_id: number;
}

export interface IRejectUserRequest {
	userId: number;
	reason: string;
}

export interface IControlApp {
	id: number;
	title: string;
	company: string;
	author_name: string;
	author_email: string;
	print_number: string;
	img: string;
	main_department: IDepartment | null;
	tags: ITag[];
	status: { code: string; name: string };
	author: { id: number; full_name: string; email: string };
}

export interface IControlUser {
	id: number;
	full_name: string;
	email: string;
	phone: string;
	role: IRole;
	department: IDepartment;
	authored_projects_count: number;
}

export interface IEditUserRequest {
	userId: number;
	department_id: number;
	role: string;
	email: string;
	phone: string;
}
