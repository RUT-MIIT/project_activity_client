import type { FC, FormEvent } from 'react';
import type { ITag } from '../../../store/catalog/types';
import type { IDirection, ICourse, IGroup } from '../lib/lib';

import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { TagList } from '../../../shared/components/Tag/ui/tag-list';
import { Form } from '../../../shared/components/Form/ui/form';
import { FormField } from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Select } from '../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { ViewSwitcher } from '../../../shared/components/ViewSwitcher/ui/view-switcher';
import { Filter } from '../../../shared/components/Filter/ui/filter';
import { Text } from '../../../shared/components/Typography';
import { ProjectCard } from '../../Project/components/ProjectCard/project-card';

import { getTagsAction } from '../../../store/catalog/actions';
import { directions, courses, groups, projects } from '../lib/lib';

import styles from '../styles/track.module.scss';

export const CreateTrackForm: FC = () => {
	const dispatch = useDispatch();
	const { isLoadingCatalog } = useSelector((state) => state.catalog);
	const [currentDirection, setCurrentDirection] = useState<IDirection | null>(
		null
	);
	const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);
	const [currentGroup, setCurrentGroup] = useState<IGroup | null>(null);
	const [isBlockAddGroupButton, setIsBlockAddGroupButton] =
		useState<boolean>(true);
	const [filteredGroups, setFilteredGroups] = useState<IGroup[]>(groups);
	const [selectedGroups, setSelectedGroups] = useState<IGroup[]>([]);
	const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
	const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

	const [activeView, setActiveView] = useState<string>(() => {
		const view = localStorage.getItem('createTrackView');
		return view ?? 'cards';
	});
	const [searchQuery, setSearchQuery] = useState('');

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleChangeTags = (selected: ITag[]) => {
		setSelectedTags(selected);
	};
	const handleRemoveTag = (id: number) => {
		setSelectedTags((prev) => prev.filter((tag) => tag.id !== id));
	};

	const handleChangeDirection = (opt: IDirection | null) => {
		setCurrentDirection(opt);
		setCurrentGroup(null);
	};

	const handleChangeCourse = (opt: ICourse | null) => {
		setCurrentCourse(opt);
		setCurrentGroup(null);
	};

	const handleChangeGroup = (opt: IGroup | null) => {
		setCurrentGroup(opt);
	};

	const handleClearFilters = () => {
		setCurrentDirection(null);
		setCurrentCourse(null);
		setCurrentGroup(null);
	};

	const handleClearGroups = () => {
		setSelectedGroups([]);
	};

	const handleShowDetail = (id: number) => {
		console.log(id);
	};

	const handleSelectProject = (id: number) => {
		setSelectedProjectIds((prev) =>
			prev.includes(id)
				? prev.filter((projectId) => projectId !== id)
				: [...prev, id]
		);
	};

	const handleAddGroup = () => {
		let newGroups: IGroup[] = [];

		// Если выбрана конкретная группа
		if (currentGroup) {
			newGroups = [currentGroup];
			setCurrentGroup(null);
		}

		// Если выбраны и направление, и курс
		else if (currentDirection && currentCourse) {
			newGroups = groups.filter(
				(g) =>
					g.directionId === currentDirection.id &&
					g.courseId === currentCourse.id
			);

			setCurrentCourse(null);
		}

		// Если выбран только курс
		else if (currentCourse) {
			newGroups = groups.filter((g) => g.courseId === currentCourse.id);

			setCurrentCourse(null);
		}

		// Если выбрано только направление
		else if (currentDirection) {
			newGroups = groups.filter((g) => g.directionId === currentDirection.id);

			setCurrentDirection(null);
		}

		setSelectedGroups((prev) => {
			const existingIds = new Set(prev.map((g) => g.id));

			return [...prev, ...newGroups.filter((g) => !existingIds.has(g.id))];
		});
	};

	const handleRemoveGroup = (id: number) => {
		setSelectedGroups((prev) => prev.filter((group) => group.id !== id));
	};

	useEffect(() => {
		if (!currentDirection && !currentCourse && !currentGroup) {
			setIsBlockAddGroupButton(true);
		} else {
			setIsBlockAddGroupButton(false);
		}
	}, [currentDirection, currentCourse, currentGroup]);

	const tags: ITag[] = Array.from(
		new Map(projects.map((project) => [project.tag.id, project.tag])).values()
	);

	useEffect(() => {
		let result = groups;

		// 1. Убираем уже выбранные группы
		const selectedIds = new Set(selectedGroups.map((g) => g.id));
		result = result.filter((g) => !selectedIds.has(g.id));

		// 2. Фильтр по направлению
		if (currentDirection) {
			result = result.filter((g) => g.directionId === currentDirection.id);
		}

		// 3. Фильтр по курсу
		if (currentCourse) {
			result = result.filter((g) => g.courseId === currentCourse.id);
		}

		setFilteredGroups(result);
	}, [selectedGroups, currentDirection, currentCourse]);

	const filteredProjects = useMemo(() => {
		let result = projects;

		if (selectedTags.length > 0) {
			const selectedTagIds = new Set(selectedTags.map((tag) => tag.id));

			result = result.filter((project) => selectedTagIds.has(project.tag.id));
		}

		if (searchQuery.trim() !== '') {
			result = result.filter((project) =>
				project.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		return result;
	}, [selectedTags, searchQuery]);

	useEffect(() => {
		dispatch(getTagsAction());
	}, [dispatch]);

	if (isLoadingCatalog) return <Preloader />;

	return (
		<Form
			name='form-create-track'
			onSubmit={handleSubmit}
			formWidth='full'
			withHeightStretch>
			<div className={styles.container}>
				<div className={styles.column}>
					<div className={styles.header}>
						<Filter
							placeholder='Поиск по названию проекта...'
							onFilter={setSearchQuery}
						/>
						<MultiSelect
							options={tags}
							selectedOptions={selectedTags}
							valueKey='id'
							labelKey='name'
							placeholder='Выберите хэштег..'
							onChange={handleChangeTags}
						/>
						<ViewSwitcher
							defaultView={activeView}
							storageKey='createTrackView'
							onChange={(view) => setActiveView(view)}
						/>
					</div>
					<TagList
						items={selectedTags}
						emptyText=''
						onRemove={handleRemoveTag}
					/>
					{filteredProjects.length > 0 ? (
						activeView === 'cards' ? (
							<ul className={styles.cards}>
								{filteredProjects.map((elem) => (
									<ProjectCard
										card={elem}
										key={elem.id}
										onShowDetail={handleShowDetail}
										onSelect={handleSelectProject}
										isSelect={selectedProjectIds.includes(elem.id)}
									/>
								))}
							</ul>
						) : (
							<div></div>
						)
					) : (
						<Text text='Проекты не найдены.' color='grey' withMarginTop />
					)}
				</div>

				<div className={styles.column}>
					<Card
						title='Добавление групп'
						subtitle='Определите, каким группам назначить выбранные проекты'>
						<FormField title='Направление подготовки'>
							<SelectWithSearch
								placeholder='Выберите направление..'
								currentOption={currentDirection}
								options={directions}
								onChooseOption={(opt) => handleChangeDirection(opt)}
							/>
						</FormField>
						<FormField title='Курс'>
							<Select
								placeholder='Выберите курс..'
								currentOption={currentCourse}
								options={courses}
								onChooseOption={(opt) => handleChangeCourse(opt)}
							/>
						</FormField>
						<FormField title='Группа'>
							<SelectWithSearch
								placeholder='Выберите группу..'
								currentOption={currentGroup}
								options={filteredGroups}
								onChooseOption={(opt) => handleChangeGroup(opt)}
							/>
						</FormField>
						<CardControl>
							<Button
								text='Очистить'
								color='red'
								style={{ margin: '0 auto 0 0' }}
								onClick={handleClearFilters}
								isBlock={isBlockAddGroupButton}
							/>
							<Button
								text='Добавить'
								color='blue'
								onClick={handleAddGroup}
								isBlock={isBlockAddGroupButton}
							/>
						</CardControl>
					</Card>
					<Card
						title='Выбранные группы'
						subtitle='Создание трека для выбранных групп'>
						<TagList
							items={selectedGroups}
							emptyText='Группы пока не выбраны'
							onRemove={handleRemoveGroup}
						/>
						<CardControl>
							<Button
								text='Очистить'
								color='red'
								style={{ margin: '0 auto 0 0' }}
								onClick={handleClearGroups}
								isBlock={selectedGroups.length < 1}
							/>
							<Button
								key='submit'
								type='submit'
								text='Создать трек'
								color='blue'
								isBlock={selectedGroups.length < 1}
							/>
						</CardControl>
					</Card>
				</div>
			</div>
		</Form>
	);
};
