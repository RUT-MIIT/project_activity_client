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
import { ProgressBar } from '../../../../../shared/components/ProgressBar/ui/progress-bar';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Filter } from '../../../../../shared/components/Filter/ui/filter';
import { Text } from '../../../../../shared/components/Typography';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';
import { Card } from '../../../../../shared/components/Card/ui';

import { getInstituteGroupsWithTeamsAction } from '../../../../../store/controlGroup/actions';

import { useWindowWidth } from '../../../../../hooks/useWindowWidth';

import styles from '../styles/control-group-mentors.module.scss';
import { Button } from '../../../../../shared/components/Button/ui/button';

export const ControlGroupFormation: FC = () => {
	const dispatch = useDispatch();

	const windowWidth = useWindowWidth();
	const isMobile = windowWidth <= 1000;

	const { groupsWithTeams, isLoadingGroupsWithTeams } = useSelector(
		(state) => state.controlGroup
	);

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		dispatch(getInstituteGroupsWithTeamsAction());
	}, [dispatch]);

	const filteredGroups = useMemo(() => {
		if (!searchQuery.trim()) {
			return groupsWithTeams;
		}

		const query = searchQuery.trim().toLowerCase();

		return groupsWithTeams.filter((group) =>
			group.name.toLowerCase().includes(query)
		);
	}, [groupsWithTeams, searchQuery]);

	if (isLoadingGroupsWithTeams) {
		return <Preloader />;
	}

	return (
		<>
			<div className={styles.header}>
				<Filter
					placeholder='Поиск по группе...'
					onFilter={setSearchQuery}
					width={isMobile ? 'full' : 'default'}
				/>
			</div>

			{filteredGroups.length === 0 ? (
				<Text text='Группы не найдены.' color='grey' />
			) : !isMobile ? (
				<div className={styles.table}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn
								text='Учебная группа'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn
								text='Студенты'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Команды'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Регистраций в системе'
								textWeight='bold'
								columnSize='progress'
							/>

							<TableColumn
								text='Распределение студентов'
								textWeight='bold'
								columnSize='progress'
							/>

							<TableColumn
								text='Подтверждено составов'
								textWeight='bold'
								columnSize='progress'
							/>
						</TableHeader>

						<TableMain>
							{filteredGroups.map((group, index) => {
								const studentsWithoutTeams = Math.max(
									0,
									group.studentsCount - group.studentsInTeamsCount
								);

								return (
									<TableRow key={group.id}>
										<TableColumn text={String(index + 1)} columnSize='count' />

										<TableColumn
											text={group.name}
											columnSize='full'
											textWeight='bold'
										/>

										<TableColumn
											text={String(group.studentsCount)}
											columnSize='medium'
										/>

										<TableColumn
											text={String(group.teamsCount)}
											textColor={group.teamsCount === 0 ? 'grey' : 'default'}
											columnSize='medium'
										/>

										<TableColumn withChildren columnSize='progress'>
											<ProgressBar
												value={group.registeredStudentsCount}
												max={group.studentsCount}
												withInfo
												caption={`${group.registeredStudentsCount} из ${group.studentsCount}`}
											/>
										</TableColumn>

										<TableColumn withChildren columnSize='progress'>
											<ProgressBar
												value={group.studentsInTeamsCount}
												max={group.studentsCount}
												withInfo
												caption={`${studentsWithoutTeams} без команды`}
											/>
										</TableColumn>

										<TableColumn withChildren columnSize='progress'>
											<ProgressBar
												value={group.assembledTeamsCount}
												max={group.teamsCount}
												withInfo
												caption={`${group.assembledTeamsCount} из ${group.teamsCount}`}
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
					{filteredGroups.map((group, index) => {
						const studentsWithoutTeams = Math.max(
							0,
							group.studentsCount - group.studentsInTeamsCount
						);

						return (
							<Card key={group.id}>
								<div className={styles.cardHeader}>
									<span className={styles.cardNumber}>#{index + 1}</span>

									<Badge
										text={
											group.teamsCount > 0
												? `${group.teamsCount} ${
														group.teamsCount === 1 ? 'команда' : 'команд'
												  }`
												: 'Без команд'
										}
										color={group.teamsCount > 0 ? 'green' : 'grey'}
									/>
								</div>

								<h3 className={styles.cardTitle}>{group.name}</h3>

								<div className={styles.cardMeta}>
									<div className={styles.cardMetaItem}>
										<span className={styles.cardLabel}>Студентов</span>

										<span className={styles.cardValue}>
											{group.studentsCount}
										</span>
									</div>

									<div className={styles.cardMetaItem}>
										<span className={styles.cardLabel}>Команд создано</span>

										<span
											className={`${styles.cardValue} ${
												group.teamsCount === 0 ? styles.cardValue_grey : ''
											}`}>
											{group.teamsCount}
										</span>
									</div>
								</div>

								<div className={styles.cardProgress}>
									<div className={styles.cardProgressItem}>
										<ProgressBar
											value={group.registeredStudentsCount}
											max={group.studentsCount}
											withInfo
											caption='Регистраций в системе'
										/>
									</div>

									<div className={styles.cardProgressItem}>
										<ProgressBar
											value={group.studentsInTeamsCount}
											max={group.studentsCount}
											withInfo
											caption={`${studentsWithoutTeams} без команды`}
										/>
									</div>

									<div className={styles.cardProgressItem}>
										<ProgressBar
											value={group.assembledTeamsCount}
											max={group.teamsCount}
											withInfo
											caption='Подтверждено составов'
										/>
									</div>
								</div>
								<Button text='Подробнее' width='full' isBlock />
							</Card>
						);
					})}
				</div>
			)}
		</>
	);
};
