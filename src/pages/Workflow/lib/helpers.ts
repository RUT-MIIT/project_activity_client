import type { ITab } from '../../../shared/components/Tabs/types/types';

export const workflowTabs: ITab[] = [
	{
		label: 'Обзор',
		path: 'overview',
	},
	{
		label: 'Задачи команды',
		path: 'tasks',
	},
	{
		label: 'Доска',
		path: 'board',
	},
	{
		label: 'Календарь',
		path: 'events',
	},
	{
		label: 'Исходная информация',
		path: 'info',
	},
	{
		label: 'Материалы',
		path: 'materials',
	},
];

export const getMemberRoleName = (role: string) => {
	switch (role) {
		case 'leader':
			return 'Капитан команды';
		case 'member':
			return 'Участник';
		case 'mentor':
			return 'Наставник';
		default:
			return role;
	}
};

export { getTaskStatusColor, getTaskStatusText } from './tasks';
