import type { FC } from 'react';
import type { IGroupsTableProps } from '../types/types';

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
import { ProgressBar } from '../../../../../shared/components/ProgressBar/ui/progress-bar';

import {
	getGroupStatus,
	groupStatusOptions,
	getGroupStudentsInTeams,
} from '../lib/helpers';
import { exportGroupsToExcel } from '../lib/export';

import styles from '../styles/groups-table.module.scss';

export const GroupsTable: FC<IGroupsTableProps> = ({ groups }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [currentStatus, setCurrentStatus] = useState<{
		id: string;
		name: string;
	} | null>(groupStatusOptions[0]);

	const filteredGroups = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return groups.filter((group) => {
			const matchesSearch =
				!query ||
				group.name.toLowerCase().includes(query) ||
				group.institute.name.toLowerCase().includes(query) ||
				group.teams.some((team) => team.name.toLowerCase().includes(query));

			const groupStatus = getGroupStatus(group);

			const matchesStatus =
				!currentStatus ||
				currentStatus.id === 'all' ||
				groupStatus === currentStatus.id;

			return matchesSearch && matchesStatus;
		});
	}, [groups, searchQuery, currentStatus]);

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
					currentOption={currentStatus}
					options={groupStatusOptions}
					onChooseOption={setCurrentStatus}
					width='medium'
					withClear={false}
				/>

				<Button
					text='Экспорт в Excel'
					onClick={() => exportGroupsToExcel(filteredGroups)}
					color='green'
				/>
			</div>

			{filteredGroups.length === 0 ? (
				<Text text='Группы не найдены.' color='grey' />
			) : (
				<div className={styles.table__container}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn text='Группа' textWeight='bold' columnSize='full' />

							<TableColumn
								text='Статус'
								textWeight='bold'
								columnSize='status'
							/>

							<TableColumn
								text='Институт'
								textWeight='bold'
								columnSize='medium'
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
								text='Среднее'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Заполненность'
								textWeight='bold'
								columnSize='status'
							/>
						</TableHeader>

						<TableMain>
							{filteredGroups.map((group, index) => {
								const studentsInTeams = getGroupStudentsInTeams(group);

								const averageTeamSize =
									group.teams.length > 0
										? studentsInTeams / group.teams.length
										: 0;

								const status = getGroupStatus(group);

								const statusConfig = {
									noTeams: {
										text: 'Нет команд',
										color: 'grey' as const,
									},
									partial: {
										text: 'Есть без команды',
										color: 'yellow' as const,
									},
									full: {
										text: 'Все в командах',
										color: 'green' as const,
									},
								};

								return (
									<TableRow key={group.id}>
										<TableColumn text={String(index + 1)} columnSize='count' />

										<TableColumn
											text={group.name}
											columnSize='full'
											textWeight='bold'
										/>

										<TableColumn withChildren columnSize='status'>
											<Badge
												text={statusConfig[status].text}
												color={statusConfig[status].color}
											/>
										</TableColumn>

										<TableColumn
											text={group.institute.name}
											columnSize='medium'
										/>

										<TableColumn
											text={String(group.studentsCount)}
											columnSize='medium'
										/>

										<TableColumn
											text={String(group.teams.length)}
											columnSize='medium'
										/>

										<TableColumn
											text={
												group.teams.length > 0
													? averageTeamSize.toFixed(1)
													: '—'
											}
											columnSize='medium'
											textColor={group.teams.length > 0 ? 'default' : 'grey'}
										/>

										<TableColumn withChildren columnSize='status'>
											<ProgressBar
												value={studentsInTeams}
												max={group.studentsCount}
												caption={`${studentsInTeams} из ${group.studentsCount}`}
												withInfo
											/>
										</TableColumn>
									</TableRow>
								);
							})}
						</TableMain>
					</Table>
				</div>
			)}
		</div>
	);
};
