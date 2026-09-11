import type { FC } from 'react';
import type { ITag } from '../../../store/catalog/types';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Section } from '../../../shared/components/Section';
import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Text } from '../../../shared/components/Typography';
import { Filter } from '../../../shared/components/Filter/ui/filter';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { TagList } from '../../../shared/components/Tag/ui/tag-list';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { Countdown } from '../../../shared/components/Countdown/ui/countdown';
import { ShowCaseDetailModal } from './showcase-detail-modal';

import {
	getStudentShowcaseAction,
	getMyGroupAction,
	chooseProjectAction,
} from '../../../store/student/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/showcase.module.scss';

export const Showcase: FC = () => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { showcase, group, isLoadingGroup, isLoadingShowcase } = useSelector(
		(state) => state.student
	);

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

	const [joiningProjectId, setJoiningProjectId] = useState<number | null>(null);
	const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
	const [isShowProjectDetail, setIsShowProjectDetail] = useState(false);

	useEffect(() => {
		dispatch(getStudentShowcaseAction());
		dispatch(getMyGroupAction());
	}, [dispatch]);

	const projects = useMemo(
		() => showcase.flatMap((track) => track.projects),
		[showcase]
	);

	const tags = useMemo(() => {
		const map = new Map<number, ITag>();

		projects.forEach((project) => {
			project.tags.forEach((tag) => {
				map.set(tag.id, tag);
			});
		});

		return Array.from(map.values());
	}, [projects]);

	const filteredProjects = useMemo(() => {
		let result = projects;

		if (selectedTags.length > 0) {
			const selectedTagIds = new Set(selectedTags.map((tag) => tag.id));

			result = result.filter((project) =>
				project.tags.some((tag) => selectedTagIds.has(tag.id))
			);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.trim().toLowerCase();

			result = result.filter((project) =>
				project.title.toLowerCase().includes(query)
			);
		}

		return result;
	}, [projects, selectedTags, searchQuery]);

	const registration = group?.registration;
	const myTeam = group?.my_team ?? null;

	const registrationDate = registration?.opens_at
		? new Date(registration.opens_at)
		: null;

	const isRegistrationScheduled =
		registrationDate !== null && registrationDate.getTime() > Date.now();

	const isRegistrationOpen =
		registration?.is_open === true &&
		!registration?.closed_by_decision &&
		!isRegistrationScheduled;

	const hasSelectedProject =
		myTeam?.has_project === true && myTeam.project !== null;

	const selectedProjectId = myTeam?.project?.id ?? null;

	const canRegister =
		isRegistrationOpen &&
		myTeam !== null &&
		myTeam.is_captain &&
		myTeam.status === 'assembled' &&
		!hasSelectedProject;

	const handleRemoveTag = (id: number) => {
		setSelectedTags((prev) => prev.filter((tag) => tag.id !== id));
	};

	const handleShowDetail = (projectId: number) => {
		setCurrentProjectId(projectId);
		setIsShowProjectDetail(true);
	};

	const handleCloseDetail = () => {
		setCurrentProjectId(null);
		setIsShowProjectDetail(false);
	};

	const handleJoin = async (projectId: number) => {
		if (!canRegister || joiningProjectId !== null) {
			return;
		}

		try {
			setJoiningProjectId(projectId);

			await dispatch(chooseProjectAction(projectId)).unwrap();

			showToast({
				title: 'Проект выбран',
				text: 'Проект успешно выбран для вашей команды.',
				type: 'success',
			});
		} catch (error) {
			showToast({
				title: 'Не удалось выбрать проект',
				text: getErrorMessage(error),
				type: 'error',
			});
		} finally {
			await dispatch(getMyGroupAction());
			await dispatch(getStudentShowcaseAction());

			setJoiningProjectId(null);
		}
	};

	const getJoinButtonText = (isFull: boolean, isSelectedProject: boolean) => {
		if (isSelectedProject) {
			return 'Выбранный проект';
		}

		if (hasSelectedProject) {
			return 'Проект уже выбран';
		}

		if (isFull) {
			return 'Места закончились';
		}

		if (registration?.closed_by_decision) {
			return 'Регистрация закрыта';
		}

		if (!registration?.is_open || isRegistrationScheduled) {
			return 'Регистрация закрыта';
		}

		if (!myTeam) {
			return 'Нет команды';
		}

		if (myTeam.status !== 'assembled') {
			return 'Состав не подтверждён';
		}

		if (!myTeam.is_captain) {
			return 'Только для капитана';
		}

		return 'Записаться';
	};

	const handleRegistrationStart = () => {
		window.setTimeout(() => {
			dispatch(getMyGroupAction());
		}, 2000);
	};

	if (isLoadingShowcase || isLoadingGroup) {
		return <Preloader />;
	}

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Витрина проектов' }}
			sectionDescription='Выберите проект, над которым хотите поработать с командой'>
			<div className={styles.container}>
				<div className={styles.toolbar}>
					<div className={styles.filters}>
						<div className={styles.filters__row}>
							<div className={styles.search}>
								<Filter
									placeholder='Поиск по названию проекта...'
									onFilter={setSearchQuery}
									width='full'
								/>
							</div>

							<div className={styles.tagsFilter}>
								<MultiSelect
									options={tags}
									selectedOptions={selectedTags}
									valueKey='id'
									labelKey='name'
									placeholder='Выберите теги...'
									onChange={setSelectedTags}
								/>
							</div>
						</div>

						<TagList
							items={selectedTags}
							emptyText=''
							onRemove={handleRemoveTag}
						/>
					</div>

					<div className={styles.registration}>
						{hasSelectedProject ? (
							<Notice
								type='success'
								title='Проект выбран'
								text={`Ваша команда выбрала проект «${myTeam.project?.title}».`}
							/>
						) : registration?.closed_by_decision ? (
							<Notice
								type='warning'
								title='Регистрация закрыта'
								text='Регистрация на проекты закрыта решением организаторов. За дополнительной информацией обратитесь к вашему наставнику.'
							/>
						) : isRegistrationScheduled && registrationDate ? (
							<Countdown
								targetDate={registrationDate}
								label='До начала регистрации'
								onComplete={handleRegistrationStart}
							/>
						) : isRegistrationOpen ? (
							<Notice
								type='info'
								title='Регистрация на проекты открыта'
								text={
									canRegister
										? 'Капитан команды может выбрать проект для своей команды.'
										: 'Вы можете просматривать проекты. Записаться на проект может только капитан команды с подтверждённым составом.'
								}
							/>
						) : (
							<Notice
								type='warning'
								title='Регистрация закрыта'
								text='Регистрация на проекты пока недоступна.'
							/>
						)}
					</div>
				</div>

				<div className={styles.list}>
					{filteredProjects.length > 0 ? (
						<div className={styles.projects}>
							{filteredProjects.map((project) => {
								const isSelectedProject = project.id === selectedProjectId;
								const isFull = project.enrolledTeamsCount >= project.maxTeams;

								const isJoinDisabled =
									isSelectedProject ||
									hasSelectedProject ||
									isFull ||
									!canRegister;

								return (
									<article className={styles.card} key={project.id}>
										<div className={styles.card__header}>
											<div className={styles.tags}>
												{project.tags.map((tag) => (
													<Badge key={tag.id} text={tag.name} color='blue' />
												))}

												{project.isCompetitiveSelection && (
													<Badge text='Конкурсный отбор' color='yellow' />
												)}

												{project.isContinuing && (
													<Badge text='Пролонгация' color='yellow' />
												)}

												{isSelectedProject && (
													<Badge text='Выбран' color='green' />
												)}
											</div>
										</div>

										<div className={styles.card__main}>
											<h3 className={styles.card__title}>{project.title}</h3>

											<p className={styles.card__company}>{project.company}</p>

											<div className={styles.card__info}>
												<div className={styles.card__infoItem}>
													<span className={styles.card__infoLabel}>
														Команд зарегистрировано
													</span>

													<strong className={styles.card__infoValue}>
														{project.enrolledTeamsCount} / {project.maxTeams}
													</strong>
												</div>

												<div className={styles.card__infoItem}>
													<span className={styles.card__infoLabel}>
														Рекомендуемый состав
													</span>

													<strong className={styles.card__infoValue}>
														{project.minTeamMembers}–{project.maxTeamMembers}{' '}
														участников
													</strong>
												</div>
											</div>
										</div>

										<div className={styles.card__footer}>
											<Button
												type='button'
												text='Подробнее'
												color='cancel'
												onClick={() => handleShowDetail(project.id)}
											/>

											<Button
												type='button'
												text={
													joiningProjectId === project.id
														? 'Записываем...'
														: getJoinButtonText(isFull, isSelectedProject)
												}
												color='green'
												isBlock={isJoinDisabled || joiningProjectId !== null}
												onClick={() => handleJoin(project.id)}
											/>
										</div>
									</article>
								);
							})}
						</div>
					) : (
						<Text text='Проекты не найдены' color='grey' />
					)}
				</div>
			</div>

			{isShowProjectDetail && (
				<ShowCaseDetailModal
					id={currentProjectId}
					isOpen={isShowProjectDetail}
					onClose={handleCloseDetail}
				/>
			)}
		</Section>
	);
};
