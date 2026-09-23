import type { FC } from 'react';
import type { IProjectsInstituteChartProps } from '../types/types';

import { useDispatch, useSelector } from '../../../../../store/store';

import { ResponsiveBar } from '@nivo/bar';

import { setInstitute } from '../../../../../store/dashboard/reducer';

import styles from '../styles/projects-institute-chart.module.scss';

const chartColors = {
	withTeams: '#38A169',
	empty: '#E53E3E',
};

export const ProjectsInstituteChart: FC<IProjectsInstituteChartProps> = ({
	projects,
}) => {
	const dispatch = useDispatch();

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const validProjects = projects.filter(
		(project) => project.institute.id.trim() && project.institute.name.trim()
	);

	const institutes = Array.from(
		new Map(
			validProjects.map((project) => [project.institute.id, project.institute])
		).values()
	);

	const data = institutes.map((institute) => {
		const instituteProjects = validProjects.filter(
			(project) => project.institute.id === institute.id
		);

		const projectsWithTeams = instituteProjects.filter(
			(project) => project.teams.length > 0
		);

		const emptyProjects = instituteProjects.filter(
			(project) => project.teams.length === 0
		);

		return {
			institute: institute.name,
			instituteId: institute.id,
			withTeams: projectsWithTeams.length,
			empty: emptyProjects.length,
		};
	});

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>Проекты по институтам</h2>

					<p className={styles.chart__subtitle}>
						Проекты с командами и пустые проекты
					</p>
				</div>
			</div>

			<div className={styles.chart__content}>
				<ResponsiveBar
					data={data}
					keys={['withTeams', 'empty']}
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
					tooltip={({ id, value, indexValue }) => {
						return (
							<div
								style={{
									background: '#fff',
									padding: '10px 12px',
									border: '1px solid #ddd',
									borderRadius: 6,
									boxShadow: '0 2px 8px rgba(0, 0, .15)',
									whiteSpace: 'nowrap',
								}}>
								<strong>{indexValue}</strong>

								<div>
									{id === 'withTeams' ? 'С командами' : 'Пустых проектов'}:{' '}
									{value}
								</div>
							</div>
						);
					}}
					onClick={(datum) => {
						const instituteId = datum.data.instituteId;

						dispatch(
							setInstitute(
								selectedInstitute === instituteId ? null : instituteId
							)
						);
					}}
				/>
			</div>
		</div>
	);
};
