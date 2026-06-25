import type { FC, FormEvent } from 'react';
import type { IDepartment, IRole } from '../../../../../store/catalog/types';

import { useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';
import { useToast } from '../../../../../shared/components/ToastProvider/ui/ToastProvider';

import { Form } from '../../../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../../../../shared/components/Form/components';
import { Button } from '../../../../../shared/components/Button/ui/button';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../../../shared/components/Select/ui/select-with-search';

import { editUserAction } from '../../../../../store/control/actions';
import { getErrorMessage } from '../../../../../shared/lib/getErrorMessage';

export const EditUserForm: FC = () => {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { currentUser, isLoadingRequest } = useSelector(
		(state) => state.control
	);

	const { departments, roles } = useSelector((state) => state.catalog);

	const [email, setEmail] = useState(currentUser?.email || '');
	const [phone, setPhone] = useState(currentUser?.phone || '');

	const [department, setDepartment] = useState<IDepartment | null>(
		currentUser?.department || null
	);

	const [role, setRole] = useState<IRole | null>(currentUser?.role || null);

	const handleChangeDepartment = (selected: IDepartment | null) => {
		setDepartment(selected);
	};

	const handleChangeRole = (selected: IRole | null) => {
		setRole(selected);
	};

	const isBlockSubmit = !department || !role || !email.trim();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isBlockSubmit || !currentUser) {
			return;
		}

		try {
			await dispatch(
				editUserAction({
					userId: currentUser.id,
					department_id: department.id,
					role: role.code,
					email: email.trim(),
					phone: phone.trim(),
				})
			).unwrap();

			showToast({
				title: 'Данные пользователя обновлены',
				text: 'Изменения успешно сохранены.',
				type: 'success',
			});
		} catch (err) {
			console.error(err);

			showToast({
				title: 'Не удалось обновить данные пользователя',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	if (!currentUser) {
		return <p>Пользователь не найден!</p>;
	}

	return (
		<Form
			name='form-control-user-edit'
			onSubmit={handleSubmit}
			formWidth='large'>
			<FormField title='Электронная почта'>
				<FormInput
					name='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormField>

			<FormField title='Номер телефона'>
				<FormInput
					name='phone'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
				/>
			</FormField>

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
					text='Сохранить'
					isBlock={isBlockSubmit || isLoadingRequest}
				/>
			</FormButtons>
		</Form>
	);
};
