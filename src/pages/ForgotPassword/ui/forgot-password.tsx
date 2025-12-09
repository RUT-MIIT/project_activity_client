import type { FC, FormEvent } from 'react';
import type { IForgotPasswordForm } from '../types/types';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { PublicLayout } from '../../../shared/components/Layout/PublicLayout/ui/public-layout';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
	FormLinks,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';

import { links, validationSchema, shouldBlockSubmit } from '../lib/helpers';
import { forgotPasswordAction } from '../../../store/user/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/forgot-password.module.scss';

export const ForgotPassword: FC = () => {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { isLoadingRequest } = useSelector((state) => state.user);
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);
	const { values, handleChange, errors } = useForm<IForgotPasswordForm>(
		{ email: '' },
		validationSchema
	);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isBlockSubmit) {
			try {
				await dispatch(forgotPasswordAction({ email: values.email })).unwrap();
				showToast({
					title: 'Пароль отправлено на указанную!',
					text: 'Для продолжения процедуры сброса пароля перейдтие по ссылку в письме.',
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Ошибка в запросе на сброс пароля',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	return (
		<PublicLayout>
			<main className={styles.container}>
				<Form
					name='form-forgot-password'
					onSubmit={handleSubmit}
					title='Запрос на сброс пароля'
					subtitle='Введите электронную почту для подтверждения вашего аккаунта'
					titleAlign='left'>
					<FormField
						title='Электронная почта'
						fieldError={{ text: errors.email || '', isShow: !!errors.email }}>
						<FormInput
							name='email'
							placeholder='Ваша электронная почта'
							value={values.email}
							onChange={handleChange}
						/>
					</FormField>
					<FormButtons>
						<Button
							type='submit'
							text='Отправить'
							width='full'
							color='blue'
							isBlock={isBlockSubmit || isLoadingRequest}
						/>
					</FormButtons>
				</Form>
				<FormLinks links={links} />
			</main>
		</PublicLayout>
	);
};
