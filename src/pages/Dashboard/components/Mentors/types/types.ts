import type { IStatsMentor } from '../../../../../store/dashboard/types';

export interface IMentorsTableProps {
	mentors: IStatsMentor[];
}

export interface IMentorsLoadChartProps {
	mentors: IStatsMentor[];
}

export interface IMentorsInstituteChartProps {
	mentors: IStatsMentor[];
}

export type TMentorLoadStatus = 'withoutLoad' | 'low' | 'medium' | 'high';

export interface IMentorDetailModal {
	id: number | null;
	isOpen: boolean;
	onClose: () => void;
}
