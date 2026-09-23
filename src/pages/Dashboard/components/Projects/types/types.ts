import type { IStatsProject } from '../../../../../store/dashboard/types';

export interface IProjectsTableProps {
	projects: IStatsProject[];
}

export interface IProjectsInstituteChartProps {
	projects: IStatsProject[];
}

export interface IProjectsAverageTeamsChartProps {
	projects: IStatsProject[];
}

export type TProjectStatus = 'empty' | 'available' | 'full';

export interface IProjectDetailModal {
	id: number | null;
	isOpen: boolean;
	onClose: () => void;
}
