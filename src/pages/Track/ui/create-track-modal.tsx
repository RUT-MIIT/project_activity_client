import type { FC, FormEvent, ChangeEvent } from 'react';
import type { IGroup } from '../../../store/catalog/types';
import type { IProject } from '../../../store/track/types';
import type { ICreateTrackData } from '../types/types';

import { useState } from 'react';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Button } from '../../../shared/components/Button/ui/button';
import { Text } from '../../../shared/components/Typography';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormInputNumber,
	FormButtons,
} from '../../../shared/components/Form/components';

import styles from '../styles/create-track-modal.module.scss';

interface ICreateTrackModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ICreateTrackData) => void;

	groups: IGroup[];
	projects: IProject[];

	onRemoveGroup: (id: number) => void;
	onRemoveProject: (id: number) => void;
}

export const CreateTrackModal: FC<ICreateTrackModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	groups,
	projects,
	onRemoveGroup,
	onRemoveProject,
}) => {
	const [trackName, setTrackName] = useState<string>('');
	const [trackNameError, setTrackNameError] = useState({
		isShow: false,
		text: '',
	});
	const [maxTeams, setMaxTeams] = useState<number | null>(null);

	const isSubmitBlocked =
		trackName.trim().length === 0 ||
		groups.length === 0 ||
		projects.length === 0;

	const handleChangeTrackName = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setTrackName(value);

		if (value.trim().length === 0) {
			setTrackNameError({
				isShow: true,
				text: 'Поле не может быть пустым',
			});
			return;
		}

		setTrackNameError({
			isShow: false,
			text: '',
		});
	};

	const handleChangeMaxTeams = (e: ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;

		if (rawValue === '') {
			setMaxTeams(null);
			return;
		}

		const value = Number(rawValue);

		if (Number.isNaN(value) || value < 1) {
			setMaxTeams(null);
			return;
		}

		setMaxTeams(value);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (trackName.trim().length === 0) {
			setTrackNameError({
				isShow: true,
				text: 'Введите название трека',
			});
			return;
		}

		const data: ICreateTrackData = {
			name: trackName.trim(),
			...(maxTeams !== null && {
				maxTeams,
			}),
		};

		onSubmit(data);
	};

	const handleClose = () => {
		setTrackName('');
		setMaxTeams(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Cоздания трека'
			description='Проверьте выбранные группы и проекты перед созданием'
			modalWidth='large'>
			<Form
				name='create-track-modal-form'
				onSubmit={handleSubmit}
				formWidth='full'>
				<FormField title='Название трека*' fieldError={trackNameError}>
					<FormInput
						name='track-name'
						placeholder='Введите название трека'
						value={trackName}
						onChange={handleChangeTrackName}
					/>
				</FormField>
				<FormField
					title='Максимальное количество команд'
					withInfo={true}
					infoText='Максимальное количество команд которое может записаться на данный трек. Если оставить поле пустым количество команд будет 100.'>
					<FormInputNumber
						name='max-teams'
						type='number'
						placeholder='Введите максимальное количество команд'
						value={maxTeams ?? null}
						onChange={handleChangeMaxTeams}
					/>
				</FormField>
				<div className={styles.columns}>
					<div className={styles.column}>
						<h3 className={styles.column__title}>Группы ({groups.length})</h3>

						{groups.length ? (
							<ul className={styles.list}>
								{groups.map((group) => (
									<li key={group.id} className={styles.item}>
										<div className={styles.item__content}>
											<h4 className={styles.item__title}>{group.name}</h4>

											<div className={styles.item__info}>
												<span>
													<b>Направление:</b> {group.direction_code}
												</span>

												<span>
													<b>Курс:</b> {group.course_number}
												</span>
											</div>
										</div>

										<button
											type='button'
											className={styles.item__remove}
											onClick={() => onRemoveGroup(group.id)}
											aria-label='Удалить группу'>
											✕
										</button>
									</li>
								))}
							</ul>
						) : (
							<Text text='Группы не выбраны' color='grey' />
						)}
					</div>

					<div className={styles.column}>
						<h3 className={styles.column__title}>
							Проекты ({projects.length})
						</h3>

						{projects.length ? (
							<ul className={styles.list}>
								{projects.map((project) => (
									<li key={project.id} className={styles.item}>
										<div className={styles.item__content}>
											<h4 className={styles.item__title}>{project.title}</h4>

											<div className={styles.item__info}>
												<span>
													<b>№ заявки:</b> {project.print_number}
												</span>

												<span>
													<b>Автор:</b> {project.author_name}
												</span>
											</div>
											<div className={styles.item__tags}>
												{project.tags.map((tag) => (
													<Badge key={tag.id} text={tag.name} />
												))}
											</div>
										</div>

										<button
											type='button'
											className={styles.item__remove}
											onClick={() => onRemoveProject(project.id)}
											aria-label='Удалить проект'>
											✕
										</button>
									</li>
								))}
							</ul>
						) : (
							<Text text='Проекты не выбраны' color='grey' />
						)}
					</div>
				</div>

				<FormButtons>
					<Button
						style={{ margin: '0 0 0 auto' }}
						text='Назад'
						type='button'
						color='cancel'
						onClick={handleClose}
					/>
					<Button
						text='Сохранить'
						type='submit'
						color='blue'
						isBlock={isSubmitBlocked}
					/>
				</FormButtons>
			</Form>
		</Modal>
	);
};
