import type { FC } from 'react';
import type { IMentorsTableProps } from '../types/types';

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
import { Button } from '../../../../../shared/components/Button/ui/button';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { MentorDetailModal } from './mentor-detail-modal';

import { exportMentorsToExcel } from '../lib/export';
import {
	loadStatusOptions,
	loadStatusConfig,
	getLoadStatus,
} from '../lib/helpers';

import styles from '../styles/mentors-table.module.scss';

export const MentorsTable: FC<IMentorsTableProps> = ({ mentors }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const [currentLoadStatus, setCurrentLoadStatus] = useState<{
		id: string;
		name: string;
	} | null>(loadStatusOptions[0]);

	const [currentMentorId, setCurrentMentorId] = useState<number | null>(null);

	const [isShowMentorDetail, setIsShowMentorDetail] = useState(false);

	const handleMentorClick = (id: number) => {
		setCurrentMentorId(id);
		setIsShowMentorDetail(true);
	};

	const handleCloseDetail = () => {
		setIsShowMentorDetail(false);
		setCurrentMentorId(null);
	};

	const filteredMentors = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return mentors.filter((mentor) => {
			const matchesSearch =
				!query ||
				mentor.fullName.toLowerCase().includes(query) ||
				mentor.institute.name.toLowerCase().includes(query) ||
				mentor.groups.some((group) => group.name.toLowerCase().includes(query));

			const loadStatus = getLoadStatus(mentor.groups.length);

			const matchesLoadStatus =
				!currentLoadStatus ||
				currentLoadStatus.id === 'all' ||
				loadStatus === currentLoadStatus.id;

			return matchesSearch && matchesLoadStatus;
		});
	}, [mentors, searchQuery, currentLoadStatus]);

	return (
		<div className={styles.table}>
			<div className={styles.table__header}>
				<Filter
					placeholder='Поиск..'
					onFilter={setSearchQuery}
					width='default'
				/>

				<Select
					placeholder='Статус нагрузки..'
					currentOption={currentLoadStatus}
					options={loadStatusOptions}
					onChooseOption={setCurrentLoadStatus}
					width='default'
					withClear={false}
				/>

				<Button
					text='Экспорт в Excel'
					onClick={() => exportMentorsToExcel(filteredMentors)}
					color='green'
				/>
			</div>

			{filteredMentors.length === 0 ? (
				<Text text='Наставники не найдены.' color='grey' />
			) : (
				<div className={styles.table__container}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn
								text='Наставник'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn
								text='Институт'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Группы'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Команды'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Статус нагрузки'
								textWeight='bold'
								columnSize='large'
							/>
						</TableHeader>

						<TableMain>
							{filteredMentors.map((mentor, index) => {
								const groupsCount = mentor.groups.length;
								const loadStatus = getLoadStatus(groupsCount);
								const status = loadStatusConfig[loadStatus];

								return (
									<TableRow key={mentor.id}>
										<TableColumn text={String(index + 1)} columnSize='count' />

										<TableColumn
											text={mentor.fullName}
											columnSize='full'
											textWeight='bold'
											active
											id={mentor.id}
											onClick={handleMentorClick}
										/>

										<TableColumn
											text={mentor.institute.name}
											columnSize='medium'
										/>

										<TableColumn
											text={String(groupsCount)}
											columnSize='medium'
										/>

										<TableColumn
											text={String(mentor.teamsCount)}
											columnSize='medium'
										/>

										<TableColumn withChildren columnSize='large'>
											<Badge text={status.text} color={status.color} />
										</TableColumn>
									</TableRow>
								);
							})}
						</TableMain>
					</Table>
				</div>
			)}
			{isShowMentorDetail && (
				<MentorDetailModal
					id={currentMentorId}
					isOpen={isShowMentorDetail}
					onClose={handleCloseDetail}
				/>
			)}
		</div>
	);
};
