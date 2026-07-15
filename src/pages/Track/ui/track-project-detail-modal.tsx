import type { FC } from 'react';
import type { ITrackDetailModal } from '../types/types';

import { useDispatch, useSelector } from '../../../store/store';
import { useState, useEffect } from 'react';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import {
	FormField,
	FormInputStub,
} from '../../../shared/components/Form/components';
import { Text } from '../../../shared/components/Typography';

import {
	getTrackProjectDetailAction,
	getTrackStatsAction,
	removeLinkAction,
} from '../../../store/track/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/track.module.scss';

export const TrackProjectDetailModal: FC<ITrackDetailModal> = ({
	id,
	isOpen,
	onClose,
	instituteCode,
}) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { trackProjectDetail, isLoadingDetail } = useSelector(
		(state) => state.track
	);

	const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);

	const handleRemoveLink = async (groupId: number) => {
		if (!trackProjectDetail) return;

		try {
			await dispatch(
				removeLinkAction({
					semester_id: 'actual',
					group_id: groupId,
					project_application_id: trackProjectDetail.id,
				})
			).unwrap();

			dispatch(getTrackStatsAction(instituteCode));

			showToast({
				title: 'Связь успешно удалена!',
				text: 'Группа была отвязана от проекта.',
				type: 'success',
			});

			setDeleteGroupId(null);
		} catch (err) {
			showToast({
				title: 'Не удалось удалить связь',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	useEffect(() => {
		if (id && instituteCode) {
			dispatch(
				getTrackProjectDetailAction({
					projectId: id,
					instituteCode,
				})
			);
		}
	}, [dispatch, id, instituteCode]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} title='Проектный трек проекта'>
				{isLoadingDetail ? (
					<Preloader />
				) : (
					<>
						{trackProjectDetail && (
							<>
								<FormField title='Название проекта'>
									<FormInputStub value={trackProjectDetail.title} />
								</FormField>

								<FormField title='Номер заявки'>
									<FormInputStub value={trackProjectDetail.print_number} />
								</FormField>

								<FormField title='Автор'>
									<FormInputStub value={trackProjectDetail.author_name} />
								</FormField>

								<FormField title='Список групп'>
									{trackProjectDetail.groups.length > 0 ? (
										<ul className={styles.list}>
											{trackProjectDetail.groups.map((group) => (
												<li key={group.id} className={styles.item}>
													<div className={styles.item__content}>
														<h4 className={styles.item__title}>{group.name}</h4>

														<div className={styles.item__info}>
															<span>
																<b>Направление:</b> {group.direction.name}
															</span>

															<span>
																<b>Курс:</b> {group.course_number}
															</span>
														</div>
													</div>

													{/*
													<button
														type='button'
														className={styles.item__remove}
														onClick={() => setDeleteGroupId(group.id)}
														aria-label='Удалить группу'>
														✕
													</button>
													*/}
												</li>
											))}
										</ul>
									) : (
										<Text
											text='Проект пока не привязан ни к одной группе.'
											color='grey'
										/>
									)}
								</FormField>
							</>
						)}
					</>
				)}
			</Modal>

			{deleteGroupId && (
				<ConfirmDelete
					isOpen={deleteGroupId !== null}
					id={deleteGroupId}
					onClose={() => setDeleteGroupId(null)}
					onSubmit={handleRemoveLink}
				/>
			)}
		</>
	);
};
