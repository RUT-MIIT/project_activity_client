import type { IStatsStudent } from '../types/types';

export const getStudentsStats = (students: IStatsStudent[]) => {
	const totalStudents = students.length;

	const registeredStudents = students.filter(
		(student) => student.isRegistered
	).length;

	const studentsInTeams = students.filter(
		(student) => student.team !== null
	).length;

	const studentsWithoutTeam = students.filter(
		(student) => student.team === null
	).length;

	const studentsWithProject = students.filter(
		(student) => student.project !== null
	).length;

	return [
		{
			id: 'total',
			label: 'Общий контингент',
			value: totalStudents,
			subtext: 'студентов',
			color: 'blue' as const,
		},
		{
			id: 'registered',
			label: 'Зарегистрировано',
			value: registeredStudents,
			subtext: totalStudents
				? `${Math.round(
						(registeredStudents / totalStudents) * 100
				  )}% от контингента`
				: '0% от контингента',
			color: 'yellow' as const,
		},
		{
			id: 'teams',
			label: 'В командах',
			value: studentsInTeams,
			subtext: registeredStudents
				? `${((studentsInTeams / registeredStudents) * 100).toFixed(
						1
				  )}% от зарегистрированных`
				: '0% от зарегистрированных',
			color: 'yellow' as const,
		},
		{
			id: 'lost',
			label: 'Без команды',
			value: studentsWithoutTeam,
			subtext: totalStudents
				? `${(
						((totalStudents - registeredStudents) / totalStudents) *
						100
				  ).toFixed(1)}% не зарегистрированы`
				: '0% не зарегистрированы',
			color: 'red' as const,
		},
		{
			id: 'projects',
			label: 'Выбрали проект',
			value: studentsWithProject,
			subtext: totalStudents
				? `${((studentsWithProject / totalStudents) * 100).toFixed(
						1
				  )}% от контингента`
				: '0% от контингента',
			color: 'green' as const,
		},
	];
};

export const getStudentStatus = (
	student: IStatsStudent
):
	| 'notRegistered'
	| 'registeredWithoutTeam'
	| 'teamWithoutProject'
	| 'withProject' => {
	if (!student.isRegistered) {
		return 'notRegistered';
	}

	if (!student.team) {
		return 'registeredWithoutTeam';
	}

	if (!student.project) {
		return 'teamWithoutProject';
	}

	return 'withProject';
};
