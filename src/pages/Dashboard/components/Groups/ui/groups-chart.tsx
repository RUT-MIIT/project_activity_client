import type { FC } from 'react';

import { ResponsiveLine } from '@nivo/line';

import { groupInstitutes, groupsMock } from '../lib/mock';

import styles from '../styles/groups-chart.module.scss';

export const GroupsChart: FC = () => {
	const data = groupInstitutes.map((institute) => {
		const groups = groupsMock.filter(
			(group) => group.institute.id === institute.id
		);

		const totalStudents = groups.reduce(
			(total, group) => total + group.studentsCount,
			0
		);

		const teams = groups.flatMap((group) => group.teams);

		const totalTeamStudents = teams.reduce(
			(total, team) => total + team.studentsCount,
			0
		);

		const averageGroupSize =
			groups.length > 0
				? Number((totalStudents / groups.length).toFixed(1))
				: 0;

		const averageTeamSize =
			teams.length > 0
				? Number((totalTeamStudents / teams.length).toFixed(1))
				: 0;

		return {
			institute: institute.name,
			averageGroupSize,
			averageTeamSize,
			groupsCount: groups.length,
			teamsCount: teams.length,
		};
	});

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>
						Размер групп и команд по институтам
					</h2>

					<p className={styles.chart__subtitle}>
						Среднее количество студентов в группе и команде
					</p>
				</div>
			</div>

			<div className={styles.chart__content}>
				<ResponsiveLine
					data={[
						{
							id: 'Средний размер группы',
							data: data.map((item) => ({
								x: item.institute,
								y: item.averageGroupSize,
							})),
						},
						{
							id: 'Средний размер команды',
							data: data.map((item) => ({
								x: item.institute,
								y: item.averageTeamSize,
							})),
						},
					]}
					margin={{
						top: 20,
						right: 30,
						bottom: 45,
						left: 30,
					}}
					xScale={{ type: 'point' }}
					yScale={{
						type: 'linear',
						min: 0,
						max: 'auto',
					}}
					yFormat=' >-.1f'
					curve='linear'
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
					colors={['#0575E6', '#38A169']}
					legends={[
						{
							anchor: 'top-right',
							direction: 'row',
							justify: false,
							translateX: 40,
							translateY: -25,
							itemsSpacing: 20,
							itemDirection: 'left-to-right',
							itemWidth: 180,
							itemHeight: 20,
							symbolSize: 10,
							symbolShape: 'circle',
						},
					]}
					tooltip={({ point }) => (
						<div
							style={{
								background: '#fff',
								padding: '10px 12px',
								border: '1px solid #ddd',
								borderRadius: 6,
								boxShadow: '0 2px 8px rgba(0, 0, 0, .15)',
								whiteSpace: 'nowrap',
							}}>
							<strong>{point.data.xFormatted}</strong>

							<div>{point.data.yFormatted}</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
