import type { FC } from 'react';
import type { IMentorsInstituteChartProps } from '../types/types';

import { ResponsiveBar } from '@nivo/bar';

import { useDispatch, useSelector } from '../../../../../store/store';
import { setInstitute } from '../../../../../store/dashboard/reducer';
import { chartColors } from '../lib/lib';

import styles from '../styles/mentors-institute-chart.module.scss';

export const MentorsInstituteChart: FC<IMentorsInstituteChartProps> = ({
	mentors,
}) => {
	const dispatch = useDispatch();

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const institutes = Array.from(
		new Map(
			mentors.map((mentor) => [mentor.institute.id, mentor.institute.name])
		).entries()
	).map(([id, name]) => ({
		id,
		name,
	}));

	const data = institutes.map((institute) => {
		const instituteMentors = mentors.filter(
			(mentor) => mentor.institute.id === institute.id
		);

		const mentorsWithGroups = instituteMentors.filter(
			(mentor) => mentor.groups.length > 0
		);

		const mentorsWithTeams = instituteMentors.filter(
			(mentor) => mentor.teamsCount > 0
		);

		const totalGroups = mentorsWithGroups.reduce(
			(total, mentor) => total + mentor.groups.length,
			0
		);

		const totalTeams = mentorsWithTeams.reduce(
			(total, mentor) => total + mentor.teamsCount,
			0
		);

		return {
			institute: institute.name,
			instituteId: institute.id,

			groups:
				mentorsWithGroups.length > 0
					? Number((totalGroups / mentorsWithGroups.length).toFixed(1))
					: 0,

			teams:
				mentorsWithTeams.length > 0
					? Number((totalTeams / mentorsWithTeams.length).toFixed(1))
					: 0,
		};
	});

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>
						Средняя нагрузка по институтам
					</h2>

					<p className={styles.chart__subtitle}>
						Среднее количество групп и команд на одного наставника
					</p>
				</div>
			</div>

			<div className={styles.chart__content}>
				<ResponsiveBar
					data={data}
					keys={['groups', 'teams']}
					indexBy='institute'
					margin={{
						top: 20,
						right: 20,
						bottom: 45,
						left: 45,
					}}
					padding={0.3}
					groupMode='grouped'
					valueScale={{
						type: 'linear',
					}}
					indexScale={{
						type: 'band',
						round: true,
					}}
					colors={({ id, data: row }) => {
						const color = chartColors[id as keyof typeof chartColors];

						if (!selectedInstitute || row.instituteId === selectedInstitute) {
							return color;
						}

						const hex = color.replace('#', '');

						const r = parseInt(hex.substring(0, 2), 16);
						const g = parseInt(hex.substring(2, 4), 16);
						const b = parseInt(hex.substring(4, 6), 16);

						return `rgba(${r}, ${g}, ${b}, 0.25)`;
					}}
					borderRadius={4}
					enableLabel
					labelSkipWidth={20}
					labelSkipHeight={20}
					labelTextColor='#fff'
					enableGridX={false}
					enableGridY
					axisBottom={{
						tickSize: 0,
						tickPadding: 10,
					}}
					axisLeft={{
						tickSize: 0,
						tickPadding: 8,
						tickValues: 5,
					}}
					onClick={(datum) => {
						const instituteId = datum.data.instituteId;

						dispatch(
							setInstitute(
								selectedInstitute === instituteId ? null : instituteId
							)
						);
					}}
					tooltip={({ id, value, indexValue }) => (
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

							<div>
								{id === 'groups' ? 'Групп' : 'Команд'}: {value} на наставника
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
