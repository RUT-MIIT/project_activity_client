import type { ITab } from '../../../shared/components/Tabs/types/types';

export const getTrackTabs = (role?: string): ITab[] => {
	if (role === 'cpds') {
		return [
			{
				label: 'Треки по группам',
				path: '/track/tabs/group',
			},
			{
				label: 'Треки по проектам',
				path: '/track/tabs/project',
			},
		];
	}

	return [
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
};
