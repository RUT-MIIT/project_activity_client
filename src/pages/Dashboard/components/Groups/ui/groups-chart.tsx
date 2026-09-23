import type { FC } from 'react';
import type { IGroupsChartProps } from '../types/types';

import { useSelector } from '../../../../../store/store';

import { ResponsiveLine } from '@nivo/line';

import styles from '../styles/groups-chart.module.scss';

export const GroupsChart: FC<IGroupsChartProps> = ({ groups }) => {
	const selectedCourse = useSelector((state) => state.dashboard.selectedCourse);

	const institutes = Array.from(
		new Map(
			groups.map((group) => [group.institute.id, group.institute])
		).values()
	);

	const data = institutes.map((institute) => {
		const instituteGroups = groups.filter(
			(group) =>
				group.institute.id === institute.id &&
				(!selectedCourse || group.course === selectedCourse)
		);

		const totalStudents = instituteGroups.reduce(
			(total, group) => total + group.studentsCount,
			0
		);

		const totalTeamStudents = instituteGroups.reduce(
			(total, group) => total + group.studentsInTeamCount,
			0
		);

		const teamsCount = instituteGroups.reduce(
			(total, group) => total + group.teams.length,
			0
		);

		const averageGroupSize =
			instituteGroups.length > 0
				? Number((totalStudents / instituteGroups.length).toFixed(1))
				: 0;

		const averageTeamSize =
			teamsCount > 0 ? Number((totalTeamStudents / teamsCount).toFixed(1)) : 0;

		return {
			institute: institute.name,
			averageGroupSize,
			averageTeamSize,
			groupsCount: instituteGroups.length,
			teamsCount,
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

							{selectedCourse && (
								<div>
									Курс: <strong>{selectedCourse}</strong>
								</div>
							)}

							<div>
								{point.seriesId}: {point.data.yFormatted}
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
