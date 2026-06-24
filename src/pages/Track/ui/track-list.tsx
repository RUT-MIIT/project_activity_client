import type { FC } from 'react';
import type { ITrackGroup } from '../../../store/track/types';
import type { IDirection, ICourse } from '../../../store/catalog/types';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Select } from '../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Button } from '../../../shared/components/Button/ui/button';
import { FormField } from '../../../shared/components/Form/components';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { TrackDetailModal } from './track-detail-modal';
import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../shared/components/Table/ui';

import {
	getDirectionsAction,
	getGroupsAction,
} from '../../../store/catalog/actions';
import { getTrackGroupsAction } from '../../../store/track/actions';

import styles from '../styles/track.module.scss';

export const TrackList: FC = () => {
	const dispatch = useDispatch();
	const { directions, courses, isLoadingCatalog } = useSelector(
		(state) => state.catalog
	);
	const { trackGroups, isLoadingTrackGroups } = useSelector(
		(state) => state.track
	);

	const [currentDirection, setCurrentDirection] = useState<IDirection | null>(
		null
	);
	const [currentCourse, setCurrentCourse] = useState<ICourse | null>(null);
	const [currentGroup, setCurrentGroup] = useState<ITrackGroup | null>(null);
	const [filteredGroups, setFilteredGroups] =
		useState<ITrackGroup[]>(trackGroups);
	const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
	const [isShowTrackDetail, setIsShowTrackDetail] = useState<boolean>(false);

	const handleChangeDirection = (opt: IDirection | null) => {
		setCurrentDirection(opt);
		setCurrentGroup(null);
	};

	const handleChangeCourse = (opt: ICourse | null) => {
		setCurrentCourse(opt);
		setCurrentGroup(null);
	};

	const handleChangeGroup = (opt: ITrackGroup | null) => {
		setCurrentGroup(opt);
	};

	const handleClearFilters = () => {
		setCurrentDirection(null);
		setCurrentCourse(null);
		setCurrentGroup(null);
	};

	const handleShowDetail = (id: number) => {
		console.log('work');
		setCurrentGroupId(id);
		setIsShowTrackDetail(true);
	};

	const handleCloseDetail = () => {
		setCurrentGroupId(null);
		setIsShowTrackDetail(false);
	};

	useEffect(() => {
		let result = trackGroups;

		// 1. Фильтр по направлению
		if (currentDirection) {
			result = result.filter((g) => g.direction.code === currentDirection.code);
		}

		// 2. Фильтр по курсу
		if (currentCourse) {
			result = result.filter((g) => g.course_number === currentCourse.id);
		}

		// 3. Фильтр по группе
		if (currentGroup) {
			result = result.filter((g) => g.id === currentGroup.id);
		}

		setFilteredGroups(result);
	}, [trackGroups, currentDirection, currentCourse, currentGroup]);

	useEffect(() => {
		dispatch(getDirectionsAction());
		dispatch(getGroupsAction());
		dispatch(getTrackGroupsAction());
	}, [dispatch]);

	if (isLoadingCatalog || isLoadingTrackGroups) return <Preloader />;

	return (
		<>
			<div className={styles.norms}>
				<div className={`${styles.card} ${styles.card_color_blue}`}>
					<h5 className={styles.card__title}>Распределено проектов</h5>
					<span className={styles.card__count}>66,5%</span>
					<p className={styles.card__text}>
						Число уникальных проектов на витринах групп
					</p>
				</div>
				<div className={`${styles.card} ${styles.card_color_blue}`}>
					<h5 className={styles.card__title}>
						Среднее количество проектов на витринах
					</h5>
					<span className={styles.card__count}>13,88</span>
					<p className={styles.card__text}>
						Колиечтсво проектов, в среднем назначенных для групп
					</p>
				</div>
				<div className={`${styles.card} ${styles.card_color_blue}`}>
					<h5 className={styles.card__title}>Групп без проектов</h5>
					<span className={styles.card__count}>128</span>
					<p className={styles.card__text}>
						Фактическое количество групп, для которых не назначенны проекты
					</p>
				</div>
				<div className={`${styles.card} ${styles.card_color_blue}`}>
					<h5 className={styles.card__title}>Минимальное количество проекто</h5>
					<span className={styles.card__count}>???</span>
					<p className={styles.card__text}>Не понимаю что это</p>
				</div>
			</div>

			<div className={styles.container}>
				<div className={styles.column}>
					<div className={styles.table}>
						<Table>
							<TableHeader>
								<TableColumn
									text='Группа'
									columnSize='full'
									textWeight='bold'
								/>
								<TableColumn
									text='Направление'
									columnSize='full'
									textWeight='bold'
								/>
								<TableColumn
									text='Проектов'
									columnSize='progress'
									textWeight='bold'
								/>
							</TableHeader>
							<TableMain>
								{filteredGroups.map((group) => (
									<TableRow key={group.id}>
										<TableColumn
											text={group.name}
											columnSize='full'
											textWeight='bold'
											active
											id={group.id}
											onClick={handleShowDetail}
										/>
										<TableColumn
											text={group.direction.name}
											columnSize='full'
										/>
										<TableColumn withChildren columnSize='progress'>
											<ProgressBar
												value={group.assigned_projects_count}
												max={15}
												withInfo
												caption={`Количесто: ${group.assigned_projects_count}`}
											/>
										</TableColumn>
									</TableRow>
								))}
							</TableMain>
						</Table>
					</div>
				</div>
				<div className={styles.column}>
					<Card
						title='Поиск групп'
						subtitle='Отфильтруйте группы по направлению и курсам'>
						<FormField title='Направление подготовки'>
							<SelectWithSearch
								placeholder='Выберите направление..'
								currentOption={currentDirection}
								valueKey='code'
								labelKey='name'
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
								isBlock={
									currentDirection === null &&
									currentCourse === null &&
									currentGroup === null
								}
							/>
						</CardControl>
					</Card>
				</div>
			</div>
			{isShowTrackDetail && (
				<TrackDetailModal
					id={currentGroupId}
					isOpen={isShowTrackDetail}
					onClose={handleCloseDetail}
				/>
			)}
		</>
	);
};
