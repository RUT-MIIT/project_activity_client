import type { FC } from 'react';
import type { IDivisionTag } from '../../../store/structure/types';

import { useEffect } from 'react';

import { useSelector, useDispatch } from '../../../store/store';

import {
	getMyDivisionTagsAction,
	removeDivisionTagAction,
} from '../../../store/structure/actions';
import {
	setCurrentTag,
	openCreateDivisionTagModal,
	openRemoveDivisionTagModal,
	closeModals,
} from '../../../store/structure/reducer';

import { Button } from '../../../shared/components/Button/ui/button';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';
import { CreateDivisionTagForm } from './create-division-tag-form';

import styles from '../styles/structure-hashtags.module.scss';

export const StructureHashtags: FC = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const {
		divisionsTags,
		currentTag,
		isLoadingTags,
		isOpenCreateDivisionTagModal,
		isOpenRemoveDivisionTagModal,
	} = useSelector((state) => state.structure);

	const openRemoveTagModal = (tag: IDivisionTag) => {
		dispatch(setCurrentTag(tag));
		dispatch(openRemoveDivisionTagModal());
	};

	const handleRemoveTag = (id: number) => {
		if (user) {
			dispatch(
				removeDivisionTagAction({
					tag_id: id,
					department_id: user.department.id,
				})
			);
		}
	};

	useEffect(() => {
		dispatch(getMyDivisionTagsAction());
	}, [dispatch]);

	if (isLoadingTags) {
		return <Preloader />;
	}

	return (
		<div className={styles.tags}>
			<p className={styles.subtitle}>
				Выбирайте хэштеги для вашего подразделения
			</p>
			<ul className={styles.list}>
				{divisionsTags.map((tag) => (
					<li className={styles.item} key={tag.id}>
						<span
							className={styles.remove}
							onClick={() => openRemoveTagModal(tag)}></span>
						#{tag.name}
					</li>
				))}
			</ul>
			<Button
				text='Добавить'
				color='blue'
				withIcon={{ type: 'add', position: 'right', color: 'white' }}
				onClick={() => dispatch(openCreateDivisionTagModal())}
			/>
			{isOpenCreateDivisionTagModal && (
				<Modal
					isOpen={isOpenCreateDivisionTagModal}
					onClose={() => dispatch(closeModals())}
					title='Создание нового тега'>
					<CreateDivisionTagForm />
				</Modal>
			)}
			{isOpenRemoveDivisionTagModal && currentTag && (
				<ConfirmDelete
					isOpen={isOpenRemoveDivisionTagModal}
					onClose={() => dispatch(closeModals())}
					id={currentTag.id}
					onSubmit={handleRemoveTag}
				/>
			)}
		</div>
	);
};
