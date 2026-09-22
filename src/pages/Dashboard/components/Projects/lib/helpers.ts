import { projectsMock } from './mock';

export const getProjectsStats = (projects: typeof projectsMock) => {
	const totalProjects = projects.length;

	const projectsWithTeams = projects.filter(
		(project) => project.teams.length > 0
	).length;

	const emptyProjects = projects.filter(
		(project) => project.teams.length === 0
	).length;

	const totalTeams = projects.reduce(
		(total, project) => total + project.teams.length,
		0
	);

	const averageTeamsPerProject =
		totalProjects > 0 ? totalTeams / totalProjects : 0;

	return [
		{
			id: 'total',
			label: 'Общее количество проектов',
			value: totalProjects,
			subtext: 'проектов',
			color: 'blue' as const,
		},
		{
			id: 'withTeams',
			label: 'Проекты с командами',
			value: projectsWithTeams,
			subtext:
				totalProjects > 0
					? `${((projectsWithTeams / totalProjects) * 100).toFixed(
							1
					  )}% от общего количества`
					: '0% от общего количества',
			color: 'green' as const,
		},
		{
			id: 'empty',
			label: 'Пустые проекты',
			value: emptyProjects,
			subtext:
				totalProjects > 0
					? `${((emptyProjects / totalProjects) * 100).toFixed(
							1
					  )}% от общего количества`
					: '0% от общего количества',
			color: 'red' as const,
		},
		{
			id: 'averageTeams',
			label: 'Среднее количество команд',
			value: averageTeamsPerProject.toFixed(1),
			subtext: 'на 1 проект',
			color: 'purple' as const,
		},
	];
};
