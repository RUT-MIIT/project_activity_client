import type { IStatsMentor } from '../../../../../store/dashboard/types';
import type { TMentorLoadStatus } from '../types/types';

export const getMentorsStats = (mentors: IStatsMentor[]) => {
	const totalMentors = mentors.length;

	const mentorsWithoutGroups = mentors.filter(
		(mentor) => mentor.groups.length === 0
	).length;

	const mentorsWithGroups = mentors.filter(
		(mentor) => mentor.groups.length > 0
	);

	const mentorsWithTeams = mentors.filter((mentor) => mentor.teamsCount > 0);

	const totalGroups = mentorsWithGroups.reduce(
		(total, mentor) => total + mentor.groups.length,
		0
	);

	const totalTeams = mentorsWithTeams.reduce(
		(total, mentor) => total + mentor.teamsCount,
		0
	);

	const averageGroups =
		mentorsWithGroups.length > 0 ? totalGroups / mentorsWithGroups.length : 0;

	const averageTeams =
		mentorsWithTeams.length > 0 ? totalTeams / mentorsWithTeams.length : 0;

	return [
		{
			id: 'total',
			label: 'Общее количество наставников',
			value: totalMentors,
			subtext: 'наставников',
			color: 'blue' as const,
		},
		{
			id: 'withoutGroups',
			label: 'Наставники без групп',
			value: mentorsWithoutGroups,
			subtext:
				totalMentors > 0
					? `${((mentorsWithoutGroups / totalMentors) * 100).toFixed(
							1
					  )}% от общего количества`
					: '0% от общего количества',
			color: 'red' as const,
		},
		{
			id: 'averageGroups',
			label: 'Среднее количество групп',
			value: averageGroups.toFixed(1),
			subtext: 'на 1 наставника с группами',
			color: 'purple' as const,
		},
		{
			id: 'averageTeams',
			label: 'Среднее количество команд',
			value: averageTeams.toFixed(1),
			subtext: 'на 1 наставника с командами',
			color: 'green' as const,
		},
	];
};

export const getLoadStatus = (groupsCount: number): TMentorLoadStatus => {
	if (groupsCount === 0) {
		return 'withoutLoad';
	}

	if (groupsCount === 1) {
		return 'low';
	}

	if (groupsCount <= 3) {
		return 'medium';
	}

	return 'high';
};

export const loadStatusConfig: Record<
	TMentorLoadStatus,
	{ text: string; color: 'grey' | 'green' | 'yellow' | 'red' }
> = {
	withoutLoad: {
		text: 'Без нагрузки',
		color: 'grey',
	},
	low: {
		text: 'Низкая',
		color: 'green',
	},
	medium: {
		text: 'Средняя',
		color: 'yellow',
	},
	high: {
		text: 'Высокая',
		color: 'red',
	},
};

export const loadStatusOptions = [
	{
		id: 'all',
		name: 'Все статусы',
	},
	{
		id: 'withoutLoad',
		name: 'Без нагрузки',
	},
	{
		id: 'low',
		name: 'Низкая',
	},
	{
		id: 'medium',
		name: 'Средняя',
	},
	{
		id: 'high',
		name: 'Высокая',
	},
];
