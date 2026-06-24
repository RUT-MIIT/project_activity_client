import type { FC } from 'react';
import type { IControlUser } from '../../../../../store/control/types';
import type { TRoleOptions } from '../lib/lib';

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

import { getControlUsersAction } from '../../../../../store/control/actions';
import { getRoleColor, getRoleText, roleOptions } from '../lib/lib';

import styles from '../styles/control-users.module.scss';

export const ControlUsers: FC = () => {
	const dispatch = useDispatch();

	const { users, isLoadingUsers } = useSelector((state) => state.control);

	const [searchQuery, setSearchQuery] = useState('');
	const [roleOption, setRoleOption] = useState<TRoleOptions | null>(null);

	useEffect(() => {
		dispatch(getControlUsersAction());
	}, [dispatch]);

	const handleChangeRole = (option: TRoleOptions | null) => {
		setRoleOption(option);
	};

	const filteredUsers = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return users.filter((user: IControlUser) => {
			const matchesSearch =
				!query ||
				user.full_name?.toLowerCase().includes(query) ||
				user.department?.name?.toLowerCase().includes(query) ||
				user.role?.name?.toLowerCase().includes(query);

			const matchesRole = !roleOption || user.role?.code === roleOption.id;

			return matchesSearch && matchesRole;
		});
	}, [users, searchQuery, roleOption]);

	if (isLoadingUsers) {
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
					currentOption={roleOption}
					options={roleOptions}
					onChooseOption={handleChangeRole}
					width='large'
					withClear
					placeholder='Выберите роль..'
				/>
			</div>

			<div className={styles.table}>
				<Table>
					<TableHeader>
						<TableColumn text='Имя' textWeight='bold' columnSize='full' />
						<TableColumn
							text='Роль в системе'
							textWeight='bold'
							columnSize='full'
						/>
						<TableColumn
							text='Подразделение'
							textWeight='bold'
							columnSize='full'
						/>
						<TableColumn text='Заявок' textWeight='bold' columnSize='small' />
					</TableHeader>

					<TableMain>
						{filteredUsers.map((user: IControlUser) => (
							<TableRow key={user.id}>
								<TableColumn
									text={user.full_name}
									columnSize='full'
									textWeight='bold'
									active
								/>
								<TableColumn columnSize='full' withChildren>
									<Badge
										text={getRoleText(user.role?.code) || '-'}
										color={getRoleColor(user.role?.code)}
									/>
								</TableColumn>
								<TableColumn
									text={user.department?.name || '-'}
									columnSize='full'
								/>
								<TableColumn
									text={String(user.authored_projects_count)}
									columnSize='small'
								/>
							</TableRow>
						))}
					</TableMain>
				</Table>
			</div>
		</>
	);
};
