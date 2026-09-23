import type { FC } from 'react';
import type { ITextProps } from '../../types/types';

import styles from '../../styles/typography.module.scss';

export const Text: FC<ITextProps> = ({
	text,
	weight = 'default',
	color = 'black',
	withMarginTop = false,
}) => {
	return (
		<p
			className={`${styles.text} ${styles[`text_weight_${weight}`]} ${
				styles[`text_color_${color}`]
			} ${withMarginTop ? styles.text_margin_top : ''}`}>
			{text}
		</p>
	);
};
