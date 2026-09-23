import type { FC } from 'react';
import type { IGroupsFillRateChartProps } from '../types/types';

import { useDispatch, useSelector } from '../../../../../store/store';

import { ResponsiveBar } from '@nivo/bar';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { setInstitute } from '../../../../../store/dashboard/reducer';

import styles from '../styles/groups-fill-rate-chart.module.scss';

export const GroupsFillRateChart: FC<IGroupsFillRateChartProps> = ({
	groups,
}) => {
	const dispatch = useDispatch();

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

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

		const studentsInTeams = instituteGroups.reduce(
			(total, group) => total + group.studentsInTeamCount,
			0
		);

		const fillRate =
			totalStudents > 0
				? Number(((studentsInTeams / totalStudents) * 100).toFixed(1))
				: 0;

		return {
			institute: institute.name,
			instituteId: institute.id,
			fillRate,
			totalStudents,
			studentsInTeams,
			studentsWithoutTeam: totalStudents - studentsInTeams,
		};
	});

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>
						Заполненность групп по институтам
					</h2>

					<p className={styles.chart__subtitle}>
						Доля студентов, состоящих в командах
					</p>
				</div>

				{selectedCourse && (
					<Badge text={`${selectedCourse} курс`} color='blue' />
				)}
			</div>

			<div className={styles.chart__content}>
				<ResponsiveBar
					data={data}
					keys={['fillRate']}
					indexBy='institute'
					margin={{
						top: 20,
						right: 30,
						bottom: 45,
						left: 40,
					}}
					padding={0.35}
					valueScale={{
						type: 'linear',
						min: 0,
						max: 100,
					}}
					indexScale={{
						type: 'band',
						round: true,
					}}
					colors={({ data: row }) => {
						if (!selectedInstitute || row.instituteId === selectedInstitute) {
							return '#38A169';
						}

						return 'rgba(56, 161, 105, 0.25)';
					}}
					onClick={(datum) => {
						const instituteId = datum.data.instituteId;

						dispatch(
							setInstitute(
								selectedInstitute === instituteId ? null : instituteId
							)
						);
					}}
					borderRadius={4}
					enableLabel
					labelSkipWidth={20}
					labelSkipHeight={0}
					labelTextColor='#fff'
					label={({ value }) => `${value}%`}
					enableGridX={false}
					enableGridY
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
						format: (value) => `${value}%`,
					}}
					tooltip={({ value, indexValue, data: row }) => (
						<div
							style={{
								background: '#fff',
								padding: '10px 12px',
								border: '1px solid #ddd',
								borderRadius: 6,
								boxShadow: '0 2px 8px rgba(0, 0, 0, .15)',
								whiteSpace: 'nowrap',
							}}>
							<strong>{indexValue}</strong>

							{selectedCourse && (
								<div>
									Курс: <strong>{selectedCourse}</strong>
								</div>
							)}

							<div>
								В командах: <strong>{row.studentsInTeams}</strong> студентов
							</div>

							<div>
								Без команды: <strong>{row.studentsWithoutTeam}</strong>{' '}
								студентов
							</div>

							<div>
								Всего: <strong>{row.totalStudents}</strong> студентов
							</div>

							<div>
								Заполненность: <strong>{value}%</strong>
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
