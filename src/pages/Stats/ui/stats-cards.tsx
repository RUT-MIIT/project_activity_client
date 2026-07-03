import type { FC } from 'react';

import { useSelector } from '../../../store/store';

import styles from '../styles/stats.module.scss';

const cardColors: Record<string, string> = {
	total: styles.card_color_blue,
	approved: styles.card_color_green,
	in_work: styles.card_color_yellow,
	rejected: styles.card_color_red,
	avg_resolution_days: styles.card_color_purple,
};

export const StatsCards: FC = () => {
	const { stats } = useSelector((state) => state.stats);

	if (!stats) return null;

	return (
		<ul className={styles.cards}>
			{stats.summary_cards.cards.map((item) => (
				<li
					key={item.id}
					className={`${styles.card} ${cardColors[item.id] ?? ''}`}>
					<h4 className={styles.label}>{item.label}</h4>

					<span className={styles.value}>
						{item.value}
						{item.unit && <span className={styles.unit}>{item.unit}</span>}
					</span>

					<p className={styles.subtext}>{item.subtext}</p>
				</li>
			))}
		</ul>
	);
};
