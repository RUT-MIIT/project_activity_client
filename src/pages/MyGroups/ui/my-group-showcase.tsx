import type { FC } from 'react';
import type { ITag } from '../../../store/catalog/types';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Text } from '../../../shared/components/Typography';
import { Filter } from '../../../shared/components/Filter/ui/filter';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { TagList } from '../../../shared/components/Tag/ui/tag-list';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { MyGroupShowcaseDetail } from './my-group-showcase-detail';

import { getMyGroupShowcaseAction } from '../../../store/mentor/actions';

import styles from '../styles/my-group-showcase.module.scss';

export const MyGroupShowcase: FC = () => {
	const dispatch = useDispatch();

	const { groupId } = useParams<{ groupId: string }>();

	const { showcase, isLoadingShowcase } = useSelector((state) => state.mentor);

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

	const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
	const [isShowProjectDetail, setIsShowProjectDetail] = useState(false);

	// Пока дата начала регистрации неизвестна.
	const isRegistrationDateUnknown = true;

	useEffect(() => {
		if (!groupId) {
			return;
		}

		dispatch(getMyGroupShowcaseAction(Number(groupId)));
	}, [dispatch, groupId]);

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

	if (isLoadingShowcase) {
		return <Preloader />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.toolbar}>
				<div className={styles.filters}>
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

							<div className={styles.registration__timer}>
								<div className={styles.registration__unit}>
									<strong>12</strong>
									<span>дней</span>
								</div>

								<span className={styles.registration__separator}>:</span>

								<div className={styles.registration__unit}>
									<strong>08</strong>
									<span>часов</span>
								</div>

								<span className={styles.registration__separator}>:</span>

								<div className={styles.registration__unit}>
									<strong>42</strong>
									<span>мин</span>
								</div>

								<span className={styles.registration__separator}>:</span>

								<div className={styles.registration__unit}>
									<strong>17</strong>
									<span>сек</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<TagList items={selectedTags} emptyText='' onRemove={handleRemoveTag} />

			<div className={styles.list}>
				{filteredProjects.length > 0 ? (
					<div className={styles.projects}>
						{filteredProjects.map((project) => (
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
								</div>
							</article>
						))}
					</div>
				) : (
					<div className={styles.empty}>
						<Text text='Проекты не найдены' color='grey' />
					</div>
				)}
			</div>
			{isShowProjectDetail && (
				<MyGroupShowcaseDetail
					id={currentProjectId}
					isOpen={isShowProjectDetail}
					onClose={handleCloseDetail}
				/>
			)}
		</div>
	);
};
