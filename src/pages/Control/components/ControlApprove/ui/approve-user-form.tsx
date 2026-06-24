import type { FC, FormEvent } from 'react';
import type { IDepartment, IRole } from '../../../../../store/catalog/types';

import { useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import { Form } from '../../../../../shared/components/Form/ui/form';
import {
	FormField,
	FormButtons,
} from '../../../../../shared/components/Form/components';
import { Button } from '../../../../../shared/components/Button/ui/button';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../../../shared/components/Select/ui/select-with-search';
import { UserData } from './user-data';

import { approveUserAction } from '../../../../../store/control/actions';

import styles from '../styles/control-approve.module.scss';

export const ApproveUserForm: FC = () => {
	const dispatch = useDispatch();
	const { currentApproveUser, isLoadingRequest } = useSelector(
		(state) => state.control
	);
	const { departments, roles } = useSelector((state) => state.catalog);
	const [department, setDepartment] = useState<IDepartment | null>(
		currentApproveUser?.department || null
	);
	const [role, setRole] = useState<IRole | null>(null);

	const handleChangeDepartment = (selected: IDepartment | null) => {
		setDepartment(selected);
	};

	const handleChangeRole = (selected: IRole | null) => {
		setRole(selected);
	};

	const isBlockSubmit = !department || !role;

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isBlockSubmit) {
			return;
		}

		if (currentApproveUser) {
			const payload = {
				userId: currentApproveUser.id,
				role_id: role.code,
				department_id: department.id,
			};

			dispatch(approveUserAction(payload));
		}
	};

	if (!currentApproveUser) {
		return <p>Пользователь не найден!</p>;
	}

	return (
		<div className={styles.form}>
			<UserData user={currentApproveUser} />
			<Form
				name='form-control-user-approve'
				onSubmit={handleSubmit}
				formWidth='large'>
				<FormField title='Выберите подразделение'>
					<SelectWithSearch
						options={departments}
						currentOption={department}
						onChooseOption={handleChangeDepartment}
					/>
				</FormField>
				<FormField title='Выберите роль' withMarginBottom>
					<Select
						options={roles}
						currentOption={role}
						onChooseOption={handleChangeRole}
						valueKey='code'
						labelKey='name'
					/>
				</FormField>
				<FormButtons>
					<Button
						type='submit'
						text='Одобрить'
						isBlock={isBlockSubmit || isLoadingRequest}
					/>
				</FormButtons>
			</Form>
		</div>
	);
};
