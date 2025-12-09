import type { FC, FormEvent } from 'react';

import { useSelector } from '../../../store/store';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInputStub,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';

import { convertRole } from '../../../shared/lib/role';

export const UserEditForm: FC = () => {
	const { user } = useSelector((state) => state.user);

	const isBlockSubmit = true;

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isBlockSubmit) {
			return;
		}
	};

	if (!user) {
		return <p>Пользователь не найден!</p>;
	}

	return (
		<Form name='user-edit-form' onSubmit={handleSubmit} formWidth='large'>
			<FormField title='Пользователь'>
				<FormInputStub
					value={`${user.last_name} ${user.first_name} ${user.middle_name}`}
				/>
			</FormField>
			<FormField title='Электронная почта'>
				<FormInputStub value={user.email} />
			</FormField>
			<FormField title='Мобильный телефон'>
				<FormInputStub value={user.phone} />
			</FormField>
			<FormField title='Подразделение'>
				<FormInputStub value={user.department.name} />
			</FormField>
			<FormField title='Роль в системе'>
				<FormInputStub value={convertRole(user.role)} />
			</FormField>
			<FormField title='Статус учетной записи'>
				<FormInputStub value='Активна' />
			</FormField>
			<FormButtons>
				<Button type='submit' text='Сохранить' isBlock={isBlockSubmit} />
			</FormButtons>
		</Form>
	);
};
