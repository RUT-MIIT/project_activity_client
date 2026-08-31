import type { FC } from 'react';

import { useSelector } from '../../../store/store';

import { Section } from '../../../shared/components/Section';
import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../shared/components/Table/ui';
import { Badge } from '../../../shared/components/Badge/ui/badge';

import styles from '../styles/group.module.scss';

export const Group: FC = () => {
	const { group } = useSelector((state) => state.student);

	if (!group) {
		return null;
	}

	const studentsWithoutTeam = group.members.filter(
		(member) => !member.team
	).length;

	const mentorName = group.mentor
		? `${group.mentor.last_name} ${group.mentor.first_name} ${group.mentor.middle_name}`
		: 'Не назначен';

	return (
		<Section sectionWidth='full' sectionTitle={{ text: 'Моя группа' }}>
			<div className={styles.summary}>
				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_blue}`}>
					<span className={styles.summaryCount}>{group.students_count}</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Всего студентов</h5>

						<p className={styles.summaryText}>Количество студентов в группе</p>
					</div>
				</div>

				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_green}`}>
					<span className={styles.summaryCount}>
						{group.registered_students_count}
					</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Зарегистрировано</h5>

						<p className={styles.summaryText}>
							Студентов зарегистрировались в системе
						</p>
					</div>
				</div>

				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_yellow}`}>
					<span className={styles.summaryCount}>{studentsWithoutTeam}</span>

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Без команды</h5>

						<p className={styles.summaryText}>
							Студентов пока не вошли в команду
						</p>
					</div>
				</div>

				<div
					className={`${styles.summaryCard} ${styles.summaryCard_color_purple}`}>
					{group.mentor ? (
						<span className={styles.summaryCount}>✓</span>
					) : (
						<span className={styles.summaryCount}>—</span>
					)}

					<div className={styles.summaryInfo}>
						<h5 className={styles.summaryTitle}>Наставник</h5>

						<p className={styles.summaryText}>
							{group.mentor
								? `${mentorName}, ${group.mentor.position}`
								: 'У группы пока нет наставника'}
						</p>
					</div>
				</div>
			</div>

			{/* Таблица */}
			<div className={styles.table}>
				<Table>
					<TableHeader>
						<TableColumn text='№' textWeight='bold' columnSize='small' />

						<TableColumn text='ФИО' textWeight='bold' columnSize='full' />

						<TableColumn text='Команда' textWeight='bold' columnSize='full' />

						<TableColumn text='Проект' textWeight='bold' columnSize='full' />

						<TableColumn text='Статус' textWeight='bold' columnSize='status' />
					</TableHeader>

					<TableMain>
						{group.members.map((member, index) => (
							<TableRow key={member.id}>
								<TableColumn text={String(index + 1)} columnSize='small' />

								<TableColumn
									text={`${member.last_name} ${member.first_name} ${member.middle_name}`}
									columnSize='full'
									textWeight='bold'
								/>

								<TableColumn
									text={member.team?.name || '—'}
									columnSize='full'
								/>

								<TableColumn text='—' columnSize='full' />

								<TableColumn columnSize='status' withChildren>
									<Badge
										text={
											member.is_registered
												? 'Зарегистрирован'
												: 'Не зарегистрирован'
										}
										color={member.is_registered ? 'green' : 'grey'}
									/>
								</TableColumn>
							</TableRow>
						))}
					</TableMain>
				</Table>
			</div>

			{/* Карточки для мобильных */}
			<div className={styles.cards}>
				{group.members.map((member, index) => (
					<div className={styles.card} key={member.id}>
						<div className={styles.cardHeader}>
							<span className={styles.cardNumber}>#{index + 1}</span>

							<Badge
								text={
									member.is_registered
										? 'Зарегистрирован'
										: 'Не зарегистрирован'
								}
								color={member.is_registered ? 'green' : 'grey'}
							/>
						</div>

						<div className={styles.cardInfo}>
							<div className={styles.cardRow}>
								<span className={styles.cardLabel}>ФИО</span>

								<span className={styles.cardValue}>
									{member.last_name} {member.first_name} {member.middle_name}
								</span>
							</div>

							<div className={styles.cardRow}>
								<span className={styles.cardLabel}>Команда</span>

								<span className={styles.cardValue}>
									{member.team?.name || '—'}
								</span>
							</div>

							<div className={styles.cardRow}>
								<span className={styles.cardLabel}>Проект</span>

								<span className={styles.cardValue}>—</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</Section>
	);
};
