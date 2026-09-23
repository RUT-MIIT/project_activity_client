export interface IDashboardStore {
	students: IStatsStudent[];

	mentors: IStatsMentor[];
	mentorDetail: IStatsMentorDetail | null;

	projects: IStatsProject[];
	projectDetail: IStatsProjectDetail | null;

	groups: IStatsGroup[];
	groupDetail: IStatsGroupDetail | null;

	selectedInstitute: string | null;
	selectedCourse: number | null;
	selectedStudentStatus: TDashboardStudentStatus;

	isLoadingStudents: boolean;

	isLoadingMentors: boolean;
	isLoadingMentorDetail: boolean;

	isLoadingProjects: boolean;
	isLoadingProjectDetail: boolean;

	isLoadingGroups: boolean;
	isLoadingGroupDetail: boolean;

	error: string | null;
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
	mentors?: IStatsStudentMentor[];
}

export interface IStatsStudentTeam {
	id: number;
	name: string;
}

export interface IStatsStudentMentor {
	id: number;
	fullName: string;
}

export interface IStatsStudentProject {
	id: number;
	name: string;
}

export interface IStatsStudentStudyGroup {
	id: number;
	name: string;
}

/* =========================
 * Проект
 * ========================= */

export type TStatsProjectType = 'external' | 'internal';

export interface IStatsProject {
	id: number;
	name: string;
	type: TStatsProjectType;
	customer: string;
	institute: IStatsInstitute;
	maxTeamsCount: number;
	teams: IStatsProjectTeam[];
}

/* =========================
 * Детальная информация о проекте
 * ========================= */

export interface IStatsProjectDetail {
	id: number;
	name: string;
	type: TStatsProjectType;
	customer: string;
	institute: IStatsInstitute;

	teams: IStatsProjectTeamDetail[];

	maxTeamsCount: number;
	currentTeamsCount: number;

	author: IStatsProjectAuthor;

	print_number: string;
	problem_holder: string;
	goal: string;
	barrier: string;
	existing_solutions: string;
}

/* =========================
 * Команда проекта
 * ========================= */

export interface IStatsProjectTeam {
	id: number;
	name: string;
	studyGroup: IStatsStudentStudyGroup;
}

export interface IStatsProjectTeamDetail extends IStatsProjectTeam {
	status: string;
	members: IStatsMember[];
	mentors: IStatsProjectMentor[];
}

/* =========================
 * Участник проекта
 * ========================= */

export interface IStatsMember {
	id: number;
	fullName: string;
	institute: IStatsInstitute;
	studyGroup: IStatsStudentStudyGroup;
	course: 2 | 3 | 4 | 5;
}

/* =========================
 * Наставник проекта
 * ========================= */

export interface IStatsProjectMentor {
	id: number;
	fullName: string;
}

/* =========================
 * Автор проекта
 * ========================= */

export interface IStatsProjectAuthor {
	id: number;
	fullName: string;
	email: string;
}

/* =========================
 * Группа
 * ========================= */

export interface IStatsGroup {
	id: number;
	name: string;
	institute: IStatsInstitute;
	studentsCount: number;
	studentsInTeamCount: number;
	course: 2 | 3 | 4 | 5;
	teams: IStatsGroupTeam[];
}

export interface IStatsGroupTeam {
	id: number;
	name: string;
	studentsCount: number;
}

/* =========================
 * Детальная информация о группе
 * ========================= */

export interface IStatsGroupDetail {
	id: number;
	name: string;
	institute: IStatsInstitute;
	course: 2 | 3 | 4 | 5;
	students: IStatsStudent[];
	teams: IStatsGroupTeamDetail[];
}

/* =========================
 * Команда группы
 * ========================= */

export interface IStatsGroupTeamDetail {
	id: number;
	name: string;
	status: string;
	members: IStatsMember[];
	mentors: IStatsProjectMentor[];
}
