import type { FC } from 'react';

import { CardStats } from '../../../../../shared/components/Card/ui';

import { overviewStats } from '../lib/mock';

import styles from '../styles/overview.module.scss';

export const Overview: FC = () => {
	return (
		<div className={styles.overview}>
			<ul className={styles.cards}>
			</ul>
		</div>
	);
};
