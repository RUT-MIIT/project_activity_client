export interface IStatsGroupInstitute {
	id: string;
	name: string;
}

export interface IStatsGroupTeam {
	id: number;
	name: string;
	studentsCount: number;
}

export interface IStatsGroup {
	id: number;
	name: string;
	institute: IStatsGroupInstitute;
	studentsCount: number;
	teams: IStatsGroupTeam[];
	course: 2 | 3 | 4 | 5;
}

export interface IGroupsTableProps {
	groups: IStatsGroup[];
}
