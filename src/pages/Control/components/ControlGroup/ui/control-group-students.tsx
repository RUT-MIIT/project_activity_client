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
import { Filter } from '../../../../../shared/components/Filter/ui/filter';
import { Text } from '../../../../../shared/components/Typography';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';
import { Card } from '../../../../../shared/components/Card/ui';

import { getInstituteStudentsAction } from '../../../../../store/controlGroup/actions';

import { useWindowWidth } from '../../../../../hooks/useWindowWidth';

import styles from '../styles/control-group-mentors.module.scss';

export const ControlGroupStudents: FC = () => {
	const dispatch = useDispatch();

	const windowWidth = useWindowWidth();
	const isMobile = windowWidth <= 1000;

	const { students, isLoadingStudents } = useSelector(
		(state) => state.controlGroup
	);

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		dispatch(getInstituteStudentsAction());
	}, [dispatch]);

	const getMentorsText = (mentors: (typeof students)[number]['mentors']) => {
		if (mentors.length === 0) {
			return 'Не назначены';
		}

		if (mentors.length === 1) {
			return mentors[0].fullName;
		}

		return `${mentors[0].fullName} и ещё ${mentors.length - 1}`;
	};

	const getTeamRoleText = (role: string | null) => {
		if (!role) {
			return '—';
		}

		if (role === 'leader') {
			return 'Капитан';
		}

		return 'Участник';
	};

	const filteredStudents = useMemo(() => {
		if (!searchQuery.trim()) {
			return students;
		}

		const query = searchQuery.trim().toLowerCase();

		return students.filter((student) => {
			const fullName = [student.lastName, student.firstName, student.middleName]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();

			const groupName = student.studyGroup.name.toLowerCase();
			const teamName = student.teamName?.toLowerCase() || '';
			const projectTitle = student.project?.title.toLowerCase() || '';

			return (
				fullName.includes(query) ||
				groupName.includes(query) ||
				teamName.includes(query) ||
				projectTitle.includes(query)
			);
		});
	}, [students, searchQuery]);

	if (isLoadingStudents) {
		return <Preloader />;
	}

	return (
		<>
			<div className={styles.header}>
				<Filter
					placeholder='Поиск по студенту, группе, команде...'
					onFilter={setSearchQuery}
					width={isMobile ? 'full' : 'default'}
				/>
			</div>

			{filteredStudents.length === 0 ? (
				<Text text='Студенты не найдены.' color='grey' />
			) : !isMobile ? (
				<div className={styles.table}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn text='Студент' textWeight='bold' columnSize='full' />

							<TableColumn
								text='Группа'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Наставники'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn text='Команда' textWeight='bold' columnSize='full' />

							<TableColumn text='Роль' textWeight='bold' columnSize='medium' />

							<TableColumn text='Проект' textWeight='bold' columnSize='full' />

							<TableColumn
								text='Регистрация'
								textWeight='bold'
								columnSize='status'
							/>
						</TableHeader>

						<TableMain>
							{filteredStudents.map((student, index) => {
								const fullName = [
									student.lastName,
									student.firstName,
									student.middleName,
								]
									.filter(Boolean)
									.join(' ');

								return (
									<TableRow key={student.id}>
										<TableColumn text={String(index + 1)} columnSize='count' />

										<TableColumn
											text={fullName}
											columnSize='full'
											textWeight='bold'
										/>

										<TableColumn
											text={student.studyGroup.name}
											columnSize='medium'
										/>

										<TableColumn
											text={getMentorsText(student.mentors)}
											columnSize='full'
											textColor={
												student.mentors.length === 0 ? 'grey' : 'default'
											}
										/>

										<TableColumn
											text={student.teamName || '—'}
											columnSize='full'
											textColor={student.teamRole ? 'default' : 'grey'}
										/>

										<TableColumn
											text={getTeamRoleText(student.teamRole)}
											columnSize='medium'
											textColor={student.teamRole ? 'default' : 'grey'}
										/>

										<TableColumn
											text={student.project?.title || 'Без проекта'}
											columnSize='full'
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
								);
							})}
						</TableMain>
					</Table>
				</div>
			) : (
				<div className={styles.cards}>
					{filteredStudents.map((student, index) => {
						const fullName = [
							student.lastName,
							student.firstName,
							student.middleName,
						]
							.filter(Boolean)
							.join(' ');

						return (
							<Card key={student.id}>
								<div className={styles.cardHeader}>
									<span className={styles.cardNumber}>#{index + 1}</span>

									<Badge
										text={
											student.isRegistered
												? 'Зарегистрирован'
												: 'Не зарегистрирован'
										}
										color={student.isRegistered ? 'green' : 'grey'}
									/>
								</div>

								<h3 className={styles.cardTitle}>{fullName}</h3>

								<div className={styles.studentSection}>
									<span className={styles.cardLabel}>Учебная группа</span>

									<span className={styles.cardValue}>
										{student.studyGroup.name}
									</span>
								</div>

								<div className={styles.studentSection}>
									<span className={styles.cardLabel}>Наставники</span>

									<div className={styles.studentMentors}>
										<span
											className={`${styles.cardValue} ${
												student.mentors.length === 0
													? styles.cardValue_grey
													: ''
											}`}>
											{getMentorsText(student.mentors)}
										</span>
									</div>
								</div>

								<div className={styles.studentSection}>
									<span className={styles.cardLabel}>Команда</span>

									<div className={styles.studentTeam}>
										<span
											className={`${styles.studentTeamName} ${
												!student.teamName ? styles.cardValue_grey : ''
											}`}>
											{student.teamName || 'Без команды'}
										</span>

										{student.teamRole && (
											<span className={styles.studentTeamRole}>
												{getTeamRoleText(student.teamRole)}
											</span>
										)}
									</div>
								</div>

								<div className={styles.studentSection}>
									<span className={styles.cardLabel}>Проект</span>

									<div className={styles.studentProject}>
										<span
											className={`${styles.cardValue} ${
												!student.project ? styles.cardValue_grey : ''
											}`}>
											{student.project?.title || 'Без проекта'}
										</span>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</>
	);
};
