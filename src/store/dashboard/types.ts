export interface IDashboardStore {
	mentors: IStatsMentor[];
	mentorDetail: IStatsMentorDetail | null;

	selectedInstitute: string | null;
	selectedCourse: number | null;
	selectedStudentStatus: TDashboardStudentStatus;
}

export interface IStatsInstitute {
	id: string;
	name: string;
}

export type TDashboardStudentStatus =
	| 'all'
	| 'notRegistered'
	| 'registeredWithoutTeam'
	| 'teamWithoutProject'
	| 'withProject';

/* =========================
 * Статистика по наставникам
 * ========================= */

export interface IStatsMentor {
	id: number;
	fullName: string;
	institute: IStatsInstitute;
	groups: IStatsMentorGroup[];
	teamsCount: number;
}

export interface IStatsMentorGroup {
	id: number;
	name: string;
	studentsCount: number;
}

/* =========================
 * Детальная информация о наставнике
 * ========================= */

export interface IStatsMentorDetail {
	id: number;
	fullName: string;
	institute: IStatsInstitute;
	teamsCount: number;
	groups: IStatsMentorGroupDetail[];
}

export interface IStatsMentorGroupDetail {
	id: number;
	name: string;
	students: IStatsStudent[];
	teams: IStatsMentorTeam[];
}

/* =========================
 * Команда наставника
 * ========================= */

export interface IStatsMentorTeam {
	id: number;
	name: string;
	status: string;
	project: IStatsStudentProject | null;
	studyGroup: IStatsStudentStudyGroup;
	members: IStatsStudent[];
	membersCount: number;
}

/* =========================
 * Студент
 * ========================= */

export interface IStatsStudent {
	id: number;
	fullName: string;
	institute: IStatsInstitute;
	studyGroup: IStatsStudentStudyGroup;
	course: 2 | 3 | 4 | 5;
	isRegistered: boolean;
	team: IStatsStudentTeam | null;
	project: IStatsStudentProject | null;
}

export interface IStatsStudentTeam {
	id: number;
	name: string;
}

export interface IStatsStudentProject {
	id: number;
	name: string;
}

export interface IStatsStudentStudyGroup {
	id: number;
	name: string;
}
