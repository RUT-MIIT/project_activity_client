import type { FC } from 'react';
import type { IStudentsTableProps } from '../types/types';

import { useSelector, useDispatch } from '../../../../../store/store';
import { useMemo, useState } from 'react';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../../../shared/components/Table/ui';
import { Filter } from '../../../../../shared/components/Filter/ui/filter';
import { Text } from '../../../../../shared/components/Typography';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { Button } from '../../../../../shared/components/Button/ui/button';

import { getStudentStatus } from '../lib/helpers';
import { statusOptions } from '../lib/lib';
import { exportStudentsToExcel } from '../lib/export';
import { setStudentStatus } from '../../../../../store/dashboard/reducer';

import styles from '../styles/students-table.module.scss';

export const StudentsTable: FC<IStudentsTableProps> = ({ students }) => {
	const dispatch = useDispatch();

	const currentStatus = useSelector(
		(state) => state.dashboard.selectedStudentStatus
	);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredStudents = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return students.filter((student) => {
			const matchesSearch =
				!query ||
				student.fullName.toLowerCase().includes(query) ||
				student.institute.name.toLowerCase().includes(query) ||
				student.studyGroup.name.toLowerCase().includes(query) ||
				student.team?.name.toLowerCase().includes(query) ||
				student.project?.name.toLowerCase().includes(query);

			const matchesStatus =
				currentStatus === 'all' || getStudentStatus(student) === currentStatus;

			return matchesSearch && matchesStatus;
		});
	}, [searchQuery, currentStatus, students]);

	console.log('TABLE DEBUG', {
		searchQuery,
		currentStatus,
		studentsCount: students.length,
		filteredCount: filteredStudents.length,
		filteredStudents: filteredStudents.map((student) => ({
			id: student.id,
			fullName: student.fullName,
			institute: student.institute.id,
			course: student.course,
			status: getStudentStatus(student),
		})),
	});

	const duplicateIds = useMemo(() => {
		return students
			.map((student) => student.id)
			.filter((id, index, ids) => ids.indexOf(id) !== index);
	}, [students]);

	console.log('DUPLICATE STUDENT IDS', duplicateIds);

	return (
		<div className={styles.table}>
			<div className={styles.table__header}>
				<Filter
					placeholder='Поиск..'
					onFilter={setSearchQuery}
					width='default'
				/>

				<Select
					placeholder='Выберите статус..'
					currentOption={
						statusOptions.find((option) => option.id === currentStatus) ?? null
					}
					options={statusOptions}
					onChooseOption={(option) => {
						dispatch(setStudentStatus(option?.id ?? 'all'));
					}}
					width='medium'
					withClear={false}
				/>

				<Button
					text='Экспорт в Excel'
					onClick={() => exportStudentsToExcel(filteredStudents)}
					color='green'
				/>
			</div>

			{filteredStudents.length === 0 ? (
				<Text text='Студенты не найдены.' color='grey' />
			) : (
				<div className={styles.table__container}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn text='Студент' textWeight='bold' columnSize='full' />

							<TableColumn
								text='Институт'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Группа'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Наставник'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn
								text='Команда'
								textWeight='bold'
								columnSize='large'
							/>

							<TableColumn text='Проект' textWeight='bold' columnSize='large' />

							<TableColumn
								text='Регистрация'
								textWeight='bold'
								columnSize='status'
							/>
						</TableHeader>

						<TableMain>
							{filteredStudents.map((student, index) => (
								<TableRow key={student.id}>
									<TableColumn text={String(index + 1)} columnSize='count' />

									<TableColumn
										text={student.fullName}
										columnSize='full'
										textWeight='bold'
									/>

									<TableColumn
										text={student.institute.name}
										columnSize='medium'
									/>

									<TableColumn
										text={student.studyGroup.name}
										columnSize='medium'
									/>

									<TableColumn
										text={
											student.mentors?.length
												? student.mentors
														.map((mentor) => mentor.fullName)
														.join(', ')
												: 'Без наставника'
										}
										columnSize='full'
										textColor={student.mentors?.length ? 'default' : 'grey'}
									/>

									<TableColumn
										text={student.team?.name || 'Без команды'}
										columnSize='large'
										textColor={student.team ? 'default' : 'grey'}
									/>

									<TableColumn
										text={student.project?.name || 'Без проекта'}
										columnSize='large'
										textColor={student.project ? 'default' : 'grey'}
									/>

									<TableColumn withChildren columnSize='status'>
										<Badge
											text={
												student.isRegistered
													? 'Зарегистрирован'
													: 'Не зарегистрирован'
											}
											color={student.isRegistered ? 'green' : 'grey'}
										/>
									</TableColumn>
								</TableRow>
							))}
						</TableMain>
					</Table>
				</div>
			)}
		</div>
	);
};
