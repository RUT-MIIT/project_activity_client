import type { FC } from 'react';

import { useSelector } from '../../../store/store';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../shared/components/Table/ui';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Text } from '../../../shared/components/Typography';

import styles from '../styles/my-group-students.module.scss';

export const MyGroupStudents: FC = () => {
	const { currentGroup } = useSelector((state) => state.mentor);

	if (!currentGroup) {
		return null;
	}

	const studentsWithoutTeam = currentGroup.students.filter(
		(student) => !student.team
	).length;

	const registeredStudents = currentGroup.students.filter(
		(student) => student.isRegistered
	).length;

	return (
		<div className={styles.container}>
			<div className={styles.summary}>
				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_blue}`}>
					<span className={styles.summaryCount}>
						{currentGroup.students.length}
					</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Всего студентов</h5>

						<p className={styles.summaryText}>
							Количество студентов в&nbsp;группе
						</p>
					</div>
				</div>

				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_green}`}>
					<span className={styles.summaryCount}>{registeredStudents}</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Зарегистрировано</h5>

						<p className={styles.summaryText}>
							Студентов зарегистрировались в&nbsp;системе
						</p>
					</div>
				</div>

				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_yellow}`}>
					<span className={styles.summaryCount}>{studentsWithoutTeam}</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Без&nbsp;команды</h5>

						<p className={styles.summaryText}>
							Студентов пока не&nbsp;вошли в&nbsp;команду
						</p>
					</div>
				</div>

				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_purple}`}>
					<span className={styles.summaryCount}>
						{currentGroup.teams.length}
					</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Команды</h5>

						<p className={styles.summaryText}>Команд сформировано в группе</p>
					</div>
				</div>
			</div>

			<div className={styles.table}>
				{currentGroup.students.length > 0 ? (
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='small' />

							<TableColumn text='ФИО' textWeight='bold' columnSize='full' />

							<TableColumn text='Команда' textWeight='bold' columnSize='full' />

							<TableColumn text='Роль' textWeight='bold' columnSize='large' />

							<TableColumn
								text='Статус'
								textWeight='bold'
								columnSize='status'
							/>
						</TableHeader>

						<TableMain>
							{currentGroup.students.map((student, index) => {
								const fullName = [
									student.lastName,
									student.firstName,
									student.middleName,
								]
									.filter(Boolean)
									.join(' ');

								return (
									<TableRow key={student.id}>
										<TableColumn text={String(index + 1)} columnSize='small' />

										<TableColumn
											text={fullName}
											columnSize='full'
											textWeight='bold'
										/>

										<TableColumn
											text={student.team?.name || '—'}
											columnSize='full'
										/>

										<TableColumn
											text={
												student.team?.role === 'leader'
													? 'Капитан'
													: student.team?.role === 'member'
													? 'Участник'
													: '—'
											}
											columnSize='large'
										/>

										<TableColumn columnSize='status' withChildren>
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
				) : (
					<Text text='В группе пока нет студентов.' color='grey' />
				)}
			</div>

			<div className={styles.cards}>
				{currentGroup.students.map((student, index) => {
					const fullName = [
						student.lastName,
						student.firstName,
						student.middleName,
					]
						.filter(Boolean)
						.join(' ');

					return (
						<div className={styles.card} key={student.id}>
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

							<div className={styles.cardInfo}>
								<div className={styles.cardRow}>
									<span className={styles.cardLabel}>ФИО</span>

									<span className={styles.cardValue}>{fullName}</span>
								</div>

								<div className={styles.cardRow}>
									<span className={styles.cardLabel}>Команда</span>

									<span className={styles.cardValue}>
										{student.team?.name || '—'}
									</span>
								</div>

								<div className={styles.cardRow}>
									<span className={styles.cardLabel}>Роль</span>

									<span className={styles.cardValue}>
										{student.team?.role === 'leader'
											? 'Капитан'
											: student.team?.role === 'member'
											? 'Участник'
											: '—'}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
