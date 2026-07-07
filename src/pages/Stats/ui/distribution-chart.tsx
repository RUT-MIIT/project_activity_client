import { FC, useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';

import { IDistributionChart } from '../../../store/stats/types';

import styles from '../styles/distribution-chart.module.scss';

interface Props {
	chart: IDistributionChart;
}

const colors: Record<string, string> = {
	blue: '#0575E6',
	teal: '#7C3AED',
};

export const DistributionChart: FC<Props> = ({ chart }) => {
	const data = useMemo(
		() =>
			chart.segments.map((segment) => ({
				id: segment.group,
				label: segment.label,
				value: segment.count,
				color: colors[segment.color],
				percent: segment.percent,
			})),
		[chart]
	);

	const labelMap = useMemo(
		() => Object.fromEntries(chart.segments.map((s) => [s.group, s.label])),
		[chart.segments]
	);

	const external = chart.segments.find((s) => s.group === 'external');
	const internal = chart.segments.find((s) => s.group === 'internal');
	const externalPercent = external?.percent ?? 0;

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<h2 className={styles.chart__title}>Доля внешних заявок</h2>
				<p className={styles.chart__subtitle}>Внешние и внутренние заявки</p>
			</div>
			<div className={styles.chart__content}>
				<div className={styles.chart__pie}>
					<ResponsivePie
						data={data}
						innerRadius={0.7}
						padAngle={2}
						cornerRadius={4}
						activeOuterRadiusOffset={4}
						colors={(d) => d.data.color}
						enableArcLabels={false}
						enableArcLinkLabels={false}
						margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
						layers={[
							'arcs',
							'arcLabels',
							'arcLinkLabels',
							'legends',
							({ centerX, centerY }) => {
								const percentFontSize = Math.max(
									18,
									Math.min(centerX * 0.25, 64)
								);
								const labelFontSize = Math.max(10, Math.min(centerX * 0.1, 16));

								return (
									<g>
										<text
											x={centerX}
											y={centerY - 8}
											textAnchor='middle'
											fontSize={percentFontSize}
											fontWeight={800}
											fill='#7C3AED'>
											{externalPercent}%
										</text>

										<text
											x={centerX}
											y={centerY + percentFontSize / 2}
											textAnchor='middle'
											fontSize={labelFontSize}
											fontWeight={500}
											fill='#333'>
											Внешние
										</text>
									</g>
								);
							},
						]}
						tooltip={({ datum }) => (
							<div
								style={{
									minWidth: '90px',
									background: '#fff',
									padding: '8px 12px',
									border: '1px solid #ddd',
									borderRadius: 6,
									boxShadow: '0 2px 8px rgba(0,0,0,.15)',
								}}>
								<strong>{labelMap[datum.id]}</strong>
								<br />
								{datum.value} заявок ({datum.data.percent}%)
							</div>
						)}
					/>
				</div>
				<div className={styles.chart__legend}>
					<div className={styles.legendItem}>
						<span className={styles.dotPurple} />
						Внешние — <b>{external?.count ?? 0} </b>
					</div>

					<div className={styles.legendItem}>
						<span className={styles.dotBlue} />
						Внутренние — <b>{internal?.count ?? 0}</b>
					</div>
				</div>
			</div>
		</div>
	);
};
