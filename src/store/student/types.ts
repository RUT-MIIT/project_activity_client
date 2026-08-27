import type { IDirection, IInstitute } from '../catalog/types';

/* =========================
 * Team enums
 * ========================= */

export type TeamStatus = 'forming' | 'assembled';

export type TeamRequestStatus =
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'obsolete';

export type TeamInvitationStatus =
	| 'pending'
	| 'accepted'
	| 'rejected'
	| 'obsolete';

export type TeamMemberRole = 'leader' | 'member';

/* =========================
 * Student store
 * ========================= */

export interface IStudentStore {
	group: IGroup | null;
	lobby: ITeamLobby | null;
	myTeam: IMyTeam | null;
	eventLog: ITeamEventLogResponse | null;

	isLoadingGroup: boolean;
	isLoadingAction: boolean;
	isLoadingLobby: boolean;
	isLoadingMyTeam: boolean;
	isMyTeamLoaded: boolean;
	isLoadingEventLog: boolean;

	error: string | null;
}

/* =========================
 * Group
 * ========================= */

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
	team: IGroupMemberTeam | null;
}

interface IGroupMemberTeam {
	id: number;
	name: string;
	role: string;
}

/* =========================
 * Team
 * ========================= */

export interface ICreateTeam {
	name: string;
}

export interface ITeamMember {
	id: number;
	full_name: string;
	role: TeamMemberRole;
}

/* =========================
 * My team
 * ========================= */

export interface IMyTeam extends ITeam {
	minTeamMembers: number;
	maxTeamMembers: number;

	isCaptain: boolean;

	eventLog: ITeamEventLog[];

	canLeave: boolean;

	joinRequests: ITeamJoinRequest[];
	sentInvitations: ITeamSentInvitation[];

	canConfirmComposition: boolean;
	canDeleteTeam: boolean;
	canInvite: boolean;
	canKick: boolean;
}

/* =========================
 * Base team
 * ========================= */

export interface ITeam {
	id: number;
	name: string;
	status: TeamStatus;
	members: ITeamMember[];
}

/* =========================
 * Team event log
 * ========================= */

export interface ITeamEventLog {
	user_id: number;
	text: string;
	created_at: string;
}

/* =========================
 * Join request
 * ========================= */

export interface ITeamJoinRequest {
	id: number;
	user: {
		id: number;
		full_name: string;
	};
	created_at: string;
}

/* =========================
 * Sent invitation
 * ========================= */

export interface ITeamSentInvitation {
	id: number;
	user: {
		id: number;
		full_name: string;
	};
	role: TeamMemberRole;
	created_at: string;
}

/* =========================
 * Lobby requests
 * ========================= */

export interface ILobbyJoinRequest {
	id: number;
	status: TeamRequestStatus;

	team: ITeamReference;
	track: ITrackReference;
}

export interface ILobbyInvitation {
	id: number;
	status: TeamInvitationStatus;
	role: TeamMemberRole;

	team: ITeamReference;

	invitedBy: {
		id: number;
		full_name: string;
	};
}

/* =========================
 * References
 * ========================= */

export interface ITeamReference {
	id: number;
	name: string;
}

export interface ITrackReference {
	id: number;
	name: string;
}

/* =========================
 * Team in lobby
 * ========================= */

export interface ILobbyTeam extends ITeam {
	membersCount: number;
	maxTeamMembers: number;

	captain: {
		id: number;
		full_name: string;
	};

	myPendingJoinRequestId: number | null;
}

/* =========================
 * Track in lobby
 * ========================= */

export interface ILobbyTrack {
	id: number;
	name: string;

	minTeamMembers: number;
	maxTeamMembers: number;

	recommendedTeamsCount: number;
	teamsCount: number;

	canCreateTeam: boolean;

	teams: ILobbyTeam[];
}

/* =========================
 * Lobby
 * ========================= */

export interface ITeamLobby {
	semester_id: number;

	myTeam: ITeam | null;

	canCreateTeam: boolean;

	joinRequests: ILobbyJoinRequest[];

	invitations: ILobbyInvitation[];

	tracks: ILobbyTrack[];

	teams: ILobbyTeam[];
}

export interface ICreateTeamInvitation {
	user_id: number;
	role: TeamMemberRole;
}

export interface ITeamInvitationResponse {
	id: number;
	status: TeamInvitationStatus;
	role: TeamMemberRole;
	user: {
		id: number;
		full_name: string;
	};
}

export interface ITeamInvitationRejectResponse {
	id: number;
	status: TeamInvitationStatus;
}

export interface ITeamEventLogItem {
	user_id: number;
	text: string;
	created_at: string;
}

export interface ITeamEventLogResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: ITeamEventLogItem[];
}

export interface ITeamJoinRequestResponse {
	id: number;
	status: TeamRequestStatus;
}
