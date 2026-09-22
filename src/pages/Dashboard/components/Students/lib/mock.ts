import type {
	IStatsStudent,
	IStatsStudentInstitute,
	IStatsStudentProject,
	IStatsStudentTeam,
	IStatsStudentStudyGroup,
} from '../types/types';

export const institutes: IStatsStudentInstitute[] = [
	{ id: '1', name: 'ИЭФ' },
	{ id: '2', name: 'ИУИТ' },
	{ id: '3', name: 'ИТС' },
	{ id: '4', name: 'ИМТ' },
	{ id: '5', name: 'ИПСС' },
];

export const teams: IStatsStudentTeam[] = [
	{ id: 1, name: 'Транспортные решения' },
	{ id: 2, name: 'Цифровой маршрут' },
	{ id: 3, name: 'Умный транспорт' },
	{ id: 4, name: 'Логистика 360' },
	{ id: 5, name: 'Транспорт будущего' },
	{ id: 6, name: 'Эффективный маршрут' },
	{ id: 7, name: 'Зелёный транспорт' },
	{ id: 8, name: 'Городская мобильность' },
	{ id: 9, name: 'Автоматизация процессов' },
	{ id: 10, name: 'Безопасная дорога' },
];

export const projects: IStatsStudentProject[] = [
	{ id: 1, name: 'Цифровизация транспортных процессов' },
	{ id: 2, name: 'Оптимизация логистических маршрутов' },
	{ id: 3, name: 'Умная транспортная инфраструктура' },
	{ id: 4, name: 'Система мониторинга транспорта' },
	{ id: 5, name: 'Повышение безопасности перевозок' },
	{ id: 6, name: 'Экологичный общественный транспорт' },
	{ id: 7, name: 'Автоматизация работы с клиентами' },
	{ id: 8, name: 'Аналитика пассажиропотока' },
];

const firstNames = [
	'Иван',
	'Алексей',
	'Дмитрий',
	'Максим',
	'Артём',
	'Михаил',
	'Никита',
	'Илья',
	'Кирилл',
	'Даниил',
	'Анна',
	'Мария',
	'Екатерина',
	'Анастасия',
	'Полина',
	'Софья',
];

const lastNames = [
	'Иванов',
	'Петров',
	'Сидоров',
	'Смирнов',
	'Кузнецов',
	'Попов',
	'Васильев',
	'Соколов',
	'Морозов',
	'Новиков',
	'Фёдоров',
	'Волков',
];

const middleNames = [
	'Александрович',
	'Алексеевич',
	'Андреевич',
	'Дмитриевич',
	'Максимович',
	'Михайлович',
	'Игоревич',
	'Сергеевич',
];

export const instituteGroups: IStatsStudentStudyGroup[] = [
	{ id: 1, name: 'ИЭФ-2-01' },
	{ id: 2, name: 'ИЭФ-2-02' },
	{ id: 3, name: 'ИЭФ-3-01' },
	{ id: 4, name: 'ИЭФ-3-02' },
	{ id: 5, name: 'ИЭФ-4-01' },
	{ id: 6, name: 'ИЭФ-4-02' },
	{ id: 7, name: 'ИЭФ-5-01' },
	{ id: 8, name: 'ИУИТ-2-01' },
	{ id: 9, name: 'ИУИТ-2-02' },
	{ id: 10, name: 'ИУИТ-3-01' },
	{ id: 11, name: 'ИУИТ-3-02' },
	{ id: 12, name: 'ИУИТ-4-01' },
	{ id: 13, name: 'ИУИТ-4-02' },
	{ id: 14, name: 'ИУИТ-5-01' },
	{ id: 15, name: 'ИТС-2-01' },
	{ id: 16, name: 'ИТС-2-02' },
	{ id: 17, name: 'ИТС-3-01' },
	{ id: 18, name: 'ИТС-3-02' },
	{ id: 19, name: 'ИТС-4-01' },
	{ id: 20, name: 'ИТС-4-02' },
	{ id: 21, name: 'ИТС-5-01' },
	{ id: 22, name: 'ИМТ-2-01' },
	{ id: 23, name: 'ИМТ-2-02' },
	{ id: 24, name: 'ИМТ-3-01' },
	{ id: 25, name: 'ИМТ-3-02' },
	{ id: 26, name: 'ИМТ-4-01' },
	{ id: 27, name: 'ИМТ-4-02' },
	{ id: 28, name: 'ИМТ-5-01' },
	{ id: 29, name: 'ИПСС-2-01' },
	{ id: 30, name: 'ИПСС-2-02' },
	{ id: 31, name: 'ИПСС-3-01' },
	{ id: 32, name: 'ИПСС-3-02' },
	{ id: 33, name: 'ИПСС-4-01' },
	{ id: 34, name: 'ИПСС-4-02' },
	{ id: 35, name: 'ИПСС-5-01' },
];

export const studentsMock: IStatsStudent[] = Array.from(
	{ length: 100 },
	(_, index) => {
		const id = index + 1;

		const isRegistered = id <= 87;
		const hasTeam = id <= 73;
		const hasProject = id <= 58;

		return {
			id,
			fullName: `${lastNames[index % lastNames.length]} ${
				firstNames[index % firstNames.length]
			} ${middleNames[index % middleNames.length]}`,
			institute: institutes[index % institutes.length],
			studyGroup: instituteGroups[index % instituteGroups.length],
			course: ([2, 3, 4, 5] as const)[index % 4],
			isRegistered,
			team: hasTeam ? teams[index % teams.length] : null,
			project: hasProject ? projects[index % projects.length] : null,
		};
	}
);
