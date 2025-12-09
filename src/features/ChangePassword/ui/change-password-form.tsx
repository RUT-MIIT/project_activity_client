import type { FC, FormEvent } from 'react';
import type {
	IChangePasswordForm,
	IChangePasswordFormProps,
} from '../types/types';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';

import { validationSchema, shouldBlockSubmit } from '../lib/helpers';
import { changePasswordAction } from '../../../store/user/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

export const ChangePasswordForm: FC<IChangePasswordFormProps> = ({
	onSuccess,
}) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { isLoadingRequest } = useSelector((state) => state.user);
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);
	const { values, handleChange, errors } = useForm<IChangePasswordForm>(
		{ old_password: '', new_password: '', repeat_password: '' },
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isBlockSubmit) {
			try {
				await dispatch(
					changePasswordAction({
						current_password: values.old_password,
						new_password: values.new_password,
					})
				).unwrap();

				showToast({
					title: 'Пароль успешно изменён!',
					text: 'Ваш новый пароль сохранён.',
					type: 'success',
				});
				onSuccess?.();
			} catch (err) {
				showToast({
					title: 'Ошибка при смене пароля',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const repeatPasswordError =
		values.repeat_password && values.repeat_password !== values.new_password
			? 'Пароли не совпадают'
			: errors.repeat_password || '';

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	return (
		<Form
			name='change-password-form'
			autoComplete='off'
			onSubmit={handleSubmit}>
			<FormField
				title='Старый пароль'
				fieldError={{
					text: errors.old_password || '',
					isShow: !!errors.old_password,
				}}>
				<FormInput
					type='password'
					name='old_password'
					placeholder='Введите старый пароль'
					value={values.old_password}
					onChange={handleChange}
					autoComplete='off'
				/>
			</FormField>

			<FormField
				title='Новый пароль'
				fieldError={{
					text: errors.new_password || '',
					isShow: !!errors.new_password,
				}}>
				<FormInput
					type='password'
					name='new_password'
					placeholder='Введите новый пароль'
					value={values.new_password}
					onChange={handleChange}
					autoComplete='off'
				/>
			</FormField>

			<FormField
				title='Повторите пароль'
				fieldError={{
					text: repeatPasswordError,
					isShow: !!repeatPasswordError,
				}}>
				<FormInput
					type='password'
					name='repeat_password'
					placeholder='Повторите новый пароль'
					value={values.repeat_password}
					onChange={handleChange}
					autoComplete='off'
				/>
			</FormField>
			<FormButtons>
				<Button
					type='submit'
					text='Сохранить'
					width='full'
					color='blue'
					isBlock={isBlockSubmit || isLoadingRequest}
				/>
			</FormButtons>
		</Form>
	);
};
