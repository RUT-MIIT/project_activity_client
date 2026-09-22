import * as XLSX from 'xlsx';

import type { IStatsProject } from '../types/types';

type ProjectStatus = 'empty' | 'available' | 'full';

const getProjectStatus = (
	teamsCount: number,
	maxTeamsCount: number
): ProjectStatus => {
	if (teamsCount === 0) {
		return 'empty';
	}

	if (teamsCount >= maxTeamsCount) {
		return 'full';
	}

	return 'available';
};

const projectStatusConfig: Record<ProjectStatus, string> = {
	empty: 'Нет команд',
	available: 'Есть места',
	full: 'Заполнен',
};

export const exportProjectsToExcel = (projects: IStatsProject[]) => {
	const rows = projects.map((project, index) => {
		const teamsCount = project.teams.length;

		const status = getProjectStatus(teamsCount, project.maxTeamsCount);

		return {
			'№': index + 1,
			Проект: project.name,
			Институт: project.institute.name,
			Заполненность: `${teamsCount} из ${project.maxTeamsCount}`,
			'Количество команд': teamsCount,
			'Лимит команд': project.maxTeamsCount,
			Статус: projectStatusConfig[status],
		};
	});

	const worksheet = XLSX.utils.json_to_sheet(rows);

	worksheet['!cols'] = [
		{ wch: 6 },
		{ wch: 50 },
		{ wch: 15 },
		{ wch: 18 },
		{ wch: 20 },
		{ wch: 18 },
		{ wch: 18 },
	];

	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Проекты');

	XLSX.writeFile(workbook, 'Проекты.xlsx');
};
