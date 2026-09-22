export interface IStatsStudent {
	id: number;
	fullName: string;
	institute: IStatsStudentInstitute;
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

export interface IStatsStudentInstitute {
	id: string;
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

export interface IStudentsTableProps {
	students: IStatsStudent[];
}

export interface IStudentsChartProps {
	selectedInstitute?: string | null;
	onInstituteClick?: (institute: string) => void;
}
