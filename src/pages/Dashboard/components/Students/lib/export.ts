import * as XLSX from 'xlsx';

import type { IStatsStudent } from '../../../../../store/dashboard/types';

export const exportStudentsToExcel = (students: IStatsStudent[]) => {
	const rows = students.map((student, index) => {
		return {
			'№': index + 1,
			'Студент': student.fullName,
			'Институт': student.institute.name,
			'Группа': student.studyGroup.name,
			'Команда': student.team?.name || 'Без команды',
			'Проект': student.project?.name || 'Без проекта',
			'Регистрация': student.isRegistered
				? 'Зарегистрирован'
				: 'Не зарегистрирован',
		};
	});

	const worksheet = XLSX.utils.json_to_sheet(rows);

	worksheet['!cols'] = [
		{ wch: 6 },
		{ wch: 35 },
		{ wch: 15 },
		{ wch: 15 },
		{ wch: 25 },
		{ wch: 50 },
		{ wch: 20 },
	];

	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workbook, worksheet, 'Студенты');

	XLSX.writeFile(workbook, 'Студенты.xlsx');
};
