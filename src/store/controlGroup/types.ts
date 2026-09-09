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

// =========================
// Команды института
// =========================

export interface IInstituteTeamStudyGroup {
	id: number;
	name: string;
}

export interface IInstituteTeamMentor {
	id: number;
	fullName: string;
}

export interface IInstituteTeamProject {
	id: number;
	title: string;
}

export interface IInstituteTeam {
	id: number;
	name: string;
	studyGroup: IInstituteTeamStudyGroup;
	mentors: IInstituteTeamMentor[];
	status: string;
	membersCount: number;
	project: IInstituteTeamProject | null;
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

// =========================
// Студенты института
// =========================

export interface IInstituteStudentStudyGroup {
	id: number;
	name: string;
}

export interface IInstituteStudentMentor {
	id: number;
	fullName: string;
}

export interface IInstituteStudentProject {
	id: number;
	title: string;
}

export interface IInstituteStudent {
	id: number;
	lastName: string;
	firstName: string;
	middleName: string | null;
	isRegistered: boolean;

	studyGroup: IInstituteStudentStudyGroup;

	mentors: IInstituteStudentMentor[];

	teamName: string | null;
	teamRole: string | null;

	project: IInstituteStudentProject | null;
}

export interface IRegistrationSettingsUpdate {
	registrationOpensAt?: string | null;
	closedByDecision?: boolean;
}

export interface IRegistrationSettingsCurrent {
	instituteCode: string;
	instituteName: string;
	registrationOpensAt: string | null;
	closedByDecision: boolean;
	isOpen: boolean;
	status: 'open' | 'closed';
}

export interface IOtherInstituteRegistrationSettings {
	instituteCode: string;
	instituteName: string;
	registrationOpensAt: string | null;
}

export interface IRegistrationSettings {
	current: IRegistrationSettingsCurrent;
	otherInstitutes: IOtherInstituteRegistrationSettings[];
}

export interface IInstituteResponsibleStore {
	groups: IResponsibleGroup[];

	// Статистика групп + команд
	groupsWithTeams: IResponsibleGroupWithTeams[];

	// Список команд
	teams: IInstituteTeam[];

	// Список студентов
	students: IInstituteStudent[];

	registrationSettings: IRegistrationSettings | null;

	employees: IResponsibleEmployee[];

	groupMentors: IGroupMentors[];

	currentGroup: IResponsibleGroup | null;

	isLoadingGroups: boolean;
	isLoadingGroupsWithTeams: boolean;
	isLoadingTeams: boolean;
	isLoadingStudents: boolean;
	isLoadingEmployees: boolean;
	isLoadingGroupMentors: boolean;
	isLoadingMentorRequest: boolean;
	isLoadingRegistrationSettings: boolean;
	isUpdatingRegistrationSettings: boolean;

	error: string | null;
}
