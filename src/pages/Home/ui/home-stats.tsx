import type { FC } from 'react';

import { useSelector } from '../../../store/store';

import { Card } from '../../../shared/components/Card/ui';

import { selectApplicationsSummary } from '../../../store/structure/selectors';

import styles from '../styles/home-stats.module.scss';

export const HomeStats: FC = () => {
	const { myDivisionStats } = useSelector((state) => state.structure);
	const { total, approved, active, returned } = useSelector(
		selectApplicationsSummary
	);

	if (!myDivisionStats) return null;

	const statsData = [
		{
			title: 'Всего заявок',
			text: 'Созданы сотрудниками подразделения',
			count: total,
			color: 'blue',
		},
		{
			title: 'Согласовано',
			text: 'Успешно согласованные заявки',
			count: approved,
			color: 'green',
		},
		{
			title: 'На согласовании',
			text: 'Ожидают одобрения и согласования',
			count: active,
			color: 'yellow',
		},
		{
			title: 'На доработке',
			text: 'Возвращены авторам для исправлений',
			count: returned,
			color: 'red',
		},
	];

	return (
		myDivisionStats && (
			<>
				<Card
					title='Статистика подразделения'
					subtitle={myDivisionStats.department_name}
					withHeightStretch>
					<div className={styles.container}>
						{statsData.map((elem, i) => (
							<div
								className={`${styles.card} ${
									styles[`card_color_${elem.color}`]
								}`}
								key={i}>
								<h5 className={styles.title}>{elem.title}</h5>
								<span className={styles.count}>{elem.count}</span>
								<p className={styles.text}>{elem.text}</p>
							</div>
						))}
					</div>
				</Card>
			</>
		)
	);
};
