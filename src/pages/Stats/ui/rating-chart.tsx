import { FC, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { IRatingChart } from '../../../store/stats/types';

import styles from '../styles/rating-chart.module.scss';

interface Props {
	chart: IRatingChart;
	onInstituteClick?: (code: string) => void;
}

const colors: Record<string, string> = {
	approved: '#38A169',
	in_work: '#DD6B20',
	rejected: '#E53E3E',
};

export const RatingChart: FC<Props> = ({ chart, onInstituteClick }) => {
	const data = useMemo(() => {
		return chart.categories.map((category, index) => {
			const row: Record<string, string | number> = {
				institute: category.short_name,
				institute_code: category.code,
			};

			chart.series.forEach((series) => {
				row[series.id] = series.data[index];
			});

			return row;
		});
	}, [chart]);

	const seriesMap = useMemo(
		() => Object.fromEntries(chart.series.map((s) => [s.id, s.name])),
		[chart.series]
	);

	const instituteMap = useMemo(
		() =>
			Object.fromEntries(chart.categories.map((c) => [c.short_name, c.name])),
		[chart.categories]
	);

	const ROW_HEIGHT = 36;
	const HEADER_HEIGHT = 90;
	const PADDING = 40;

	const chartHeight = useMemo(() => {
		return chart.categories.length * ROW_HEIGHT + HEADER_HEIGHT + PADDING;
	}, [chart.categories.length]);

	return (
		<div className={styles.chart}>
			<div className={styles.chart__header}>
				<h2 className={styles.chart__title}>Рейтинг по институтам</h2>
				<p className={styles.chart__subtitle}>
					Накопительная шкала по статусам. При выборе подразделения — рейтинг по
					подразделениям.
				</p>
			</div>
			<div className={styles.chart__content} style={{ height: chartHeight }}>
				<ResponsiveBar
					data={data}
					keys={chart.series.map((s) => s.id)}
					indexBy='institute'
					layout='horizontal'
					groupMode='stacked'
					margin={{
						top: 40,
						right: 20,
						bottom: 40,
						left: 60,
					}}
					padding={0.3}
					valueScale={{ type: 'linear' }}
					indexScale={{ type: 'band', round: true }}
					colors={({ id }) => colors[id as string]}
					borderRadius={4}
					borderWidth={4}
					borderColor='#fff'
					enableGridX
					enableGridY={false}
					labelSkipWidth={12}
					labelSkipHeight={12}
					labelTextColor='#fff'
					axisTop={null}
					axisRight={null}
					axisLeft={{
						tickSize: 0,
						tickPadding: 10,
						renderTick: (tick) => (
							<g transform={`translate(${tick.x},${tick.y})`}>
								<text
									x={-10}
									y={0}
									textAnchor='end'
									dominantBaseline='middle'
									fontSize={12}
									fill='#333333'>
									<title>{instituteMap[String(tick.value)]}</title>
									{tick.value}
								</text>
							</g>
						),
					}}
					legends={[
						{
							dataFrom: 'keys',
							anchor: 'top-right',
							direction: 'row',
							translateY: -40,
							itemWidth: 120,
							itemHeight: 20,
							symbolSize: 12,
							data: chart.series.map((s) => ({
								id: s.id,
								label: s.name,
								color: colors[s.id],
							})),
						},
					]}
					tooltip={({ id, value, indexValue }) => (
						<div
							style={{
								width: 'max-content',
								background: '#fff',
								padding: '8px 12px',
								border: '1px solid #ddd',
								borderRadius: 6,
								boxShadow: '0 2px 8px rgba(0, 0, 0, .15)',
							}}>
							<strong>{seriesMap[String(id)]}</strong>
							{' — '}
							{indexValue}: <strong>{value}</strong>
						</div>
					)}
					onClick={(bar) => {
						const code = (bar.data as any).institute_code;
						onInstituteClick?.(code);
					}}
				/>
			</div>
		</div>
	);
};
