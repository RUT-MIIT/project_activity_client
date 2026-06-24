import type { ITag, IDirection } from '../catalog/types';

export interface ITrackStore {
	projects: IProject[];
	trackGroups: ITrackGroup[];
	trackGroupDetail: ITrackGroupDetail | null;
	isLoadingProjects: boolean;
	isLoadingTrackGroups: boolean;
	isLoadingDetail: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface IProject {
	id: number;
	title: string;
	company: string;
	author_name: string;
	author_email: string;
	tags: ITag[];
	print_number: string;
	img: string;
}

export interface ICreateTrack {
	semester_id: number;
	group_ids: number[];
	project_application_ids: number[];
}

export interface ITrackGroup {
	id: number;
	name: string;
	course_number: number;
	direction: IDirection;
	assigned_projects_count: number;
}

export interface ITrackGroupDetail {
	id: number;
	name: string;
	course_number: number;
	direction: IDirection;
	projects: ITrackGroupDetailProject[];
}

export interface ITrackGroupDetailProject {
	id: number;
	title: string;
	print_number: string;
	author_name: string;
}
