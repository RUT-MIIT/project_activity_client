import type { IForgotPasswordForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';
import { EPAGESROUTES } from '../../../shared/utils/routes';

import { required, emailFormat } from '../../../shared/lib/validationRules';

export const links = [
	{
		label: 'Вспомнили пароль?',
		text: 'Войти',
		url: EPAGESROUTES.LOGIN,
	},
];

export const validationSchema = {
	email: [
		required('Введите электронную почту'),
		emailFormat('Неверный формат электронной почты'),
	],
};

export const shouldBlockSubmit = (
	values: IForgotPasswordForm,
	errors: TFormValidationErrors
): boolean => {
	return !values.email.trim() || !!errors.email;
};
