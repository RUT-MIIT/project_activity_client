import type { FC } from 'react';
import type { IStatusOption } from '../types/types';
import type { IApproveUser } from '../../../../../store/control/types';
import type { IDepartment } from '../../../../../store/catalog/types';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Button } from '../../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../../shared/components/Modal/ui/modal';
import { SearchInput } from '../../../../../shared/components/Search/ui/search-input';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../../../shared/components/Select/ui/select-with-search';
import { UserData } from './user-data';
import { ApproveUserForm } from './approve-user-form';
import { RejectUserForm } from './reject-user-form';
import { DetailUserModal } from './detail-user-modal';

import { getApproveUsersAction } from '../../../../../store/control/actions';
import {
	getDepartmentsAction,
	getRolesAction,
} from '../../../../../store/catalog/actions';
import {
	setCurrentApproveUser,
	openApproveModal,
	openRejectModal,
	openApproveDetailModal,
	closeModals,
} from '../../../../../store/control/reducer';
import { statusOptions } from '../../../lib/helpers';

import styles from '../styles/control-approve.module.scss';

export const ControlApprove: FC = () => {
	const dispatch = useDispatch();
	const {
		approveUsers,
		isOpenApproveModal,
		isOpenRejectModal,
		isOpenApproveDetailModal,
		isLoadingApprove,
	} = useSelector((state) => state.control);
	const { departments, isLoadingCatalog } = useSelector(
		(state) => state.catalog
	);

	const [currentStatus, setCurrentStatus] = useState<
		'submitted' | 'approved' | 'rejected'
	>('submitted');

	const [currentDepartment, setCurrentDepartment] =
		useState<IDepartment | null>(null);

	const [searchQuery, setSearchQuery] = useState('');

	const handleOpenApproveModal = (user: IApproveUser) => {
		dispatch(setCurrentApproveUser(user));
		dispatch(openApproveModal());
	};

	const handleOpenRejectModal = (user: IApproveUser) => {
		dispatch(setCurrentApproveUser(user));
		dispatch(openRejectModal());
	};

	const handleOpenDetailModal = (user: IApproveUser) => {
		dispatch(setCurrentApproveUser(user));
		dispatch(openApproveDetailModal());
	};

	const handleCloseModals = () => {
		dispatch(closeModals());
	};

	const handleChangeStatus = (option: IStatusOption | null) => {
		setCurrentStatus(option?.id ?? 'submitted');
	};

	const filteredUsers = useMemo(() => {
		let result = approveUsers;

		if (searchQuery.trim()) {
			result = result.filter((user) =>
				user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		result = result.filter((user) => user.status === currentStatus);

		if (currentDepartment) {
			result = result.filter(
				(user) => user.department?.id === currentDepartment.id
			);
		}

		return result;
	}, [approveUsers, searchQuery, currentStatus, currentDepartment]);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const loadData = () => {
			dispatch(getApproveUsersAction());
			dispatch(getDepartmentsAction());
			dispatch(getRolesAction());
		};

		loadData();

		const scheduleNextUpdate = () => {
			const now = new Date();

			const nextUpdate = new Date();

			nextUpdate.setHours(6, 0, 0, 0);

			if (now >= nextUpdate) {
				nextUpdate.setDate(nextUpdate.getDate() + 1);
			}

			const delay = nextUpdate.getTime() - now.getTime();

			timeoutId = setTimeout(() => {
				loadData();
				scheduleNextUpdate();
			}, delay);
		};

		scheduleNextUpdate();

		return () => clearTimeout(timeoutId);
	}, [dispatch]);

	if (isLoadingApprove || isLoadingCatalog) {
		return <Preloader />;
	}

	if (!approveUsers.length && !isLoadingApprove) {
		return <p>Нет пользователей для одобрения.</p>;
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<SearchInput
					placeholder='Поиск по фамилии...'
					value={searchQuery}
					onChange={setSearchQuery}
				/>
				<SelectWithSearch
					placeholder='Поиск по подразделению..'
					currentOption={currentDepartment}
					options={departments}
					onChooseOption={setCurrentDepartment}
				/>
				<Select
					currentOption={
						statusOptions.find((option) => option.id === currentStatus) ?? null
					}
					options={statusOptions}
					onChooseOption={handleChangeStatus}
					width='default'
					withClear={false}
				/>
			</div>
			<ul className={styles.list}>
				{filteredUsers.map((user: IApproveUser) => (
					<li className={styles.item} key={user.id}>
						<UserData user={user} />
						{user.status === 'submitted' ? (
							<div className={styles.buttons}>
								<Button
									text='Отклонить'
									onClick={() => handleOpenRejectModal(user)}
									color='red'
									withIcon={{
										type: 'cancel',
										color: 'white',
										position: 'left',
									}}
								/>
								<Button
									text='Одобрить'
									onClick={() => handleOpenApproveModal(user)}
									color='green'
									withIcon={{ type: 'check', color: 'white', position: 'left' }}
								/>
							</div>
						) : (
							<div className={styles.buttons}>
								<Button
									text='Подробнее'
									onClick={() => handleOpenDetailModal(user)}
									withIcon={{ type: 'info', color: 'black', position: 'left' }}
								/>
							</div>
						)}
					</li>
				))}
			</ul>
			{isOpenApproveModal && (
				<Modal
					isOpen={isOpenApproveModal}
					onClose={handleCloseModals}
					title='Одобрить пользователя'>
					<ApproveUserForm />
				</Modal>
			)}
			{isOpenRejectModal && (
				<Modal
					isOpen={isOpenRejectModal}
					onClose={handleCloseModals}
					title='Отклонить пользователя'>
					<RejectUserForm />
				</Modal>
			)}
			{isOpenApproveDetailModal && (
				<Modal
					isOpen={isOpenApproveDetailModal}
					onClose={handleCloseModals}
					title='Информация о заявке'>
					<DetailUserModal />
				</Modal>
			)}
		</div>
	);
};
