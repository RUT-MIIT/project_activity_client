import type { FC } from 'react';
import type { IProgressBarProps } from '../types/types';

import { getPercent } from '../lib/helpers';

import styles from '../styles/progress-bar.module.scss';

export const ProgressBar: FC<IProgressBarProps> = ({
	value,
	max,
	withInfo = false,
	caption,
}) => {
	const percent = getPercent(value, max);

	return (
		<div className={styles.container}>
			{withInfo && (
				<div className={styles.info}>
					<p className={styles.caption}>{caption}</p>
					<span
						className={`${styles.percent} ${
							percent === 0 ? styles.percent_color_grey : ''
						}`}>
						{percent}%
					</span>
				</div>
			)}

			<div className={styles.progress}>
				<div
					className={styles.progress__fill}
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
};
