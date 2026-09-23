import type { IStatsGroup } from '../../../../../store/dashboard/types';

export interface IGroupsTableProps {
	groups: IStatsGroup[];
}

export interface IGroupsChartProps {
	groups: IStatsGroup[];
}

export interface IGroupsFillRateChartProps {
	groups: IStatsGroup[];
}
