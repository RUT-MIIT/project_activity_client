import * as XLSX from 'xlsx';

import type { IStatsGroup } from '../types/types';
import { getGroupStatus, getGroupStudentsInTeams } from './helpers';

export const exportGroupsToExcel = (groups: IStatsGroup[]) => {
	const data = groups.map((group, index) => {
		const studentsInTeams = getGroupStudentsInTeams(group);

		const studentsWithoutTeam = group.studentsCount - studentsInTeams;

		const averageTeamSize =
			group.teams.length > 0 ? studentsInTeams / group.teams.length : 0;

		const participationRate =
			group.studentsCount > 0
				? (studentsInTeams / group.studentsCount) * 100
				: 0;

		const status = getGroupStatus(group);

		const statusConfig = {
			noTeams: 'Нет команд',
			partial: 'Есть без команды',
			full: 'Все в командах',
		};

		return {
			'№': index + 1,
			Группа: group.name,
			Институт: group.institute.name,
			'Количество студентов': group.studentsCount,
			'Количество команд': group.teams.length,
			'Средний размер команды':
				group.teams.length > 0 ? Number(averageTeamSize.toFixed(1)) : '—',
			'Студентов в командах': studentsInTeams,
			'Студентов без команды': studentsWithoutTeam,
			Заполненность: `${participationRate.toFixed(1)}%`,
			Статус: statusConfig[status],
		};
	});

	const worksheet = XLSX.utils.json_to_sheet(data);

	worksheet['!cols'] = [
		{ wch: 6 },
		{ wch: 16 },
		{ wch: 12 },
		{ wch: 22 },
		{ wch: 20 },
		{ wch: 24 },
		{ wch: 24 },
		{ wch: 24 },
		{ wch: 16 },
		{ wch: 20 },
	];

	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Группы');

	XLSX.writeFile(workbook, 'Группы.xlsx');
};
