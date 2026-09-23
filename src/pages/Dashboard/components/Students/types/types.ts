import { IStatsStudent } from '../../../../../store/dashboard/types';

export interface IStudentsTableProps {
	students: IStatsStudent[];
}

export interface IStudentsChartProps {
	selectedInstitute?: string | null;
	onInstituteClick?: (institute: string) => void;
}
