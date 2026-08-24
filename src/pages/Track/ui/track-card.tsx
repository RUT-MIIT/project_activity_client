import type { FC } from 'react';
import type { ITrack } from '../../../store/track/types';

import { useState } from 'react';

import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Text } from '../../../shared/components/Typography';

import styles from '../styles/track-card.module.scss';
import { Button } from '../../../shared/components/Button/ui/button';

interface ITrackCardProps {
	track: ITrack;

	onEdit?: (track: ITrack) => void;
	onDelete?: (id: number) => void;

	onAddGroup?: (track: ITrack) => void;
	onAddProject?: (track: ITrack) => void;

	onRemoveGroup?: (trackId: number, groupId: number) => void;
	onRemoveProject?: (trackId: number, applicationId: number) => void;
}

export const TrackCard: FC<ITrackCardProps> = ({
	track,
	onEdit,
	onDelete,
	onAddGroup,
	onAddProject,
	onRemoveGroup,
	onRemoveProject,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const maxTeams = track.applications.reduce(
		(sum, application) => sum + application.teamsCount,
		0
	);

	return (
		<div className={styles.item}>
			<div className={styles.main}>
				<div className={styles.content}>
					<h3 className={styles.content__title}>{track.name}</h3>

					<div className={styles.item__info}>
						<Badge text={`Групп: ${track.groups.length} `} />
						<Badge text={`Проектов: ${track.applications.length}`} />
						<Badge text={`Максимальное количество команд: ${maxTeams}`} />
					</div>
				</div>

				<div className={styles.controls}>
					<button
						type='button'
						className={`${styles.button} ${styles.button_edit}`}
						onClick={() => onEdit?.(track)}
						aria-label='Редактировать'>
						✎
					</button>
					<button
						type='button'
						className={`${styles.button} ${styles.button_delete}`}
						onClick={() => onDelete?.(track.id)}
						aria-label='Удалить'>
						✕
					</button>

					<span
						className={`${styles.button} ${styles.button_details} ${
							styles.arrow
						} ${isOpen ? styles.arrow_open : ''}`}
						onClick={() => setIsOpen(!isOpen)}>
						▼
					</span>
				</div>
			</div>

			{isOpen && (
				<div
					className={`${styles.details} ${isOpen ? styles.details_open : ''}`}>
					<div className={styles.details__content}>
						<div className={styles.columns}>
							<div className={styles.column}>
								<div className={styles.column__header}>
									<h4 className={styles.column__title}>
										Группы ({track.groups.length})
									</h4>
									<Button
										text='Добавить группу'
										color='blue'
										onClick={() => onAddGroup?.(track)}
										withIcon={{ type: 'add', position: 'left', color: 'white' }}
									/>
								</div>

								{track.groups.length ? (
									<ul className={styles.list}>
										{track.groups.map((group) => (
											<li key={group.id} className={styles.detail__item}>
												<div className={styles.content}>
													<h5 className={styles.item__title}>{group.name}</h5>

													<div className={styles.item__info}>
														<span>
															<b>ID:</b> {group.id}
														</span>

														<span>
															<b>Курс:</b> {group.course_number}
														</span>

														<span>
															<b>Студентов:</b> {group.students_count}
														</span>
													</div>
												</div>

												<button
													type='button'
													className={styles.item__remove}
													onClick={() => onRemoveGroup?.(track.id, group.id)}
													aria-label='Удалить группу'>
													✕
												</button>
											</li>
										))}
									</ul>
								) : (
									<Text text='Группы отсутствуют' color='grey' />
								)}
							</div>

							<div className={styles.column}>
								<div className={styles.column__header}>
									<h4 className={styles.column__title}>
										Проекты ({track.applications.length})
									</h4>
									<Button
										text='Добавить проект'
										color='blue'
										onClick={() => onAddProject?.(track)}
										withIcon={{ type: 'add', position: 'left', color: 'white' }}
									/>
								</div>

								{track.applications.length ? (
									<ul className={styles.list}>
										{track.applications.map((application) => (
											<li key={application.id} className={styles.detail__item}>
												<div className={styles.content}>
													<h5 className={styles.item__title}>
														{application.title}
													</h5>

													<div className={styles.item__info}>
														<span>
															<b>ID:</b> {application.id}
														</span>

														<span>
															<b>№ заявки:</b> {application.print_number}
														</span>
													</div>
												</div>

												<button
													type='button'
													className={styles.item__remove}
													onClick={() =>
														onRemoveProject?.(track.id, application.id)
													}
													aria-label='Удалить проект'>
													✕
												</button>
											</li>
										))}
									</ul>
								) : (
									<Text text='Проекты отсутствуют' color='grey' />
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
