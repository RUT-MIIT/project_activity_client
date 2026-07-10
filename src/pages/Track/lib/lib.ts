import type { ITab } from '../../../shared/components/Tabs/types/types';

export const tabs: ITab[] = [
	{
		label: 'Создание трека',
		path: '/track/tabs/create',
	},
	{
		label: 'Треки по группам',
		path: '/track/tabs/group',
	},
	{
		label: 'Треки по проектам',
		path: '/track/tabs/project',
	},
];
