import type { IStatsGroup } from '../types/types';

export const getGroupsStats = (groups: IStatsGroup[]) => {
	const totalGroups = groups.length;

	const totalTeams = groups.reduce(
		(total, group) => total + group.teams.length,
		0
	);

	const totalStudents = groups.reduce(
		(total, group) => total + group.studentsCount,
		0
	);

	const totalTeamStudents = groups.reduce(
		(total, group) =>
			total +
			group.teams.reduce(
				(teamTotal, team) => teamTotal + team.studentsCount,
				0
			),
		0
	);

	const averageStudentsPerGroup =
		totalGroups > 0 ? totalStudents / totalGroups : 0;

	const averageStudentsPerTeam =
		totalTeams > 0 ? totalTeamStudents / totalTeams : 0;

	return [
		{
			id: 'totalGroups',
			label: 'Общее количество групп',
			value: totalGroups,
			subtext: 'групп',
			color: 'blue' as const,
		},
		{
			id: 'totalTeams',
			label: 'Общее количество команд',
			value: totalTeams,
			subtext: 'команд',
			color: 'green' as const,
		},
		{
			id: 'averageStudentsPerGroup',
			label: 'Средний размер группы',
			value: averageStudentsPerGroup.toFixed(1),
			subtext: 'студентов на группу',
			color: 'purple' as const,
		},
		{
			id: 'averageStudentsPerTeam',
			label: 'Средний размер команды',
			value: averageStudentsPerTeam.toFixed(1),
			subtext: 'студентов на команду',
			color: 'purple' as const,
		},
	];
};

export type TGroupStatus = 'noTeams' | 'partial' | 'full';

export const getGroupStudentsInTeams = (group: IStatsGroup) => {
	return group.teams.reduce((total, team) => total + team.studentsCount, 0);
};

export const getGroupStatus = (group: IStatsGroup): TGroupStatus => {
	const studentsInTeams = getGroupStudentsInTeams(group);

	if (group.teams.length === 0) {
		return 'noTeams';
	}

	if (studentsInTeams >= group.studentsCount) {
		return 'full';
	}

	return 'partial';
};

export const groupStatusOptions = [
	{
		id: 'all',
		name: 'Все группы',
	},
	{
		id: 'noTeams',
		name: 'Нет команд',
	},
	{
		id: 'partial',
		name: 'Есть студенты без команды',
	},
	{
		id: 'full',
		name: 'Все студенты в командах',
	},
];
