import type { FC, FormEvent, ChangeEvent } from 'react';
import type { IGroup } from '../../../store/catalog/types';
import type { IProject } from '../../../store/track/types';
import type { ICreateTrackData } from '../types/types';

import { useState, useEffect } from 'react';
import { useSelector } from '../../../store/store';

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
	FormInputStub,
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
	const { trackList } = useSelector((state) => state.track);
	const [projectTeams, setProjectTeams] = useState<
		Record<number, number | null>
	>({});
	const [trackName, setTrackName] = useState<string>('');
	const [trackNameError, setTrackNameError] = useState({
		isShow: false,
		text: '',
	});
	const [projectTeamsTouched, setProjectTeamsTouched] = useState<
		Record<number, boolean>
	>({});

	const maxTeams = projects.reduce(
		(sum, project) => sum + (projectTeams[project.id] ?? 0),
		0
	);

	const hasEmptyProjectTeams = projects.some(
		(project) => projectTeams[project.id] === null
	);

	const isSubmitBlocked =
		trackName.trim().length === 0 ||
		groups.length === 0 ||
		projects.length === 0 ||
		hasEmptyProjectTeams;

	const getGroupTrack = (groupId: number) => {
		return trackList.find((track) =>
			track.groups.some((group) => group.id === groupId)
		);
	};

	const getProjectTrack = (projectId: number) => {
		return trackList.find((track) =>
			track.applications.some((project) => project.id === projectId)
		);
	};

	const getProjectTeamsError = (projectId: number) => {
		const value = projectTeams[projectId];

		if (projectTeamsTouched[projectId] && value === null) {
			return {
				isShow: true,
				text: 'Обязательное поле',
			};
		}

		return {
			isShow: false,
			text: '',
		};
	};

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

	const handleChangeProjectTeams = (
		projectId: number,
		e: ChangeEvent<HTMLInputElement>
	) => {
		const rawValue = e.target.value;

		setProjectTeamsTouched((prev) => ({
			...prev,
			[projectId]: true,
		}));

		if (rawValue === '') {
			setProjectTeams((prev) => ({
				...prev,
				[projectId]: null,
			}));
			return;
		}

		const value = Number(rawValue);

		if (Number.isNaN(value) || value < 1) {
			return;
		}

		setProjectTeams((prev) => ({
			...prev,
			[projectId]: value,
		}));
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
			maxTeams,
			projects: projects.map((project) => ({
				id: project.id,
				teamsCount: projectTeams[project.id] ?? 0,
			})),
		};

		onSubmit(data);
	};

	const handleClose = () => {
		setTrackName('');
		setProjectTeams({});
		setProjectTeamsTouched({});
		setTrackNameError({
			isShow: false,
			text: '',
		});
		onClose();
	};

	useEffect(() => {
		setProjectTeams((prev) => {
			const next: Record<number, number | null> = {};

			projects.forEach((project) => {
				next[project.id] = prev[project.id] ?? project.recommended_teams_count;
			});

			return next;
		});
	}, [projects]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Cоздание трека'
			description='Проверьте выбранные группы и проекты перед созданием'
			modalWidth='full'>
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
					title='Максимальное количество команд в треке'
					withInfo={true}
					infoText='Максимальное количество команд рассчитывается автоматически как сумма рекомендуемого количества команд для всех проектов, добавленных в трек.'>
					<FormInputStub value={maxTeams.toString()} />
				</FormField>
				<div className={styles.columns}>
					<div className={styles.column}>
						<h3 className={styles.column__title}>Группы ({groups.length})</h3>

						{groups.length ? (
							<ul className={styles.list}>
								{groups.map((group) => {
									const existingTrack = getGroupTrack(group.id);
									return (
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
												{existingTrack && (
													<Badge
														text={`Группа в треке «${existingTrack.name}»`}
														color='yellow'
													/>
												)}
											</div>

											<button
												type='button'
												className={styles.item__remove}
												onClick={() => onRemoveGroup(group.id)}
												aria-label='Удалить группу'>
												✕
											</button>
										</li>
									);
								})}
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
								{projects.map((project) => {
									const existingTrack = getProjectTrack(project.id);
									return (
										<li key={project.id} className={styles.item}>
											<div className={styles.item__content}>
												<div className={styles.item__tags}>
													{project.tags.map((tag) => (
														<Badge key={tag.id} text={tag.name} />
													))}
												</div>
												<h4 className={styles.item__title}>{project.title}</h4>

												<div className={styles.item__info}>
													<span>
														<b>№ заявки:</b> {project.print_number}
													</span>

													<span>
														<b>Автор:</b> {project.author_name}
													</span>
												</div>

												{existingTrack && (
													<Badge
														text={`Проект уже добавлен в трек «${existingTrack.name}»`}
														color='yellow'
													/>
												)}

												<FormField
													title='Количество команд на проект*'
													fieldError={getProjectTeamsError(project.id)}>
													<FormInputNumber
														name={`project-teams-${project.id}`}
														placeholder='Введите количество команд'
														value={projectTeams[project.id] ?? null}
														onChange={(e) =>
															handleChangeProjectTeams(project.id, e)
														}
													/>
												</FormField>
											</div>

											<button
												type='button'
												className={styles.item__remove}
												onClick={() => onRemoveProject(project.id)}
												aria-label='Удалить проект'>
												✕
											</button>
										</li>
									);
								})}
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
