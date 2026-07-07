import type { FC } from 'react';
import type { IExternalChart } from '../../../store/stats/types';

import { useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import styles from '../styles/external-chart.module.scss';

interface Props {
	chart: IExternalChart;
}

export const ExternalChart: FC<Props> = ({ chart }) => {
	const data = useMemo(
		() =>
			chart.items.map((item) => ({
				institute: item.category.short_name,
				fullName: item.category.name,
				percent: item.percent,
				externalCount: item.external_count,
				total: item.total,
				color: item.color,
			})),
		[chart.items]
	);

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<h2 className={styles.chart__title}>Доля внешних по подразделениям</h2>
				<p className={styles.chart__subtitle}>
					% внешних заявок от общего числа по каждому подразделению
				</p>
			</div>
			<div className={styles.chart__content}>
				<ResponsiveBar
					data={data}
					keys={['percent']}
					indexBy='institute'
					layout='vertical'
					colors={() => '#7C3AED'}
					margin={{
						top: 20,
						right: 20,
						bottom: 60,
						left: 40,
					}}
					padding={0.3}
					valueScale={{
						type: 'linear',
						min: 0,
						max: 100,
					}}
					indexScale={{ type: 'band', round: true }}
					borderRadius={4}
					borderWidth={2}
					borderColor='#fff'
					enableGridY
					enableGridX={false}
					label={(d) => `${d.value}%`}
					labelTextColor='#fff'
					axisTop={null}
					axisRight={null}
					axisBottom={{
						tickRotation: -45,
						tickSize: 0,
						tickPadding: 10,
					}}
					axisLeft={{
						format: (v) => `${v}%`,
					}}
					tooltip={({ data }) => (
						<div
							style={{
								minWidth: '108px',
								background: '#fff',
								padding: '8px 12px',
								border: '1px solid #ddd',
								borderRadius: 6,
								boxShadow: '0 2px 8px rgba(0,0,0,.15)',
							}}>
							<strong>{data.institute}</strong>
							<br />
							Внешних: {data.externalCount}
							<br />
							Всего: {data.total}
							<br />
							Доля: <strong>{data.percent}%</strong>
						</div>
					)}
				/>
			</div>
		</div>
	);
};
