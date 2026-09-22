import type { FC } from 'react';
import type { ICardStatsProps, TStatsCardColor } from '../types/types';

import styles from '../styles/card-stats.module.scss';

const colorClasses: Record<TStatsCardColor, string> = {
	blue: styles.color_blue,
	green: styles.color_green,
	yellow: styles.color_yellow,
	red: styles.color_red,
	purple: styles.color_purple,
	default: styles.color_default,
};

export const CardStats: FC<ICardStatsProps> = ({
	label,
	value,
	subtext,
	unit,
	color = 'default',
}) => {
	return (
		<li className={`${styles.card} ${colorClasses[color]}`}>
			<h4 className={styles.label}>{label}</h4>

			<span className={styles.value}>
				{value}

				{unit && <span className={styles.unit}>{unit}</span>}
			</span>

			{subtext && <p className={styles.subtext}>{subtext}</p>}
		</li>
	);
};
