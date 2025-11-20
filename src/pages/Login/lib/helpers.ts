import type { ILoginForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';
import { EPAGESROUTES } from '../../../shared/utils/routes';

import {
	required,
	minLength,
	emailFormat,
} from '../../../shared/lib/validationRules';

export const links = [
	{
		label: 'Новый пользователь?',
		text: 'Регистрация',
		url: EPAGESROUTES.REGISTRATION,
	},
];

export const validationSchema = {
	email: [
		required('Введите электронную почту'),
		emailFormat('Неверный формат электронной почты'),
	],
	password: [
		required('Введите пароль'),
		minLength(6, 'Пароль должен быть не менее 6 символов'),
	],
};

export const shouldBlockSubmit = (
	values: ILoginForm,
	errors: TFormValidationErrors
): boolean => {
	return (
		!values.email.trim() ||
		!!errors.email ||
		!values.password.trim() ||
		!!errors.password
	);
};
