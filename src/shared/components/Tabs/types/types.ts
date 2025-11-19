export interface ITab {
	label: string;
	path: string;
	count?: number;
	description?: string;
	disabled?: boolean;
}

export interface ITabsProps {
	tabs: ITab[];
	activeTab?: string;
	onTabChange?: (path: string) => void;
}
