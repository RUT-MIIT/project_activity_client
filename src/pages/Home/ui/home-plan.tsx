import type { FC } from 'react';
import { useSelector } from '../../../store/store';

import { Card } from '../../../shared/components/Card/ui';

import { selectApplicationsSummary } from '../../../store/structure/selectors';
import { getPlanFactColor } from '../lib/helpers';

import styles from '../styles/home-plan.module.scss';

export const HomePlan: FC = () => {
	const { myDivisionStats } = useSelector((state) => state.structure);
	const { approved } = useSelector(selectApplicationsSummary);

	return (
		myDivisionStats && (
			<Card
				title='Выполнение плана'
				subtitle='Соотношение плана к факту заявок'
				withHeightStretch>
				<div className={styles.container}>
					<div className={`${styles.card} ${styles.card_color_blue}`}>
						<h5 className={styles.title}>План подразделения</h5>
						<span className={styles.count}>{myDivisionStats.plan}</span>
						<p className={styles.text}>Плановый показатель заявок</p>
					</div>
					<div
						className={`${styles.card} ${
							styles[
								`card_color_${getPlanFactColor(approved, myDivisionStats.plan)}`
							]
						}`}>
						<h5 className={styles.title}>Факт подразделения</h5>
						<span className={styles.count}>{approved}</span>
						<p className={styles.text}>Фактический показатель заявок</p>
					</div>
				</div>
			</Card>
		)
	);
};
