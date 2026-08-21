export interface ITrackDetailModal {
	id: number | null;
	isOpen: boolean;
	onClose: () => void;
	instituteCode: string;
}

export interface ICreateTrackProject {
	id: number;
	teamsCount: number;
	minTeamMembers: number;
	maxTeamMembers: number;
}

export interface ICreateTrackData {
	name: string;
	maxTeams: number;
	projects: ICreateTrackProject[];
}
