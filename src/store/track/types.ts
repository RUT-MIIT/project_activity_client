import type { ITag, IDirection } from '../catalog/types';

export interface ITrackStore {
	projects: IProject[];
	trackList: ITrack[];
	trackGroups: ITrackGroup[];
	trackGroupDetail: ITrackGroupDetail | null;
	trackProjects: ITrackProject[];
	trackProjectDetail: ITrackProjectDetail | null;
	trackStats: ITrackStats | null;
	subdivisionStats: ISubdivisionStats | null;
	selectedInstitute: string | null;

	isLoadingProjects: boolean;
	isLoadingTrackGroups: boolean;
	isLoadingTrackProjects: boolean;
	isLoadingDetail: boolean;
	isLoading: boolean;
	isLoadingAction: boolean;
	isLoadingStats: boolean;

	error: string | null;
}

export interface ITrack {
	id: number;
	author_id: number;
	department_id: number;
	description: string;
	name: string;
	semester_id: number;
	applications: {
		id: number;
		print_number: string;
		title: string;
		maxTeamMembers: number;
		minTeamMembers: number;
		teamsCount: number;
	}[];
	groups: {
		id: number;
		course_number: number;
		name: string;
		students_count: number;
	}[];
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
	track_composer_comment: string;
	recommended_teams_count: number;
}

export interface ITrackStats {
	total_projects: number;
	distributed_projects: number;
	average_projects_per_group: number;
	groups_without_projects: number;
}

export interface IInstituteTrackStats extends ITrackStats {
	institute_code: string;
	institute_name: string;
}

export interface ISubdivisionStats {
	overall: ITrackStats;
	by_institute: IInstituteTrackStats[];
}

export interface ICreateTrack {
	name: string;
	description?: string;
	max_teams?: number;
	semester_id: number;
	department_id: number;
}

export interface IUpdateTrack {
	id: number;
	name?: string;
	minTeamMembers?: number;
	maxTeamMembers?: number;
}

export interface IAddGroupsToTrack {
	trackId: number;
	group_ids: number[];
}

export interface ITrackProjectToAdd {
	id: number;
	teamsCount: number;
	minTeamMembers: number;
	maxTeamMembers: number;
}

export interface IAddProjectsToTrack {
	trackId: number;
	projects: ITrackProjectToAdd[];
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

export interface ITrackProject {
	id: number;
	title: string;
	print_number: string;
	author_name: string;
	assigned_groups_count: number;
}

export interface ITrackProjectDetail {
	id: number;
	title: string;
	print_number: string;
	author_name: string;
	groups: ITrackProjectDetailGroup[];
}

export interface ITrackProjectDetailGroup {
	id: number;
	name: string;
	course_number: number;
	direction: IDirection;
}

export interface IRemoveGroupFromTrack {
	trackId: number;
	groupId: number;
}

export interface IRemoveProjectFromTrack {
	trackId: number;
	projectId: number;
}
