import type { FC } from 'react';
import type { IMentorsLoadChartProps } from '../types/types';

import { useMemo } from 'react';
import { useSelector } from '../../../../../store/store';

import { ResponsivePie } from '@nivo/pie';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { loadColors, loadLabels } from '../lib/lib';

import styles from '../styles/mentors-load-chart.module.scss';

export const MentorsLoadChart: FC<IMentorsLoadChartProps> = ({ mentors }) => {
	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);
	const institutes = useSelector((state) => state.catalog.institutes);

	const filteredMentors = useMemo(() => {
		if (!selectedInstitute) {
			return mentors;
		}

		return mentors.filter(
			(mentor) => mentor.institute.id === selectedInstitute
		);
	}, [mentors, selectedInstitute]);

	const data = useMemo(() => {
		return [
			{
				id: '1',
				label: loadLabels['1'],
				value: filteredMentors.filter((mentor) => mentor.groups.length === 1)
					.length,
			},
			{
				id: '2-3',
				label: loadLabels['2-3'],
				value: filteredMentors.filter(
					(mentor) => mentor.groups.length >= 2 && mentor.groups.length <= 3
				).length,
			},
			{
				id: '4+',
				label: loadLabels['4+'],
				value: filteredMentors.filter((mentor) => mentor.groups.length >= 4)
					.length,
			},
			{
				id: 'none',
				label: loadLabels.none,
				value: filteredMentors.filter((mentor) => mentor.groups.length === 0)
					.length,
			},
		].filter((item) => item.value > 0);
	}, [filteredMentors]);

	const selectedInstituteName = institutes.find(
		(institute) => institute.code === selectedInstitute
	)?.name;

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<div className={styles.chart__info}>
					<h2 className={styles.chart__title}>Нагрузка наставников</h2>

					<p className={styles.chart__subtitle}>
						Количество закреплённых учебных групп
					</p>
				</div>
				{selectedInstitute && selectedInstituteName && (
					<Badge text={selectedInstituteName} color='blue' />
				)}
			</div>

			<div className={styles.chart__content}>
				<ResponsivePie
					data={data}
					margin={{
						top: 20,
						right: 160,
						bottom: 20,
						left: 20,
					}}
					innerRadius={0.55}
					padAngle={1}
					cornerRadius={4}
					activeOuterRadiusOffset={6}
					borderWidth={2}
					borderColor='#fff'
					colors={({ id }) => loadColors[String(id)]}
					enableArcLabels
					arcLabel={(datum) => `${datum.value}`}
					arcLabelsSkipAngle={10}
					arcLabelsTextColor='#fff'
					enableArcLinkLabels={false}
					tooltip={({ datum }) => (
						<div
							style={{
								background: '#fff',
								padding: '10px 12px',
								border: '1px solid #ddd',
								borderRadius: 6,
								boxShadow: '0 2px 8px rgba(0, 0, 0, .15)',
								whiteSpace: 'nowrap',
							}}>
							<strong>{datum.label}</strong>

							<div style={{ whiteSpace: 'nowrap' }}>
								{datum.value}{' '}
								{datum.value === 1
									? 'наставник'
									: datum.value >= 2 && datum.value <= 4
									? 'наставника'
									: 'наставников'}
							</div>
						</div>
					)}
					legends={[
						{
							anchor: 'right',
							direction: 'column',
							justify: false,
							translateX: 140,
							itemWidth: 120,
							itemHeight: 28,
							itemsSpacing: 6,
							symbolSize: 14,
							symbolShape: 'circle',
						},
					]}
				/>
			</div>
		</div>
	);
};
