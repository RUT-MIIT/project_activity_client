import type { FC } from 'react';

import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from '../../../../../store/store';

import { ResponsiveBar } from '@nivo/bar';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { getStudentStatus } from '../lib/helpers';
import { colors, seriesMap } from '../lib/lib';
import { setCourse } from '../../../../../store/dashboard/reducer';

import styles from '../styles/students-chart.module.scss';

export const StudentsCourseChart: FC = () => {
	const dispatch = useDispatch();
	const [showLabels, setShowLabels] = useState(false);

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);
	const selectedCourse = useSelector((state) => state.dashboard.selectedCourse);
	const students = useSelector((state) => state.dashboard.students);
	const institutes = useSelector((state) => state.catalog.institutes);

	const data = useMemo(() => {
		const filteredStudents = students.filter((student) => {
			return !selectedInstitute || student.institute.id === selectedInstitute;
		});

		const grouped = filteredStudents.reduce<
			Record<
				number,
				{
					total: number;
					notRegistered: number;
					registeredWithoutTeam: number;
					teamWithoutProject: number;
					withProject: number;
				}
			>
		>((acc, student) => {
			if (!acc[student.course]) {
				acc[student.course] = {
					total: 0,
					notRegistered: 0,
					registeredWithoutTeam: 0,
					teamWithoutProject: 0,
					withProject: 0,
				};
			}

			const status = getStudentStatus(student);

			acc[student.course].total += 1;
			acc[student.course][status] += 1;

			return acc;
		}, {});

		return [2, 3, 4, 5]
			.filter((course) => grouped[course])
			.map((course) => {
				const stats = grouped[course];

				return {
					course: `${course} курс`,
					courseId: course,

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

					notRegisteredCount: stats.notRegistered,
					registeredWithoutTeamCount: stats.registeredWithoutTeam,
					teamWithoutProjectCount: stats.teamWithoutProject,
					withProjectCount: stats.withProject,

					total: stats.total,
				};
			});
	}, [students, selectedInstitute]);

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
					<h2 className={styles.chart__title}>Статистика по курсам</h2>

					<p className={styles.chart__subtitle}>Прогресс участия студентов</p>
				</div>

				{selectedInstitute && (
					<Badge
						text={
							institutes.find((elem) => elem.code === selectedInstitute)
								?.name || 'undefined'
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
					indexBy='course'
					groupMode='stacked'
					margin={{
						top: 20,
						right: 20,
						bottom: 45,
						left: 50,
					}}
					valueScale={{
						type: 'linear',
						min: 0,
						max: 105,
					}}
					padding={0.35}
					indexScale={{
						type: 'band',
						round: true,
					}}
					onClick={(datum) => {
						const courseId = datum.data.courseId;

						dispatch(setCourse(selectedCourse === courseId ? null : courseId));
					}}
					colors={({ id, data: row }) => {
						const color = colors[id as string];

						if (!selectedCourse || row.courseId === selectedCourse) {
							return color;
						}

						const hex = color.replace('#', '');

						const r = parseInt(hex.substring(0, 2), 16);
						const g = parseInt(hex.substring(2, 4), 16);
						const b = parseInt(hex.substring(4, 6), 16);

						return `rgba(${r}, ${g}, ${b}, 0.25)`;
					}}
					borderRadius={4}
					borderWidth={3}
					borderColor='#fff'
					enableGridX={false}
					enableGridY
					labelSkipWidth={15}
					labelSkipHeight={12}
					labelTextColor='#fff'
					label={({ value }) => `${value}%`}
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickSize: 0,
						tickPadding: 10,
					}}
					axisLeft={{
						tickSize: 0,
						tickPadding: 10,
						tickValues: [0, 20, 40, 60, 80, 100],
						format: (value) => `${value}%`,
						renderTick: (tick) => (
							<g transform={`translate(${tick.x},${tick.y})`}>
								<text
									x={-10}
									y={0}
									textAnchor='end'
									dominantBaseline='middle'
									fontSize={12}
									fill='#333333'
									opacity={showLabels ? 1 : 0}
									style={{ transition: 'opacity .2s' }}>
									{tick.value}%
								</text>
							</g>
						),
					}}
					tooltip={({ id, value, data: row }) => {
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
									{row.course}: <strong>{row[countKey]}</strong> студентов (
									<strong>{value}%</strong>)
								</div>
							</div>
						);
					}}
				/>
			</div>
		</div>
	);
};
