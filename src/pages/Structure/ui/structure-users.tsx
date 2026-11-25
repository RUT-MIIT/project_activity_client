import type { FC } from 'react';
import type { IControlUser } from '../../../store/control/types';
import type { IDepartment } from '../../../store/catalog/types';
import type { TRoleOptions } from '../../Control/components/ControlUsers/lib/lib';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Select } from '../../../shared/components/Select/ui/select';
import { SearchInput } from '../../../shared/components/Search/ui/search-input';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import {
	Table,
	TableHeader,
	TableColumn,
	TableRow,
	TableMain,
} from '../../../shared/components/Table/ui';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { EditUserForm } from '../../Control/components/ControlUsers/ui/edit-user-form';

import { getControlUsersAction } from '../../../store/control/actions';
import { getRolesAction } from '../../../store/catalog/actions';
import { getMyDivisionPlansAction } from '../../../store/structure/actions';
import {
	setCurrentUser,
	openEditModal,
	closeModals,
} from '../../../store/control/reducer';
import { getUser } from '../../../store/user/reducer';
import {
	getRoleColor,
	getRoleText,
	structureRoleOptions,
} from '../../Control/components/ControlUsers/lib/lib';

import styles from '../styles/structure-users.module.scss';

const INSTITUTE_EDITABLE_ROLES = ['mentor', 'department_validator'];

export const StructureUsers: FC = () => {
	const dispatch = useDispatch();
	const currentAccount = useSelector(getUser);
	const isInstituteValidator =
		currentAccount?.role === 'institute_validator';

	const { users, currentUser, isLoadingUsers, isOpenEditModal } = useSelector(
		(state) => state.control
	);
	const { currentSemester, divisionsPlans } = useSelector(
		(state) => state.structure
	);

	const [searchQuery, setSearchQuery] = useState('');
	const [roleOption, setRoleOption] = useState<TRoleOptions | null>(null);

	const instituteDepartments = useMemo<IDepartment[]>(
		() =>
			divisionsPlans
				.filter((elem) => elem.department_name !== 'ЦПДС')
				.map((elem) => ({
					id: elem.department_id,
					name: elem.department_name,
					short_name: elem.department_short_name,
				})),
		[divisionsPlans]
	);

	useEffect(() => {
		dispatch(getControlUsersAction());
		if (isInstituteValidator) {
			dispatch(getRolesAction());
		}
	}, [dispatch, isInstituteValidator]);

	useEffect(() => {
		if (isInstituteValidator && currentSemester && currentAccount) {
			dispatch(
				getMyDivisionPlansAction({
					semesterId: currentSemester.id,
					divisionCode: currentAccount.institute_code ?? undefined,
				})
			);
		}
	}, [dispatch, isInstituteValidator, currentSemester, currentAccount]);

	const handleChangeRole = (option: TRoleOptions | null) => {
		setRoleOption(option);
	};

	const handleOpenEditModal = (id: number) => {
		if (!isInstituteValidator) {
			return;
		}

		const selectedUser = users.find((elem) => elem.id === id);
		if (selectedUser) {
			dispatch(setCurrentUser(selectedUser));
			dispatch(openEditModal());
		}
	};

	const handleCloseModals = () => {
		dispatch(closeModals());
	};

	const canChangeRoleAndDepartment =
		!!currentUser &&
		INSTITUTE_EDITABLE_ROLES.includes(currentUser.role?.code);

	const filteredUsers = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return users.filter((user: IControlUser) => {
			const matchesSearch =
				!query ||
				user.full_name?.toLowerCase().includes(query) ||
				user.department?.name?.toLowerCase().includes(query) ||
				user.role?.name?.toLowerCase().includes(query);

			const matchesRole =
				!roleOption ||
				(roleOption.id === 'user'
					? getRoleText(user.role?.code) === 'Пользователь'
					: user.role?.code === roleOption.id);

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
					options={structureRoleOptions}
					onChooseOption={handleChangeRole}
					width='medium'
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
									active={isInstituteValidator}
									id={user.id}
									onClick={
										isInstituteValidator ? handleOpenEditModal : undefined
									}
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
				{isInstituteValidator && isOpenEditModal && (
					<Modal
						isOpen={isOpenEditModal}
						onClose={handleCloseModals}
						title='Изменение данных'
						description={`Пользователь - ${currentUser?.full_name}`}>
						<EditUserForm
							allowedRoleCodes={INSTITUTE_EDITABLE_ROLES}
							departmentOptions={instituteDepartments}
							canChangeRoleAndDepartment={canChangeRoleAndDepartment}
							canChangeContact={false}
						/>
					</Modal>
				)}
			</div>
		</>
	);
};
