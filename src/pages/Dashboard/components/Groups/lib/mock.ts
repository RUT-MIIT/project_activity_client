import type {
	IStatsGroup,
	IStatsGroupInstitute,
	IStatsGroupTeam,
} from '../types/types';

export const groupInstitutes: IStatsGroupInstitute[] = [
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

const groupStudentsCounts = [
	24, 21, 27, 25, 23, 26, 19, 22, 24, 26, 23, 21, 25, 18, 28, 24, 27, 22, 25,
	23, 20, 21, 26, 24, 22, 27, 23, 19, 25, 22, 24, 26, 21, 23, 18,
];

const teamsCounts = [
	2, 3, 0, 4, 2, 5, 1, 3, 2, 4, 1, 3, 5, 0, 4, 2, 3, 1, 4, 3, 2, 1, 4, 2, 3, 5,
	2, 0, 3, 2, 4, 3, 1, 4, 2,
];

/**
 * Количество студентов, распределённых по командам.
 *
 * null — в группе нет команд.
 * Значение меньше groupStudentsCounts[index] — есть студенты без команды.
 * Значение равно groupStudentsCounts[index] — все студенты в командах.
 */
const teamStudentsCounts = [
	24,
	18,
	null,
	25,
	23,
	20,
	19,
	22,
	17,
	26,
	15,
	21,
	19,
	null,
	28,
	20,
	27,
	14,
	25,
	18,
	20,
	16,
	26,
	24,
	17,
	21,
	23,
	null,
	25,
	18,
	24,
	20,
	12,
	23,
	15,
];

const createTeams = (
	groupId: number,
	groupIndex: number,
	teamsCount: number,
	teamStudentsCount: number
): IStatsGroupTeam[] => {
	if (teamsCount === 0 || teamStudentsCount === 0) {
		return [];
	}

	const baseStudentsCount = Math.floor(teamStudentsCount / teamsCount);

	const remainder = teamStudentsCount % teamsCount;

	return Array.from({ length: teamsCount }, (_, teamIndex) => {
		const teamId = groupId * 10 + teamIndex + 1;

		return {
			id: teamId,
			name: teamNames[(groupIndex + teamIndex) % teamNames.length],
			studentsCount: baseStudentsCount + (teamIndex < remainder ? 1 : 0),
		};
	});
};

export const groupsMock: IStatsGroup[] = Array.from(
	{ length: 35 },
	(_, index) => {
		const id = index + 1;

		const institute = groupInstitutes[Math.floor(index / 7)];

		const course = ((Math.floor(index / 2) % 4) + 2) as 2 | 3 | 4 | 5;
		const groupNumber = (index % 2) + 1;

		const studentsCount = groupStudentsCounts[index];
		const teamsCount = teamsCounts[index];
		const teamStudentsCount = teamStudentsCounts[index];

		return {
			id,
			name: `${institute.name}-${course}-${String(groupNumber).padStart(
				2,
				'0'
			)}`,
			institute,
			course,
			studentsCount,
			teams: createTeams(id, index, teamsCount, teamStudentsCount ?? 0),
		};
	}
);
