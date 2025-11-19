import { EMAINROUTES } from '../../../shared/utils/routes';

export const links = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Новая заявка', url: EMAINROUTES.NEW_APP, icon: 'app-add' },
	{ name: 'Мои заявки', url: EMAINROUTES.MY_APPS, icon: 'apps' },
	{
		name: 'Согласование',
		url: EMAINROUTES.COORDINATION,
		icon: 'coordination',
	},
	{ name: 'Статистика', url: EMAINROUTES.STATS, icon: 'stats' },
	{ name: 'Управление', url: EMAINROUTES.CONTROL, icon: 'control' },
];
