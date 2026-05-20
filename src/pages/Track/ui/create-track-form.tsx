import type { FC, FormEvent } from 'react';
import type { ITag } from '../../../store/catalog/types';
import type { IDirection, ICourse, IGroup } from '../lib/lib';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { TagList } from '../../../shared/components/Tag/ui/tag-list';
import { Form } from '../../../shared/components/Form/ui/form';
import { FormField } from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Select } from '../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';

import { directions, courses, groups } from '../lib/lib';
import { getTagsAction } from '../../../store/catalog/actions';

import styles from '../styles/track.module.scss';

export const CreateTrackForm: FC = () => {
	const dispatch = useDispatch();
	const { tags, isLoadingCatalog } = useSelector((state) => state.catalog);
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

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
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

	const handleAddGroup = () => {
		let newGroups: IGroup[] = [];

		if (currentGroup) {
			newGroups = [currentGroup];
			setCurrentGroup(null);
		} else if (currentCourse) {
			newGroups = groups.filter((g) => g.courseId === currentCourse.id);
			setCurrentCourse(null);
		} else if (currentDirection) {
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
				<Card></Card>
				<div className={styles.column}>
					<Card
						title='Фильтр проектов'
						subtitle='Отфильтруйте проекты по хэштегам'></Card>
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
								text='Просмотр'
								color='default'
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
