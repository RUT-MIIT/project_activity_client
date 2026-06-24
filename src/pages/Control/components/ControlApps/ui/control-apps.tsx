import type { FC } from 'react';
import type { ISemester } from '../../../../../store/structure/types';
import type { IControlApp } from '../../../../../store/control/types';
import type { TStatusFilter } from '../lib/lib';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { SearchInput } from '../../../../../shared/components/Search/ui/search-input';
import {
	Table,
	TableHeader,
	TableColumn,
	TableRow,
	TableMain,
} from '../../../../../shared/components/Table/ui';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { getControlAppsAction } from '../../../../../store/control/actions';
import {
	getUserLevel,
	getStatusColor,
	getStatusText,
} from '../../../../Application/lib/helpers';
import { statusOptions } from '../lib/lib';

import styles from '../styles/control-apps.module.scss';

export const ControlApps: FC = () => {
	const dispatch = useDispatch();
	const { apps, isLoadingApps } = useSelector((state) => state.control);
	const { semesters, currentSemester, isLoadingSemesters } = useSelector(
		(state) => state.structure
	);
	const { user } = useSelector((state) => state.user);
	const level = getUserLevel(user?.role || 'user');

	const [searchQuery, setSearchQuery] = useState('');
	const [semesterOption, setSemesterOption] = useState<ISemester | null>(null);
	const [statusOption, setStatusOption] = useState<TStatusFilter | null>(null);

	const handleChangeStatus = (option: ISemester | null) => {
		setSemesterOption(option);
	};

	const handleChangeStatusFilter = (option: TStatusFilter | null) => {
		setStatusOption(option);
	};

	const filteredApps = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return apps.filter((app) => {
			// Поиск
			const matchesSearch =
				!query ||
				app.title?.toLowerCase().includes(query) ||
				app.author_name?.toLowerCase().includes(query) ||
				app.print_number?.toString().toLowerCase().includes(query);

			// Фильтр по статусу
			let matchesStatus = true;

			if (statusOption?.id === 'approved') {
				matchesStatus = app.status.code === 'approved';
			} else if (statusOption?.id === 'rejected') {
				matchesStatus = app.status.code === 'rejected';
			} else if (statusOption?.id === 'in_progress') {
				matchesStatus =
					app.status.code !== 'approved' && app.status.code !== 'rejected';
			}

			return matchesSearch && matchesStatus;
		});
	}, [apps, searchQuery, statusOption]);

	useEffect(() => {
		if (currentSemester) {
			setSemesterOption(currentSemester);
		}
	}, [currentSemester]);

	useEffect(() => {
		if (semesterOption) {
			dispatch(getControlAppsAction(semesterOption.id));
		}
	}, [dispatch, semesterOption]);

	if (isLoadingSemesters || isLoadingApps) {
		return <Preloader />;
	}

	return (
		<>
			<div className={styles.header}>
				<SearchInput
					placeholder='Поиск ..'
					value={searchQuery}
					onChange={setSearchQuery}
				/>
				<Select
					currentOption={statusOption}
					options={statusOptions}
					onChooseOption={handleChangeStatusFilter}
					width='default'
					withClear
					placeholder='Выберите статус..'
				/>
				<Select
					currentOption={semesterOption}
					options={semesters}
					onChooseOption={handleChangeStatus}
					width='default'
					withClear={false}
				/>
			</div>
			<div className={styles.table}>
				<Table>
					<TableHeader>
						<TableColumn text='№ заявки' textWeight='bold' columnSize='small' />
						<TableColumn text='Название' textWeight='bold' columnSize='full' />
						<TableColumn
							text='Подразделение'
							textWeight='bold'
							columnSize='full'
						/>
						<TableColumn text='Автор' textWeight='bold' columnSize='author' />
						<TableColumn text='Статус' textWeight='bold' columnSize='status' />
					</TableHeader>
					<TableMain>
						{filteredApps.map((elem: IControlApp) => (
							<TableRow key={elem.id}>
								<TableColumn
									text={elem.print_number || '...'}
									columnSize='small'
								/>
								<TableColumn
									text={elem.title}
									id={elem.id}
									columnSize='full'
									textWeight='bold'
									active
								/>
								<TableColumn
									text={elem.main_department?.name || '-'}
									columnSize='full'
								/>
								<TableColumn text={elem.author_name} columnSize='author' />
								<TableColumn columnSize='status' withChildren>
									<Badge
										text={getStatusText(elem.status.code, elem.status.name)}
										color={getStatusColor(elem.status.code, level)}
									/>
								</TableColumn>
							</TableRow>
						))}
					</TableMain>
				</Table>
			</div>
		</>
	);
};
