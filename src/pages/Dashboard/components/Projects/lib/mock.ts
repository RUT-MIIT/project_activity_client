import type {
	IStatsProject,
	IStatsProjectInstitute,
	IStatsProjectTeam,
} from '../types/types';

export const projectInstitutes: IStatsProjectInstitute[] = [
	{ id: '1', name: 'ИЭФ' },
	{ id: '2', name: 'ИУИТ' },
	{ id: '3', name: 'ИТС' },
	{ id: '4', name: 'ИМТ' },
	{ id: '5', name: 'ИПСС' },
];

const teamNames = [
	'Транспортники',
	'Логисты',
	'Digital Team',
	'Новая волна',
	'Проект Х',
	'Инновация',
	'Союз',
	'Импульс',
	'Движение',
	'Пульс',
	'Вектор',
	'Траектория',
	'Сигнал',
	'Магистраль',
	'Форсаж',
];

const projectNames = [
	'Цифровизация транспортной логистики',
	'Умный транспорт будущего',
	'Оптимизация пассажирских перевозок',
	'Цифровая платформа управления перевозками',
	'Развитие транспортной инфраструктуры',
	'Сервис прогнозирования пассажиропотока',
	'Автоматизация работы транспортного предприятия',
	'Система мониторинга транспортных потоков',
	'Разработка мобильного приложения для пассажиров',
	'Оптимизация маршрутов общественного транспорта',
	'Цифровой контроль качества перевозок',
	'Интеллектуальная система управления транспортом',
	'Развитие клиентского сервиса',
	'Система анализа эффективности перевозок',
	'Безопасность на транспорте',
	'Экологичный общественный транспорт',
	'Цифровой профиль пассажира',
	'Система управления транспортными ресурсами',
	'Прогнозирование загрузки маршрутов',
	'Автоматизация документооборота',
	'Развитие городской мобильности',
	'Аналитическая система транспортного предприятия',
	'Сервис планирования поездок',
	'Оптимизация работы транспортных узлов',
	'Цифровая трансформация транспортной отрасли',
];

const createTeams = (
	projectIndex: number,
	teamsCount: number
): IStatsProjectTeam[] => {
	return Array.from({ length: teamsCount }, (_, teamIndex) => {
		const teamId = projectIndex * 10 + teamIndex + 1;

		return {
			id: teamId,
			name: teamNames[(projectIndex + teamIndex) % teamNames.length],
			membersCount: 3 + ((projectIndex + teamIndex) % 5),
		};
	});
};

const maxTeamsCounts = [
	3, 5, 2, 4, 3, 5, 4, 2, 5, 3, 4, 3, 5, 2, 4, 5, 3, 4, 2, 5, 3, 4, 5, 2, 3,
];

const registeredTeamsCounts = [
	2, 5, 1, 4, 0, 3, 2, 2, 5, 1, 4, 3, 2, 2, 4, 5, 1, 4, 0, 3, 2, 4, 5, 1, 3,
];

export const projectsMock: IStatsProject[] = Array.from(
	{ length: 25 },
	(_, index) => {
		const id = index + 1;

		const institute = projectInstitutes[index % projectInstitutes.length];

		const maxTeamsCount = maxTeamsCounts[index];
		const teamsCount = registeredTeamsCounts[index];

		return {
			id,
			name: projectNames[index],
			type: index % 3 === 0 ? 'internal' : 'external',
			institute,
			teams: createTeams(id, teamsCount),
			maxTeamsCount,
			customer: '',
		};
	}
);
