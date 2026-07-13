import type { FC } from 'react';
import type { ITrackStats } from '../../../store/track/types';

import styles from '../styles/track.module.scss';

interface ITrackNormsProps {
	stats: ITrackStats;
}

export const TrackNorms: FC<ITrackNormsProps> = ({ stats }) => {
	const distributionPercent =
		stats.total_projects === 0
			? 0
			: Number(
					((stats.distributed_projects / stats.total_projects) * 100).toFixed(2)
			  );

	return (
		<div className={styles.norms}>
			<div className={`${styles.card} ${styles.card_color_green}`}>
				<h5 className={styles.card__title}>Всего проектов</h5>
				<span className={styles.card__count}>{stats.total_projects}</span>
				<p className={styles.card__text}>
					Общее количество проектов, доступных для распределения
				</p>
			</div>

			<div className={`${styles.card} ${styles.card_color_blue}`}>
				<h5 className={styles.card__title}>Процент распределения</h5>
				<span className={styles.card__count}>{distributionPercent}%</span>
				<p className={styles.card__text}>
					Процент проектов, назначенных учебным группам
				</p>
			</div>

			<div className={`${styles.card} ${styles.card_color_yellow}`}>
				<h5 className={styles.card__title}>Среднее число проектов</h5>
				<span className={styles.card__count}>
					{stats.average_projects_per_group.toFixed(1)}
				</span>
				<p className={styles.card__text}>
					Среднее количество проектов на одну учебную группу
				</p>
			</div>

			<div className={`${styles.card} ${styles.card_color_red}`}>
				<h5 className={styles.card__title}>Группы без проектов</h5>
				<span className={styles.card__count}>
					{stats.groups_without_projects}
				</span>
				<p className={styles.card__text}>
					Количество групп, для которых ещё не назначены проекты
				</p>
			</div>
		</div>
	);
};
