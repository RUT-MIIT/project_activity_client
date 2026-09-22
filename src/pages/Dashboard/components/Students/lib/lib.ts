import type { TDashboardStudentStatus } from '../../../../../store/dashboard/types';

export const statusOptions = [
	{
		id: 'all',
		name: 'Все статусы',
	},
	{
		id: 'notRegistered',
		name: 'Не зарегистрированы',
	},
	{
		id: 'registeredWithoutTeam',
		name: 'Зарегистрированы без команды',
	},
	{
		id: 'teamWithoutProject',
		name: 'В команде без проекта',
	},
	{
		id: 'withProject',
		name: 'Выбрали проект',
	},
] satisfies {
	id: TDashboardStudentStatus;
	name: string;
}[];

export const colors: Record<string, string> = {
	notRegistered: '#A0AEC0',
	registeredWithoutTeam: '#805AD5',
	teamWithoutProject: '#DD6B20',
	withProject: '#38A169',
};

export const seriesMap: Record<string, string> = {
	notRegistered: 'Не зарегистрированы',
	registeredWithoutTeam: 'Зарегистрированы без команды',
	teamWithoutProject: 'В команде без проекта',
	withProject: 'Выбрали проект',
};
