import type { IApplicationItem } from '../../../store/application/types';
import type { ITab } from '../../../shared/components/Tabs/types/types';

export interface ICoordinationAppProps {
	card: IApplicationItem;
}

export interface ICoordinationAppTabsProps {
	tabs: ITab[];
}

export interface ICoordinationAppsListProps {
	apps: IApplicationItem[];
	description?: string;
}
