import { EMAINROUTES } from '../../../shared/utils/routes';

export const adminLinks = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Новая заявка', url: EMAINROUTES.NEW_APP, icon: 'app-add' },
	{ name: 'Мои заявки', url: EMAINROUTES.MY_APPS, icon: 'apps' },
	{ name: 'Внешние заявки', url: EMAINROUTES.EXTERNAL_APPS, icon: 'external' },
	{
		name: 'Согласование',
		url: EMAINROUTES.COORDINATION,
		icon: 'coordination',
	},
	{
		name: 'Структура',
		url: EMAINROUTES.STRUCTURE,
		icon: 'stats',
	},
	{ name: 'Статистика', url: EMAINROUTES.STATS, icon: 'graph' },
	{ name: 'Управление', url: EMAINROUTES.CONTROL, icon: 'control' },
];

export const mentorLinks = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Новая заявка', url: EMAINROUTES.NEW_APP, icon: 'app-add' },
	{ name: 'Мои заявки', url: EMAINROUTES.MY_APPS, icon: 'apps' },
	{
		name: 'Мои группы',
		url: EMAINROUTES.MY_GROUPS,
		icon: 'group',
	},
];

export const departmentValidatorLinks = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Новая заявка', url: EMAINROUTES.NEW_APP, icon: 'app-add' },
	{ name: 'Мои заявки', url: EMAINROUTES.MY_APPS, icon: 'apps' },
	{
		name: 'Согласование',
		url: EMAINROUTES.COORDINATION,
		icon: 'coordination',
	},
	{
		name: 'Мои группы',
		url: EMAINROUTES.MY_GROUPS,
		icon: 'group',
	},
];

export const instituteValidatorLinks = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Новая заявка', url: EMAINROUTES.NEW_APP, icon: 'app-add' },
	{ name: 'Мои заявки', url: EMAINROUTES.MY_APPS, icon: 'apps' },
	{
		name: 'Согласование',
		url: EMAINROUTES.COORDINATION,
		icon: 'coordination',
	},
	{
		name: 'Структура',
		url: EMAINROUTES.STRUCTURE,
		icon: 'stats',
	},
	{ name: 'Статистика', url: EMAINROUTES.STATS, icon: 'graph' },
	{
		name: 'Проектные треки',
		url: EMAINROUTES.TRACK,
		icon: 'control',
	},
	{
		name: 'Учебные группы',
		url: EMAINROUTES.CONTROL_GROUP,
		icon: 'education',
	},
	{
		name: 'Мои группы',
		url: EMAINROUTES.MY_GROUPS,
		icon: 'group',
	},
];

export const cpdsLinks = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Новая заявка', url: EMAINROUTES.NEW_APP, icon: 'app-add' },
	{ name: 'Мои заявки', url: EMAINROUTES.MY_APPS, icon: 'apps' },
	{ name: 'Внешние заявки', url: EMAINROUTES.EXTERNAL_APPS, icon: 'external' },
	{
		name: 'Согласование',
		url: EMAINROUTES.COORDINATION,
		icon: 'coordination',
	},
	{
		name: 'Структура',
		url: EMAINROUTES.STRUCTURE,
		icon: 'stats',
	},
	{ name: 'Статистика', url: EMAINROUTES.STATS, icon: 'graph' },
	{
		name: 'Проектные треки',
		url: EMAINROUTES.TRACK,
		icon: 'control',
	},
	{ name: 'Управление', url: EMAINROUTES.CONTROL, icon: 'control' },
];

export const studentLinks = [
	{ name: 'Главная', url: EMAINROUTES.HOME, icon: 'home' },
	{ name: 'Моя команда', url: EMAINROUTES.TEAM, icon: 'team' },
	{
		name: 'Витрина проектов',
		url: EMAINROUTES.SHOWCASE,
		icon: 'showcase',
	},
	{ name: 'Учебная группа', url: EMAINROUTES.GROUP, icon: 'group' },
];

export const getLinksByRole = (role?: string) => {
	switch (role) {
		case 'admin':
			return adminLinks;
		case 'mentor':
			return mentorLinks;
		case 'department_validator':
			return departmentValidatorLinks;
		case 'institute_validator':
			return instituteValidatorLinks;
		case 'cpds':
			return cpdsLinks;
		case 'student':
			return studentLinks;
		default:
			return [];
	}
};
