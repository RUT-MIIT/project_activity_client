export interface IStatsProjectInstitute {
	id: string;
	name: string;
}

export interface IStatsProjectTeam {
	id: number;
	name: string;
	membersCount: number;
}

export interface IStatsProject {
	id: number;
	name: string;
	type: 'external' | 'internal';
	institute: IStatsProjectInstitute;
	teams: IStatsProjectTeam[];
	maxTeamsCount: number;
}
