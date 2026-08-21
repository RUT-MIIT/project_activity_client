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
import { Tooltip } from '../../../shared/components/Tooltip/ui/tooltip';
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
	const { trackList, isLoading } = useSelector((state) => state.track);
	const [projectTeams, setProjectTeams] = useState<
		Record<number, number | null>
	>({});
	const [teamSizeRange, setTeamSizeRange] = useState({
		min: 4,
		max: 7,
	});
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

	const totalStudents = groups.reduce(
		(sum, group) => sum + (group.students_count ?? 0),
		0
	);

	const averageTeamSize = (teamSizeRange.min + teamSizeRange.max) / 2;

	const totalTeamCapacity = maxTeams * averageTeamSize;

	const choiceIndex = totalStudents > 0 ? totalTeamCapacity / totalStudents : 0;

	const getChoiceIndexStatus = (value: number) => {
		if (value < 1.1) {
			return {
				level: 'red' as const,
				title: 'Недостаточный выбор',
				text: 'Доступных мест в командах недостаточно. Часть студентов может не получить возможность выбрать подходящий проект. Рекомендуется увеличить количество проектов.',
			};
		}

		if (value < 1.4) {
			return {
				level: 'yellow' as const,
				title: 'Небольшой выбор',
				text: 'У студентов есть выбор проектов, но количество доступных мест ограничено. Можно рассмотреть небольшое увеличение количества проектов.',
			};
		}

		if (value <= 1.8) {
			return {
				level: 'green' as const,
				title: 'Хороший выбор',
				text: 'Оптимальное соотношение количества мест и студентов. У студентов есть хороший выбор проектов без существенного избытка.',
			};
		}

		if (value <= 2.2) {
			return {
				level: 'yellow' as const,
				title: 'Избыточный выбор',
				text: 'Доступных мест больше, чем необходимо для комфортного выбора. Некоторые проекты могут быть не выбраны.',
			};
		}

		return {
			level: 'red' as const,
			title: 'Слишком много мест',
			text: 'Количество доступных мест значительно превышает количество студентов. Это может привести к большому числу невыбранных проектов.',
		};
	};
	const choiceIndexStatus = getChoiceIndexStatus(choiceIndex);

	const hasInvalidProjectTeams = projects.some((project) => {
		const value = projectTeams[project.id];

		return value === null || value < 1 || value > 3;
	});

	const isSubmitBlocked =
		trackName.trim().length === 0 ||
		groups.length === 0 ||
		projects.length === 0 ||
		hasInvalidProjectTeams;

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

		if (!projectTeamsTouched[projectId]) {
			return {
				isShow: false,
				text: '',
			};
		}

		if (value === null) {
			return {
				isShow: true,
				text: 'Обязательное поле',
			};
		}

		if (value < 1) {
			return {
				isShow: true,
				text: 'Минимальное количество команд — 1',
			};
		}

		if (value > 3) {
			return {
				isShow: true,
				text: 'Максимальное количество команд — 3',
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

		if (Number.isNaN(value)) {
			return;
		}

		setProjectTeams((prev) => ({
			...prev,
			[projectId]: value,
		}));
	};

	const handleMinTeamSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		setTeamSizeRange((prev) => ({
			...prev,
			min: Math.min(value, prev.max),
		}));
	};

	const handleMaxTeamSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		setTeamSizeRange((prev) => ({
			...prev,
			max: Math.max(value, prev.min),
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
				minTeamMembers: teamSizeRange.min,
				maxTeamMembers: teamSizeRange.max,
			})),
		};

		onSubmit(data);
	};

	const handleClose = () => {
		setTrackName('');
		setProjectTeams({});
		setProjectTeamsTouched({});
		setTeamSizeRange({
			min: 4,
			max: 7,
		});
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

				<div className={styles.field__row}>
					<FormField
						title='Максимальное количество команд в треке'
						withInfo={true}
						infoText='Максимальное количество команд рассчитывается автоматически как сумма рекомендуемого количества команд для всех проектов, добавленных в трек.'>
						<FormInputStub value={maxTeams.toString()} />
					</FormField>

					<FormField
						title='Количество студентов в треке'
						withInfo
						infoText='Общее количество студентов рассчитывается автоматически как сумма студентов во всех выбранных группах.'>
						<FormInputStub value={totalStudents.toString()} />
					</FormField>
				</div>

				<div className={styles.field__row}>
					<FormField
						title='Количество человек в команде'
						withInfo
						infoText='Укажите допустимый диапазон количества участников в одной команде. Можно выбрать от 3 до 10 человек.'>
						<div className={styles.teamSize}>
							<div className={styles.teamSize__slider}>
								<div
									className={styles.teamSize__range}
									style={{
										left: `${((teamSizeRange.min - 3) / 7) * 100}%`,
										right: `${100 - ((teamSizeRange.max - 3) / 7) * 100}%`,
									}}
								/>

								<input
									type='range'
									min={3}
									max={10}
									step={1}
									value={teamSizeRange.min}
									onChange={handleMinTeamSizeChange}
									className={styles.teamSize__input}
								/>

								<input
									type='range'
									min={3}
									max={10}
									step={1}
									value={teamSizeRange.max}
									onChange={handleMaxTeamSizeChange}
									className={styles.teamSize__input}
								/>
							</div>

							<div className={styles.teamSize__labels}>
								<span>3</span>
								<span>4</span>
								<span>5</span>
								<span>6</span>
								<span>7</span>
								<span>8</span>
								<span>9</span>
								<span>10</span>
							</div>
						</div>
					</FormField>

					<FormField
						title='Индекс выбора проектов'
						withInfo
						infoText='Показатель соотношения доступных мест в командах и общего количества студентов. Чем выше значение, тем больше возможностей выбора проектов у студентов.'>
						<Tooltip
							placement='top'
							content={
								<div className={styles.choiceIndex__tooltip}>
									<div className={styles.choiceIndex__tooltipTitle}>
										{choiceIndexStatus.title}
									</div>

									<div className={styles.choiceIndex__tooltipText}>
										{choiceIndexStatus.text}
									</div>
								</div>
							}>
							<FormInputStub
								value={
									choiceIndex > 0
										? `${choiceIndex.toFixed(2)} — ${choiceIndexStatus.title}`
										: '—'
								}
								color={choiceIndex > 0 ? choiceIndexStatus.level : 'default'}
							/>
						</Tooltip>
					</FormField>
				</div>

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

													<span>
														<b>Студентов:</b> {group.students_count}
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
						isBlock={isSubmitBlocked || isLoading}
					/>
				</FormButtons>
			</Form>
		</Modal>
	);
};
