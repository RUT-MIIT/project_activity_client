import { FC, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { IStatusChart } from '../../../store/stats/types';

import styles from '../styles/status-chart.module.scss';

interface Props {
	chart: IStatusChart;
}

const colors: Record<string, string> = {
	approved: '#38A169',
	in_work: '#DD6B20',
	rejected: '#E53E3E',
};

export const StatusChart: FC<Props> = ({ chart }) => {
	const data = useMemo(() => {
		const row: Record<string, string | number> = {
			status: '100%',
		};

		chart.segments.forEach((s) => {
			row[s.group] = s.percent;
		});

		return [row];
	}, [chart]);

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<h2 className={styles.chart__title}>Доля заявок по статусам</h2>
				<p className={styles.chart__subtitle}>
					Доля каждого статуса от общего числа заявок
				</p>
			</div>
			<div className={styles.chart__content}>
				<ResponsiveBar
					data={data}
					keys={chart.segments.map((s) => s.group)}
					indexBy='status'
					layout='horizontal'
					groupMode='stacked'
					padding={0.2}
					margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
					valueScale={{ type: 'linear', min: 0, max: 100 }}
					indexScale={{ type: 'band', round: true }}
					colors={({ id }) => colors[id as string]}
					borderRadius={6}
					enableGridX={false}
					enableGridY={false}
					labelSkipWidth={12}
					labelSkipHeight={12}
					labelTextColor='#fff'
					borderWidth={4}
					borderColor='#fff'
					axisTop={null}
					axisRight={null}
					axisBottom={null}
					axisLeft={null}
					tooltip={({ id, value }) => {
						const segment = chart.segments.find((s) => s.group === id);

						return (
							<div
								style={{
									width: 'max-content',
									background: '#fff',
									padding: '8px 12px',
									border: '1px solid #ddd',
									borderRadius: 6,
									boxShadow: '0 2px 8px rgba(0,0,0,.15)',
								}}>
								<strong>{segment?.label}</strong>
								<br />
								{value}% ({segment?.count})
							</div>
						);
					}}
				/>
			</div>
			<div className={styles.legend}>
				{chart.segments.map((s) => (
					<div key={s.group} className={styles.legendItem}>
						<span
							className={styles.dot}
							style={{ background: colors[s.group] }}
						/>
						{s.label} — {s.percent}%
					</div>
				))}
			</div>
		</div>
	);
};
