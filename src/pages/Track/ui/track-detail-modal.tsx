import type { FC } from 'react';
import type { ITrackDetailModal } from '../types/types';

import { useDispatch, useSelector } from '../../../store/store';
import { useEffect } from 'react';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';

import { getTrackGroupDetailAction } from '../../../store/track/actions';

export const TrackDetailModal: FC<ITrackDetailModal> = ({
	id,
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();
	const { trackGroupDetail, isLoadingDetail } = useSelector(
		(state) => state.track
	);

	useEffect(() => {
		if (id) {
			dispatch(getTrackGroupDetailAction(id));
		}
	}, [dispatch, id]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Проектный трек группы'
			description='Просмотр и удаление проектов'>
			{isLoadingDetail ? (
				<Preloader />
			) : (
				<>
					{trackGroupDetail && (
						<ul>
							{trackGroupDetail.projects.map((elem) => (
								<li key={elem.id}>
									Название: {elem.title} Номер заявки: {elem.print_number}{' '}
									Автор: {elem.author_name}
								</li>
							))}
						</ul>
					)}
				</>
			)}
		</Modal>
	);
};
