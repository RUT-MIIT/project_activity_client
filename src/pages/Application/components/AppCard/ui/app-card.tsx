import type { FC } from 'react';
import type { IAppCardProps } from '../types/types';

import { useSelector } from '../../../../../store/store';

import { Button } from '../../../../../shared/components/Button/ui/button';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import {
	getStatusColor,
	getStatusText,
	getStagesCount,
	getUserLevel,
} from '../../../lib/helpers';
import { getFullDate } from '../../../../../shared/lib/date';

import styles from '../styles/app-card.module.scss';

export const AppCard: FC<IAppCardProps> = ({
	card,
	withAuthor = false,
	onShowDetail,
}) => {
	const { user } = useSelector((state) => state.user);

	const level = getUserLevel(user?.role || 'user');
	const statusColor = getStatusColor(card.status.code, level);
	const statusText = getStatusText(card.status.code, card.status.name);
	const stage = getStagesCount(card.status.code);

	return (
		<li className={styles.card} key={card.id}>
			<div className={styles.card__header}>
				<Badge text={statusText} color={statusColor} />
				<div className={styles.card__comments}>{card.comments_count}</div>
				<span className={styles.card__stage}>Этап {stage} из 4</span>
			</div>
			<div className={styles.card__main}>
				<h4 className={styles.card__title}>{card.title}</h4>
				<p className={styles.card__text}>{card.company}</p>
				<div className={styles.card__row}>
					<div className={styles.card__column}>
						<p
							className={`${styles.card__text} ${styles.card__text_color_grey}`}>
							№ заявки
						</p>
						<p className={styles.card__text}>{card.print_number || '...'}</p>
					</div>
					<div className={styles.card__column}>
						<p
							className={`${styles.card__text} ${styles.card__text_color_grey}`}>
							Дата подачи
						</p>
						<p className={styles.card__text}>
							{getFullDate(card.creation_date)}
						</p>
					</div>
				</div>
				{withAuthor && (
					<div className={styles.card__row}>
						<div className={styles.card__column}>
							<p
								className={`${styles.card__text} ${styles.card__text_color_grey}`}>
								Автор
							</p>
							<p className={styles.card__text}>{card.author_name}</p>
						</div>
						<div className={styles.card__column}>
							<p
								className={`${styles.card__text} ${styles.card__text_color_grey}`}>
								Почта
							</p>
							<p className={styles.card__text}>{card.author_email}</p>
						</div>
					</div>
				)}
			</div>
			<div className={styles.card__footer}>
				{card.needs_consultation && (
					<span className={styles.card__help}>Нужна помощь!</span>
				)}

				<Button text='История изменения' color='cancel' />
				<Button text='Просмотр' onClick={() => onShowDetail(card.id)} />
			</div>
		</li>
	);
};
