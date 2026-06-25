import type { IApplicationItem } from '../../../store/application/types';
import type { ITab } from '../../../shared/components/Tabs/types/types';

export interface ICoordinationAppProps {
	card: IApplicationItem;
}

export interface ICoordinationHeaderProps {
	tabs: ITab[];
}

export interface ICoordinationAppsListProps {
	apps: IApplicationItem[];
	description?: string;
}

export interface ICoordinationAppsTableProps {
	apps: IApplicationItem[];
	onShowDetail: (id: number) => void;
	onShowHistory: (id: number) => void;
}

export interface IStatusOption {
	id: string;
	name: string;
}
