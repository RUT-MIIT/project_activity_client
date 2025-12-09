import type { FC, FormEvent } from 'react';
import type { IResetPasswordForm } from './types/types';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../store/store';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../shared/components/ToastProvider/ui/ToastProvider';

import { PublicLayout } from '../../shared/components/Layout/PublicLayout/ui/public-layout';
import { Form } from '../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../shared/components/Form/components';
import { Button } from '../../shared/components/Button/ui/button';

import { resetPasswordAction } from '../../store/user/actions';
import { validationSchema, shouldBlockSubmit } from './lib/helpers';
import { getErrorMessage } from '../../shared/lib/getErrorMessage';

import styles from './styles/reset-password.module.scss';

export const ResetPassword: FC = () => {
	const { uid, token } = useParams<{ uid: string; token: string }>();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const { isLoadingRequest } = useSelector((state) => state.user);
	const [isBlockSubmit, setIsBlockSubmit] = useState(true);
	const { values, handleChange, errors } = useForm<IResetPasswordForm>(
		{ new_password: '', repeat_password: '' },
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isBlockSubmit && uid && token) {
			try {
				await dispatch(
					resetPasswordAction({ uid, token, new_password: values.new_password })
				).unwrap();
				showToast({
					title: 'Пароль успешно сброшен',
					text: 'Вы можете войти с новым паролем',
					type: 'success',
				});
				navigate('/login');
			} catch (err) {
				showToast({
					title: 'Ошибка при сбросе пароля',
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
		<PublicLayout>
			<main className={styles.container}>
				<Form
					name='reset-password-form'
					onSubmit={handleSubmit}
					title='Сброс пароля'>
					<FormField
						title='Новый пароль'
						fieldError={{
							text: errors.new_password || '',
							isShow: !!errors.new_password,
						}}>
						<FormInput
							type='password'
							name='new_password'
							value={values.new_password}
							onChange={handleChange}
							placeholder='Введите новый пароль'
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
							value={values.repeat_password}
							onChange={handleChange}
							placeholder='Повторите новый пароль'
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
			</main>
		</PublicLayout>
	);
};
