import type { FC } from 'react';

import { useSelector } from '../../../store/store';

import styles from '../styles/track.module.scss';

export const TrackNorms: FC = () => {
	const { trackStats } = useSelector((state) => state.track);

	if (!trackStats) {
		return;
	}

	const distributionPercent =
		trackStats.total_projects === 0
			? 0
			: (
					(trackStats.distributed_projects / trackStats.total_projects) *
					100
			  ).toFixed(2);

	return (
		<div className={styles.norms}>
			<div className={`${styles.card} ${styles.card_color_green}`}>
				<h5 className={styles.card__title}>Всего проектов</h5>
				<span className={styles.card__count}>{trackStats.total_projects}</span>
				<p className={styles.card__text}>
					Общее количество проектов, доступных для распределения
				</p>
			</div>

			<div className={`${styles.card} ${styles.card_color_blue}`}>
				<h5 className={styles.card__title}>Процент распределения</h5>
				<span className={styles.card__count}>{distributionPercent}%</span>
				<p className={styles.card__text}>
					Процент проектов, назначенных проектным группам
				</p>
			</div>

			<div className={`${styles.card} ${styles.card_color_yellow}`}>
				<h5 className={styles.card__title}>Среднее число проектов</h5>
				<span className={styles.card__count}>
					{trackStats.average_projects_per_group.toFixed(1)}
				</span>
				<p className={styles.card__text}>
					Среднее количество проектов на одну проектную группу
				</p>
			</div>

			<div className={`${styles.card} ${styles.card_color_red}`}>
				<h5 className={styles.card__title}>Группы без проектов</h5>
				<span className={styles.card__count}>
					{trackStats.groups_without_projects}
				</span>
				<p className={styles.card__text}>
					Количество групп, для которых ещё не назначены проекты
				</p>
			</div>
		</div>
	);
};
