export interface IResponsibleGroup {
	id: number;
	name: string;
	courseNumber: number;
	directionCode: string;
}

export interface IResponsibleGroupWithTeams {
	id: number;
	name: string;
	studentsCount: number;
	registeredStudentsCount: number;
	teamsCount: number;
	assembledTeamsCount: number;
	studentsInTeamsCount: number;
}

export interface IResponsibleEmployee {
	id: number;
	fullName: string;
}

export interface IGroupMentors extends IResponsibleGroup {
	mentorIds: number[];
}

export interface IAssignMentorRequest {
	groupId: number;
	mentorId: number;
	semesterId?: string;
}

export interface IRemoveMentorRequest {
	groupId: number;
	mentorId: number;
	semesterId?: string;
}

export interface IAssignMentorResponse {
	groupId: number;
	semesterId: number;
	mentorIds: number[];
}

export interface IRemoveMentorResponse {
	groupId: number;
	semesterId: number;
	mentorIds: number[];
}

export interface IInstituteResponsibleStore {
	groups: IResponsibleGroup[];
	groupsWithTeams: IResponsibleGroupWithTeams[];
	employees: IResponsibleEmployee[];

	// Группы вместе с назначенными наставниками
	groupMentors: IGroupMentors[];

	currentGroup: IResponsibleGroup | null;

	isLoadingGroups: boolean;
	isLoadingEmployees: boolean;
	isLoadingGroupMentors: boolean;
	isLoadingMentorRequest: boolean;
	isLoadingGroupsWithTeams: boolean;

	error: string | null;
}
