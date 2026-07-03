export interface IStatsStore {
	stats: IStats | null;
	selectedInstitute: string | null;
	isLoading: boolean;
	error: string | null;
}

export interface IStats {
	summary_cards: {
		cards: ISummaryCard[];
	};
	rating_chart: IRatingChart;
	application_type_distribution: IDistributionChart;
	status_distribution: IStatusChart;
}

export interface ISummaryCard {
	id: string;
	label: string;
	subtext: string;
	value: number;
	unit?: string;
}

export interface IRatingChart {
	categories: {
		id: number;
		code: string;
		name: string;
		parent_id: number | null;
		short_name: string;
	}[];
	dimension: string;
	id: string;
	title: string;
	subtitle: string;
	type: string;
	series: {
		color: string;
		id: string;
		name: string;
		data: number[];
	}[];
}

export interface IDistributionChart {
	id: string;
	title: string;
	subtitle: string;
	type: string;
	segments: {
		group: string;
		label: string;
		count: number;
		percent: number;
		color: string;
	}[];
}

export interface IStatusChart {
	id: string;
	title: string;
	subtitle: string;
	type: string;
	segments: {
		group: string;
		label: string;
		count: number;
		percent: number;
		color: string;
	}[];
}
