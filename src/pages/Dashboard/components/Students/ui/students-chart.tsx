import type { FC } from 'react';

import { useEffect, useMemo, useState } from 'react';

import { ResponsiveBar } from '@nivo/bar';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { useDispatch, useSelector } from '../../../../../store/store';

import { studentsMock } from '../lib/mock';
import { colors, seriesMap } from '../lib/lib';
import { getStudentStatus } from '../lib/helpers';
import { courseOptions } from '../../../lib/helpers';
import { setInstitute } from '../../../../../store/dashboard/reducer';

import styles from '../styles/students-chart.module.scss';

interface IGroupedStats {
	instituteId: string;
	total: number;
	notRegistered: number;
	registeredWithoutTeam: number;
	teamWithoutProject: number;
	withProject: number;
}

export const StudentsChart: FC = () => {
	const dispatch = useDispatch();
	const [showLabels, setShowLabels] = useState(false);

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);
	const selectedCourse = useSelector((state) => state.dashboard.selectedCourse);
	const institutes = useSelector((state) => state.catalog.institutes);

	const data = useMemo(() => {
		const filteredStudents = studentsMock.filter((student) => {
			if (!selectedCourse) {
				return true;
			}

			return student.course === selectedCourse;
		});

		const grouped = filteredStudents.reduce<Record<string, IGroupedStats>>(
			(acc, student) => {
				const institute = student.institute.name;

				if (!acc[institute]) {
					acc[institute] = {
						instituteId: student.institute.id,
						total: 0,
						notRegistered: 0,
						registeredWithoutTeam: 0,
						teamWithoutProject: 0,
						withProject: 0,
					};
				}

				const status = getStudentStatus(student);

				acc[institute].total += 1;
				acc[institute][status] += 1;

				return acc;
			},
			{}
		);

		return institutes
			.filter((institute) => grouped[institute.name])
			.map((institute) => {
				const stats = grouped[institute.name];

				return {
					institute: institute.name,
					instituteId: stats.instituteId,

					notRegistered: Number(
						((stats.notRegistered / stats.total) * 100).toFixed(1)
					),

					registeredWithoutTeam: Number(
						((stats.registeredWithoutTeam / stats.total) * 100).toFixed(1)
					),

					teamWithoutProject: Number(
						((stats.teamWithoutProject / stats.total) * 100).toFixed(1)
					),

					withProject: Number(
						((stats.withProject / stats.total) * 100).toFixed(1)
					),

					total: stats.total,

					notRegisteredCount: stats.notRegistered,
					registeredWithoutTeamCount: stats.registeredWithoutTeam,
					teamWithoutProjectCount: stats.teamWithoutProject,
					withProjectCount: stats.withProject,
				};
			});
	}, [selectedCourse, institutes]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowLabels(true);
		}, 300);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>Статистика по институтам</h2>

					<p className={styles.chart__subtitle}>Прогресс участия студентов</p>
				</div>
				{selectedCourse && (
					<Badge
						text={
							courseOptions.find((elem) => elem.id === selectedCourse)?.name ||
							'undefined'
						}
						color='blue'
					/>
				)}
			</div>

			<div className={styles.chart__content} style={{ height: 360 }}>
				<ResponsiveBar
					data={data}
					keys={[
						'notRegistered',
						'registeredWithoutTeam',
						'teamWithoutProject',
						'withProject',
					]}
					indexBy='institute'
					layout='horizontal'
					groupMode='stacked'
					margin={{
						top: 10,
						right: 20,
						bottom: 35,
						left: 60,
					}}
					padding={0.3}
					valueScale={{
						type: 'linear',
						min: 0,
						max: 100,
					}}
					indexScale={{
						type: 'band',
						round: true,
					}}
					colors={({ id, data: row }) => {
						const color = colors[id as string];

						if (!selectedInstitute || row.instituteId === selectedInstitute) {
							return color;
						}

						const hex = color.replace('#', '');

						const r = parseInt(hex.substring(0, 2), 16);
						const g = parseInt(hex.substring(2, 4), 16);
						const b = parseInt(hex.substring(4, 6), 16);

						return `rgba(${r}, ${g}, ${b}, 0.25)`;
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
					borderWidth={3}
					borderColor='#fff'
					enableGridX
					enableGridY={false}
					labelSkipWidth={15}
					labelSkipHeight={12}
					labelTextColor='#fff'
					label={({ value }) => `${value}%`}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickSize: 0,
						tickPadding: 8,
						format: (value) => `${value}%`,
					}}
					axisLeft={{
						tickSize: 0,
						tickPadding: 10,
						renderTick: (tick) => {
							const isSelected = selectedInstitute === tick.value;

							return (
								<g transform={`translate(${tick.x},${tick.y})`}>
									<text
										x={-10}
										y={0}
										textAnchor='end'
										dominantBaseline='middle'
										fontSize={12}
										fontWeight={isSelected ? 600 : 400}
										fill={isSelected ? '#0575E6' : '#333333'}
										opacity={showLabels ? 1 : 0}
										style={{
											transition: 'all .2s',
										}}>
										{tick.value}
									</text>
								</g>
							);
						},
					}}
					tooltip={({ id, value, indexValue, data: row }) => {
						const key = String(id);

						const countKey = `${key}Count` as
							| 'notRegisteredCount'
							| 'registeredWithoutTeamCount'
							| 'teamWithoutProjectCount'
							| 'withProjectCount';

						return (
							<div
								style={{
									width: 'max-content',
									background: '#fff',
									padding: '10px 12px',
									border: '1px solid #ddd',
									borderRadius: 6,
									boxShadow: '0 2px 8px rgba(0, 0, 0, .15)',
								}}>
								<div>
									<strong>{seriesMap[key]}</strong>
								</div>

								<div>
									{indexValue}: <strong>{row[countKey]}</strong> студентов (
									<strong>{value}%</strong>)
								</div>
							</div>
						);
					}}
					layers={['grid', 'axes', 'bars', 'markers', 'legends', 'annotations']}
				/>
			</div>
		</div>
	);
};
