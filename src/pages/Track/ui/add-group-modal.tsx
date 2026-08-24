import type { FC, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useSelector } from '../../../store/store';

import type { ITrack } from '../../../store/track/types';
import type { IGroup } from '../../../store/catalog/types';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Button } from '../../../shared/components/Button/ui/button';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormButtons,
} from '../../../shared/components/Form/components';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Text } from '../../../shared/components/Typography';

interface IAddGroupModalProps {
	isOpen: boolean;
	track: ITrack | null;
	onClose: () => void;
	onSubmit: (groupIds: number[]) => void;
}

export const AddGroupModal: FC<IAddGroupModalProps> = ({
	isOpen,
	track,
	onClose,
	onSubmit,
}) => {
	const { groups } = useSelector((state) => state.catalog);
	const { isLoadingAction } = useSelector((state) => state.track);

	const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);

	useEffect(() => {
		if (!isOpen) {
			setSelectedGroup(null);
		}
	}, [isOpen]);

	const availableGroups = useMemo(() => {
		const addedGroupIds = new Set(track?.groups.map((group) => group.id) ?? []);

		return groups.filter((group) => !addedGroupIds.has(group.id));
	}, [groups, track]);

	const handleChooseGroup = (group: IGroup | null) => {
		setSelectedGroup(group);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedGroup) {
			return;
		}

		onSubmit([selectedGroup.id]);
	};

	const handleClose = () => {
		setSelectedGroup(null);
		onClose();
	};

	const isSubmitBlocked = !selectedGroup;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Добавление группы'
			description='Выберите группу, которую необходимо добавить в проектный трек'>
			<Form
				name='add-group-modal-form'
				onSubmit={handleSubmit}
				formWidth='full'>
				{availableGroups.length > 0 ? (
					<FormField title='Учебная группа*'>
						<SelectWithSearch<IGroup>
							options={availableGroups}
							currentOption={selectedGroup}
							onChooseOption={handleChooseGroup}
							placeholder='Выберите группу'
						/>
					</FormField>
				) : (
					<Text text='Все доступные группы уже добавлены в этот трек' />
				)}

				<FormButtons withMargin>
					<Button
						text='Отмена'
						type='button'
						color='cancel'
						onClick={handleClose}
					/>

					<Button
						text='Добавить'
						type='submit'
						color='blue'
						isBlock={isSubmitBlocked || isLoadingAction}
					/>
				</FormButtons>
			</Form>
		</Modal>
	);
};
