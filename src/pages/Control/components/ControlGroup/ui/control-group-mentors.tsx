import type { FC } from 'react';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../../../shared/components/Table/ui';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Modal } from '../../../../../shared/components/Modal/ui/modal';
import { Filter } from '../../../../../shared/components/Filter/ui/filter';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { Text } from '../../../../../shared/components/Typography';

import {
	getGroupMentorsAction,
	getInstituteEmployeesAction,
} from '../../../../../store/controlGroup/actions';

import { EditGroupMentorsForm } from './edit-group-mentors-form';

import styles from '../styles/control-group-mentors.module.scss';

interface IFilterOption {
	id: number | string;
	name: string;
}

const mentorFilterOptions: IFilterOption[] = [
	{
		id: 1,
		name: 'Все группы',
	},
	{
		id: 2,
		name: 'Без наставников',
	},
];

export const ControlGroupMentors: FC = () => {
	const dispatch = useDispatch();

	const { groupMentors, employees, isLoadingGroupMentors } = useSelector(
		(state) => state.controlGroup
	);

	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

	const [searchQuery, setSearchQuery] = useState('');

	const [currentCourse, setCurrentCourse] = useState<IFilterOption | null>(
		null
	);

	const [currentDirection, setCurrentDirection] =
		useState<IFilterOption | null>(null);

	const [currentMentorFilter, setCurrentMentorFilter] = useState<IFilterOption>(
		mentorFilterOptions[0]
	);

	useEffect(() => {
		dispatch(getGroupMentorsAction());
		dispatch(getInstituteEmployeesAction());
	}, [dispatch]);

	const selectedGroup = groupMentors.find(
		(group) => group.id === selectedGroupId
	);

	/**
	 * Фильтр по курсу
	 */
	const courseOptions = useMemo<IFilterOption[]>(() => {
		const courses = new Set<number>();

		groupMentors.forEach((group) => {
			courses.add(group.courseNumber);
		});

		return Array.from(courses)
			.sort((a, b) => a - b)
			.map((course) => ({
				id: course,
				name: `${course} курс`,
			}));
	}, [groupMentors]);

	/**
	 * Фильтр по направлению
	 */
	const directionOptions = useMemo<IFilterOption[]>(() => {
		const directions = new Set<string>();

		groupMentors.forEach((group) => {
			if (group.directionCode) {
				directions.add(group.directionCode);
			}
		});

		return Array.from(directions)
			.sort((a, b) => a.localeCompare(b))
			.map((direction) => ({
				id: direction,
				name: direction,
			}));
	}, [groupMentors]);

	/**
	 * Фильтрация групп
	 */
	const filteredGroups = useMemo(() => {
		let result = groupMentors;

		// Поиск по названию группы и ФИО наставника
		if (searchQuery.trim()) {
			const query = searchQuery.trim().toLowerCase();

			result = result.filter((group) => {
				const groupMatch = group.name.toLowerCase().includes(query);

				const mentorMatch = group.mentorIds.some((mentorId) => {
					const mentor = employees.find((employee) => employee.id === mentorId);

					return mentor?.fullName.toLowerCase().includes(query);
				});

				return groupMatch || mentorMatch;
			});
		}

		// Фильтр по курсу
		if (currentCourse) {
			result = result.filter(
				(group) => group.courseNumber === currentCourse.id
			);
		}

		// Фильтр по направлению
		if (currentDirection) {
			result = result.filter(
				(group) => group.directionCode === currentDirection.id
			);
		}

		// Фильтр по наличию наставников
		if (currentMentorFilter.id === 2) {
			result = result.filter((group) => group.mentorIds.length === 0);
		}

		return result;
	}, [
		groupMentors,
		employees,
		searchQuery,
		currentCourse,
		currentDirection,
		currentMentorFilter,
	]);

	const openGroup = (groupId: number) => {
		setSelectedGroupId(groupId);
	};

	const closeModal = () => {
		setSelectedGroupId(null);
	};

	if (isLoadingGroupMentors) {
		return <Preloader />;
	}

	return (
		<>
			<div className={styles.header}>
				<Filter
					placeholder='Поиск по группе или наставнику...'
					onFilter={setSearchQuery}
				/>

				<Select
					placeholder='Выберите курс...'
					currentOption={currentCourse}
					options={courseOptions}
					onChooseOption={setCurrentCourse}
					width='medium'
				/>

				<Select
					placeholder='Выберите направление...'
					currentOption={currentDirection}
					options={directionOptions}
					onChooseOption={setCurrentDirection}
					width='medium'
				/>

				<Select
					placeholder='Наставники...'
					currentOption={currentMentorFilter}
					options={mentorFilterOptions}
					onChooseOption={(option) => {
						if (option) {
							setCurrentMentorFilter(option);
						}
					}}
					width='medium'
					withClear={false}
				/>
			</div>

			{filteredGroups.length > 0 ? (
				<div className={styles.table}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='small' />

							<TableColumn
								text='Учебная группа'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn
								text='Наставники'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn text='Курс' textWeight='bold' columnSize='small' />

							<TableColumn
								text='Направление'
								textWeight='bold'
								columnSize='large'
							/>
						</TableHeader>

						<TableMain>
							{filteredGroups.map((group, index) => {
								const mentors = group.mentorIds
									.map((mentorId) =>
										employees.find((employee) => employee.id === mentorId)
									)
									.filter(Boolean);

								return (
									<TableRow key={group.id}>
										<TableColumn text={String(index + 1)} columnSize='small' />

										<TableColumn
											text={group.name}
											columnSize='full'
											textWeight='bold'
											active
											id={group.id}
											onClick={openGroup}
										/>

										<TableColumn
											text={
												mentors.length
													? mentors.map((mentor) => mentor?.fullName).join(', ')
													: 'Не назначены'
											}
											textColor={mentors.length < 1 ? 'grey' : 'default'}
											columnSize='full'
										/>

										<TableColumn
											text={String(group.courseNumber)}
											columnSize='small'
										/>

										<TableColumn
											text={group.directionCode}
											columnSize='large'
										/>
									</TableRow>
								);
							})}
						</TableMain>
					</Table>
				</div>
			) : (
				<Text text='Группы не найдены.' color='grey' />
			)}

			{selectedGroup && (
				<Modal
					isOpen
					onClose={closeModal}
					title={`Наставники группы ${selectedGroup.name}`}>
					<EditGroupMentorsForm groupId={selectedGroup.id} />
				</Modal>
			)}
		</>
	);
};
