import type { FC } from 'react';

import { ResponsiveLine } from '@nivo/line';

import { projectInstitutes, projectsMock } from '../lib/mock';

import styles from '../styles/projects-average-teams-chart.module.scss';

export const ProjectsAverageTeamsChart: FC = () => {
	const data = projectInstitutes.map((institute) => {
		const projects = projectsMock.filter(
			(project) => project.institute.id === institute.id
		);

		const totalTeams = projects.reduce(
			(total, project) => total + project.teams.length,
			0
		);

		const averageTeams =
			projects.length > 0
				? Number((totalTeams / projects.length).toFixed(1))
				: 0;

		return {
			institute: institute.name,
			averageTeams,
		};
	});

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>
						Среднее количество команд по институтам
					</h2>

					<p className={styles.chart__subtitle}>
						Среднее число команд на один проект
					</p>
				</div>
			</div>

			<div className={styles.chart__content}>
				<ResponsiveLine
					data={[
						{
							id: 'Среднее количество команд',
							data: data.map((item) => ({
								x: item.institute,
								y: item.averageTeams,
							})),
						},
					]}
					margin={{
						top: 20,
						right: 30,
						bottom: 45,
						left: 60,
					}}
					xScale={{
						type: 'point',
					}}
					yScale={{
						type: 'linear',
						min: 0,
						max: 'auto',
					}}
					yFormat=' >-.1f'
					curve='linear'
					colors={['#7c3aed']}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickSize: 0,
						tickPadding: 10,
					}}
					axisLeft={{
						tickSize: 0,
						tickPadding: 10,
						tickValues: 5,
					}}
					enableGridX={false}
					enableGridY
					enablePoints
					pointSize={8}
					pointBorderWidth={2}
					pointLabelYOffset={-12}
					useMesh
					tooltip={({ point }) => (
						<div
							style={{
								background: '#fff',
								padding: '10px 12px',
								border: '1px solid #ddd',
								borderRadius: 6,
								boxShadow: '0 2px 8px rgba(0, 0, .15)',
								whiteSpace: 'nowrap',
							}}>
							<strong>{point.data.xFormatted}</strong>

							<div>{point.data.yFormatted} - команд на проект</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
