import type { FC, FormEvent } from 'react';

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import { useToast } from '../../../../../shared/components/ToastProvider/ui/ToastProvider';

import { Button } from '../../../../../shared/components/Button/ui/button';
import { Form } from '../../../../../shared/components/Form/ui/form';
import {
	FormField,
	FormButtons,
} from '../../../../../shared/components/Form/components';
import { SelectWithSearch } from '../../../../../shared/components/Select/ui/select-with-search';
import { Text } from '../../../../../shared/components/Typography';

import {
	assignGroupMentorAction,
	removeGroupMentorAction,
} from '../../../../../store/controlGroup/actions';

import { getErrorMessage } from '../../../../../shared/lib/getErrorMessage';

import styles from '../styles/edit-group-mentors-form.module.scss';

interface IEditGroupMentorsFormProps {
	groupId: number;
}

export const EditGroupMentorsForm: FC<IEditGroupMentorsFormProps> = ({
	groupId,
}) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const {
		groupMentors,
		employees,
		isLoadingEmployees,
		isLoadingMentorRequest,
	} = useSelector((state) => state.controlGroup);

	const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);

	const group = useMemo(
		() => groupMentors.find((item) => item.id === groupId) ?? null,
		[groupMentors, groupId]
	);

	const assignedMentors = useMemo(() => {
		if (!group) {
			return [];
		}

		return group.mentorIds
			.map((mentorId) => employees.find((employee) => employee.id === mentorId))
			.filter(Boolean);
	}, [group, employees]);

	const mentorOptions = useMemo(() => {
		if (!group) {
			return employees;
		}

		return employees.filter(
			(employee) => !group.mentorIds.includes(employee.id)
		);
	}, [employees, group]);

	const selectedMentor = useMemo(
		() =>
			mentorOptions.find((mentor) => mentor.id === selectedMentorId) ?? null,
		[mentorOptions, selectedMentorId]
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!group || selectedMentorId === null) {
			return;
		}

		try {
			await dispatch(
				assignGroupMentorAction({
					groupId: group.id,
					mentorId: selectedMentorId,
				})
			).unwrap();

			setSelectedMentorId(null);

			showToast({
				title: 'Наставник назначен',
				text: 'Наставник успешно назначен на учебную группу.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось назначить наставника',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleRemove = async (mentorId: number) => {
		if (!group) {
			return;
		}

		try {
			await dispatch(
				removeGroupMentorAction({
					groupId: group.id,
					mentorId,
				})
			).unwrap();

			showToast({
				title: 'Наставник снят',
				text: 'Наставник успешно снят с учебной группы.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось снять наставника',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	if (!group) {
		return null;
	}

	return (
		<div className={styles.form}>
			<Form
				name='group-mentors-edit-form'
				onSubmit={handleSubmit}
				formWidth='full'>
				<FormField title='Наставник*'>
					<SelectWithSearch
						options={mentorOptions}
						currentOption={selectedMentor}
						onChooseOption={(option) => {
							setSelectedMentorId(option?.id ?? null);
						}}
						placeholder={
							isLoadingEmployees
								? 'Загрузка наставников...'
								: 'Выберите наставника'
						}
						valueKey='id'
						labelKey='fullName'
						withClear={false}
					/>
				</FormField>

				<FormButtons>
					<Button
						text='Добавить наставника'
						type='submit'
						color='blue'
						isBlock={selectedMentorId === null || isLoadingMentorRequest}
					/>
				</FormButtons>
			</Form>

			<div className={styles.mentors}>
				<h4 className={styles.title}>Назначенные наставники</h4>

				{assignedMentors.length === 0 ? (
					<Text text='Наставники не назначены' color='grey' />
				) : (
					<div className={styles.list}>
						{assignedMentors.map((mentor, index) => {
							if (!mentor) {
								return null;
							}

							return (
								<div className={styles.item} key={mentor.id}>
									<span className={styles.count}>{index + 1}.</span>

									<div className={styles.info}>
										<p className={styles.name}>{mentor.fullName}</p>
									</div>

									<div className={styles.action}>
										<button
											className={styles.remove}
											type='button'
											onClick={() => handleRemove(mentor.id)}
											disabled={isLoadingMentorRequest}
											aria-label='Удалить наставника'
											title='Удалить наставника'>
											×
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
