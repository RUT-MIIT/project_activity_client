import type { FC } from 'react';

import { useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';

import { Section } from '../../../shared/components/Section';
import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Text } from '../../../shared/components/Typography';
import { Filter } from '../../../shared/components/Filter/ui/filter';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { TagList } from '../../../shared/components/Tag/ui/tag-list';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { ShowCaseDetailModal } from './showcase-detail-modal';

import { getStudentShowcaseAction } from '../../../store/student/actions';

import type { ITag } from '../../../store/catalog/types';

import styles from '../styles/showcase.module.scss';

export const Showcase: FC = () => {
	const dispatch = useDispatch();

	const { showcase, isLoadingShowcase } = useSelector((state) => state.student);

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

	const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
	const [isShowProjectDetail, setIsShowProjectDetail] = useState(false);

	const isRegistrationDateUnknown = true;

	useEffect(() => {
		dispatch(getStudentShowcaseAction());
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

	const handleJoin = (projectId: number) => {
		console.log('Записаться:', projectId);
	};

	if (isLoadingShowcase) {
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
						<div className={styles.search}>
							<Filter
								placeholder='Поиск по названию проекта...'
								onFilter={setSearchQuery}
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

					<div
						className={`${styles.registration} ${
							isRegistrationDateUnknown ? styles.registration_empty : ''
						}`}>
						{isRegistrationDateUnknown ? (
							<Notice
								type='info'
								title='Регистрация закрыта'
								text='Время начала регистрации пока не определено.'
							/>
						) : (
							<div className={styles.registration__content}>
								<span className={styles.registration__label}>
									До начала регистрации
								</span>

								<div className={styles.registration__timer}>{/* таймер */}</div>
							</div>
						)}
					</div>
				</div>

				<TagList items={selectedTags} emptyText='' onRemove={handleRemoveTag} />

				<div className={styles.list}>
					{filteredProjects.length > 0 ? (
						<div className={styles.projects}>
							{filteredProjects.map((project) => {
								const isFull = project.enrolledTeamsCount >= project.maxTeams;

								return (
									<article className={styles.card} key={project.id}>
										<div className={styles.card__header}>
											<div className={styles.tags}>
												{project.tags.map((tag) => (
													<Badge key={tag.id} text={tag.name} color='blue' />
												))}
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
													isFull
														? 'Мест нет'
														: isRegistrationDateUnknown
														? 'Регистрация закрыта'
														: 'Записаться'
												}
												color='green'
												isBlock={isFull || isRegistrationDateUnknown}
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
