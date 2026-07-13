import type { FC } from 'react';
import type { ITrackDetailModal } from '../types/types';

import { useDispatch, useSelector } from '../../../store/store';
import { useState, useEffect } from 'react';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import {
	FormField,
	FormInputStub,
} from '../../../shared/components/Form/components';
import { Text } from '../../../shared/components/Typography';

import {
	getTrackGroupDetailAction,
	getTrackStatsAction,
	removeLinkAction,
} from '../../../store/track/actions';

import styles from '../styles/track.module.scss';

export const TrackDetailModal: FC<ITrackDetailModal> = ({
	id,
	isOpen,
	onClose,
	instituteCode,
}) => {
	const dispatch = useDispatch();
	const { trackGroupDetail, isLoadingDetail } = useSelector(
		(state) => state.track
	);
	const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);

	const handleRemoveLink = async (projectId: number) => {
		if (!trackGroupDetail) return;

		await dispatch(
			removeLinkAction({
				semester_id: 'actual',
				group_id: trackGroupDetail.id,
				project_application_id: projectId,
			})
		).unwrap();

		dispatch(getTrackStatsAction(instituteCode));

		setDeleteProjectId(null);
	};

	useEffect(() => {
		if (id && instituteCode) {
			dispatch(
				getTrackGroupDetailAction({
					groupId: id,
					instituteCode,
				})
			);
		}
	}, [dispatch, id, instituteCode]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} title='Проектный трек группы'>
				{isLoadingDetail ? (
					<Preloader />
				) : (
					<>
						{trackGroupDetail && (
							<>
								<FormField title='Наименование группы'>
									<FormInputStub value={trackGroupDetail.name} />
								</FormField>
								<FormField title='Направление'>
									<FormInputStub
										value={`${trackGroupDetail.direction.name} (${trackGroupDetail.direction.code})`}
									/>
								</FormField>
								<FormField title='Уровень'>
									<FormInputStub value={trackGroupDetail.direction.level} />
								</FormField>
								<FormField title='Список проектов'>
									{trackGroupDetail.projects.length > 0 ? (
										<ul className={styles.list}>
											{trackGroupDetail.projects.map((project) => (
												<li key={project.id} className={styles.item}>
													<div className={styles.item__content}>
														<h4 className={styles.item__title}>
															{project.title}
														</h4>

														<div className={styles.item__info}>
															<span>
																<b>№ заявки:</b> {project.print_number}
															</span>

															<span>
																<b>Автор:</b> {project.author_name}
															</span>
														</div>
													</div>

													<button
														type='button'
														className={styles.item__remove}
														onClick={() => setDeleteProjectId(project.id)}
														aria-label='Удалить проект'>
														✕
													</button>
												</li>
											))}
										</ul>
									) : (
										<Text text='Список проектов пока пуст.' color='grey' />
									)}
								</FormField>
							</>
						)}
					</>
				)}
			</Modal>
			{deleteProjectId && (
				<ConfirmDelete
					isOpen={deleteProjectId !== null}
					id={deleteProjectId}
					onClose={() => setDeleteProjectId(null)}
					onSubmit={handleRemoveLink}
				/>
			)}
		</>
	);
};
