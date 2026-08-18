import type { FC } from 'react';
import type { IProjectCardProps } from './types';

import { Badge } from '../../../../shared/components/Badge/ui/badge';
import { Button } from '../../../../shared/components/Button/ui/button';
import { Tooltip } from '../../../../shared/components/Tooltip/ui/tooltip';

import styles from './project-card.module.scss';

export const ProjectCard: FC<IProjectCardProps> = ({
	card,
	onShowDetail,
	onSelect,
	isSelect,
}) => {
	return (
		<div className={`${styles.card} ${isSelect ? styles.card_select : ''}`}>
			<div className={styles.card__header}>
				{card.tags.map((elem) => (
					<Badge
						key={elem.id}
						text={elem.name}
						color={isSelect ? 'white' : 'blue'}
					/>
				))}
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
						<p className={styles.card__text}>{card.print_number}</p>
					</div>
					<div className={styles.card__column}>
						<p
							className={`${styles.card__text} ${styles.card__text_color_grey}`}>
							Автор
						</p>
						<p className={styles.card__text}>{card.author_name}</p>
					</div>
				</div>
			</div>
			<div className={styles.card__control}>
				<div className={styles.tooltip}>
					{card.track_composer_comment && (
						<Tooltip
							content={
								<p className={styles.tooltip__text}>
									В заявке есть комментарий для составителя трека
								</p>
							}>
							<div
								className={`${styles.tooltip__icon} ${styles.tooltip__icon_comment}`}></div>
						</Tooltip>
					)}
				</div>
				{onShowDetail && (
					<Button
						text='Подробнее'
						color='cancel'
						onClick={() => onShowDetail(card.id)}
					/>
				)}
				{isSelect ? (
					<Button
						text='Отменить выбор'
						color='red'
						onClick={() => onSelect(card.id)}
					/>
				) : (
					<Button
						text='Выбрать проект'
						color='blue'
						onClick={() => onSelect(card.id)}
					/>
				)}
			</div>
		</div>
	);
};
