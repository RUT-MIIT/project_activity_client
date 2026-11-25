import type { FC } from 'react';
import type { IBadge } from '../types/types';

import styles from '../styles/badge.module.scss';

export const Badge: FC<IBadge> = ({
	text,
	color = 'blue',
	type = 'elem',
	withDot = false,
	onClick,
}) => {
	const className = `${styles.badge} ${styles[`badge_color_${color}`]} ${
		withDot ? styles.badge_dot : ''
	}`;

	return type === 'elem' ? (
		<div className={className}>{text}</div>
	) : (
		<button
			className={`${className} ${styles.badge_active}`}
			onClick={onClick}
			type='button'>
			{text}
		</button>
	);
};
