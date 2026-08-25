import type { FC } from 'react';

import { Card } from '../../../shared/components/Card/ui';

import styles from '../styles/home-plan.module.scss';

export const HomeProject: FC = () => {
	return (
		<Card
			title='Текущий проект'
			subtitle='Проект над которым работает ваша команда'
			withHeightStretch>
			<div className={styles.container}></div>
		</Card>
	);
};
