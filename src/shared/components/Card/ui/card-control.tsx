import type { FC } from 'react';
import type { ICardControlProps } from '../types/types';

import styles from '../styles/card.module.scss';

export const CardControl: FC<ICardControlProps> = ({
	children,
	withMarginAuto = false,
}) => {
	return (
		<div
			className={`${styles.control} ${
				withMarginAuto ? styles.control_margin_auto : ''
			}`}>
			{children}
		</div>
	);
};
