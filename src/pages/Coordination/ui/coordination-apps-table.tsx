import type { FC } from 'react';
import type { ICoordinationAppsTableProps } from '../types/types';

import { useSelector } from '../../../store/store';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../shared/components/Table/ui';
import { Badge } from '../../../shared/components/Badge/ui/badge';

import { getFullDate } from '../../../shared/lib/date';
import {
	getStagesCount,
	getStatusColor,
	getStatusText,
	getUserLevel,
} from '../../Application/lib/helpers';

import styles from '../styles/coordination.module.scss';

export const CoordinationAppsTable: FC<ICoordinationAppsTableProps> = ({
	apps,
	onShowDetail,
	onShowHistory,
}) => {
	const { user } = useSelector((state) => state.user);
	const level = getUserLevel(user?.role || 'user');

	return (
		<div className={styles.table}>
			<Table>
				<TableHeader>
					<TableColumn text='№ заявки' textWeight='bold' columnSize='small' />
					<TableColumn text='Дата' textWeight='bold' columnSize='date' />
					<TableColumn text='Название' textWeight='bold' columnSize='full' />
					<TableColumn text='Прогресс' textWeight='bold' columnSize='medium' />
					<TableColumn text='Статус' textWeight='bold' columnSize='status' />
					<TableColumn text='Автор' textWeight='bold' columnSize='author' />
				</TableHeader>
				<TableMain>
					{apps.map((app) => (
						<TableRow key={app.id}>
							<TableColumn
								text={app.print_number || '...'}
								columnSize='small'
							/>
							<TableColumn
								text={getFullDate(app.creation_date)}
								columnSize='date'
							/>
							<TableColumn
								text={app.title}
								id={app.id}
								columnSize='full'
								textWeight='bold'
								active
								onClick={onShowDetail}
							/>
							<TableColumn
								text={`Этап ${getStagesCount(app.status.code)} из 4`}
								id={app.id}
								columnSize='medium'
								textWeight='bold'
								active
								onClick={onShowHistory}
							/>
							<TableColumn columnSize='status' withChildren>
								<Badge
									text={getStatusText(app.status.code, app.status.name)}
									color={getStatusColor(app.status.code, level)}
								/>
							</TableColumn>
							<TableColumn
								text={app.author_name}
								columnSize='author'
								textWeight='bold'
								active
							/>
						</TableRow>
					))}
				</TableMain>
			</Table>
		</div>
	);
};
