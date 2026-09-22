import type { IStatsMentor } from '../../../../../store/dashboard/types';

import * as XLSX from 'xlsx';

import { getLoadStatus, loadStatusConfig } from './helpers';

export const exportMentorsToExcel = (mentors: IStatsMentor[]) => {
	const rows = mentors.map((mentor, index) => {
		const groupsCount = mentor.groups.length;
		const loadStatus = getLoadStatus(groupsCount);

		return {
			'№': index + 1,
			'Наставник': mentor.fullName,
			'Институт': mentor.institute.name,
			'Количество групп': groupsCount,
			'Количество команд': mentor.teamsCount,
			'Статус нагрузки': loadStatusConfig[loadStatus],
		};
	});

	const worksheet = XLSX.utils.json_to_sheet(rows);

	worksheet['!cols'] = [
		{ wch: 6 },
		{ wch: 35 },
		{ wch: 15 },
		{ wch: 20 },
		{ wch: 20 },
		{ wch: 20 },
	];

	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Наставники');

	XLSX.writeFile(workbook, 'Наставники.xlsx');
};
