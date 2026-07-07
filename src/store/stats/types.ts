export interface IStatsStore {
	stats: IStats | null;
	institutes: IInstituteOption[];
	selectedInstitute: IInstituteOption | null;
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
	external_share_chart: IExternalChart;
}

export interface ISummaryCard {
	id: string;
	label: string;
	subtext: string;
	value: number;
	unit?: string;
}

export interface IExternalChart {
	categories: IInstituteCategory[];
	dimension: string;
	id: string;
	title: string;
	subtitle: string;
	type: string;
	series: {
		colors: string[];
		id: string;
		name: string;
		data: number[];
		unit: string;
	}[];
	items: {
		category: IInstituteCategory;
		color: string;
		external_count: number;
		percent: number;
		total: number;
	}[];
}

export interface IRatingChart {
	categories: IInstituteCategory[];
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

export interface IInstituteOption {
	id: number;
	code: string;
	name: string;
	short_name: string;
	parent_id: number | null;
}

export interface IInstituteCategory {
	id: number;
	code: string;
	name: string;
	parent_id: number | null;
	short_name: string;
}
