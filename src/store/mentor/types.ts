export interface IMentorGroup {
	id: number;
	name: string;
	studentsCount: number;
	teamsCount: number;
}

export interface IMentorGroupStudent {
	id: number;
	lastName: string;
	firstName: string;
	middleName: string;
	isRegistered: boolean;
	userId: number | null;
	team: {
		id: number;
		name: string;
		role: string;
	} | null;
}

export type MentorTeamStatus = 'forming' | 'assembled';

export interface IMentorGroupTeam {
	id: number;
	name: string;
	status: MentorTeamStatus;
	membersCount: number;
}

export interface IMentorGroupDetail {
	id: number;
	name: string;
	students: IMentorGroupStudent[];
	teams: IMentorGroupTeam[];
}

/* =========================
 * Витрина проектов группы
 * ========================= */

export interface IMentorShowcaseTag {
	id: number;
	name: string;
	category: string;
}

export interface IMentorShowcaseProject {
	id: number;
	title: string;
	company: string;
	maxTeams: number;
	enrolledTeamsCount: number;
	minTeamMembers: number;
	maxTeamMembers: number;
	tags: IMentorShowcaseTag[];
}

export interface IMentorShowcaseTrack {
	id: number;
	name: string;
	description: string;
	projects: IMentorShowcaseProject[];
}

export interface IMentorShowcaseDetail {
	id: number;
	title: string;
	company: string;
	goal: string;
	barrier: string;
	existingSolutions: string;
	context: string;
	projectLevel: string;
	tags: IMentorShowcaseTag[];

	recommended_teams_count: number;
	max_team_members: number;
	min_team_members: number;

	trackId: number;

	canEnroll: boolean;
}

export type MentorTeamMemberRole = 'leader' | 'member';

export interface IMentorTeamMember {
	userId: number;
	fullName: string;
	role: MentorTeamMemberRole;
	isPlaceholder: boolean;
}

export interface IMentorTeam {
	id: number;
	name: string;
	status: MentorTeamStatus;
	membersCount: number;
	members: IMentorTeamMember[];
}

export interface IUpdateMentorTeamNameRequest {
	groupId: number;
	teamSemesterId: number;
	name: string;
	semesterId?: string;
}

export interface IUpdateMentorTeamCaptainRequest {
	groupId: number;
	teamSemesterId: number;
	captainId: number;
	semesterId?: string;
}

export interface IConfirmMentorTeamCompositionRequest {
	groupId: number;
	teamSemesterId: number;
	semesterId?: string;
}

export interface IUnconfirmMentorTeamCompositionRequest {
	groupId: number;
	teamSemesterId: number;
	semesterId?: string;
}

export interface IAddMentorTeamMemberRequest {
	groupId: number;
	teamSemesterId: number;
	userId?: number;
	preRegisteredStudentId?: number;
	semesterId?: string;
}

export interface IRemoveMentorTeamMemberRequest {
	groupId: number;
	teamSemesterId: number;
	userId: number;
	semesterId?: string;
}

export interface IDeleteMentorTeamRequest {
	groupId: number;
	teamSemesterId: number;
	semesterId?: string;
}

export interface IMentorStore {
	groups: IMentorGroup[];

	currentGroup: IMentorGroupDetail | null;

	showcase: IMentorShowcaseTrack[];
	showcaseDetail: IMentorShowcaseDetail | null;

	currentTeam: IMentorTeam | null;

	isLoadingGroups: boolean;
	isLoadingGroupDetail: boolean;
	isLoadingShowcase: boolean;
	isLoadingShowcaseDetail: boolean;
	isLoadingTeam: boolean;
	isLoadingTeamRequest: boolean;

	error: string | null;
}
