import type { IResetPasswordForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import { required, minLength } from '../../../shared/lib/validationRules';

export const validationSchema = {
	new_password: [
		required('Введите новый пароль'),
		minLength(8, 'Пароль должен быть не менее 8 символов'),
	],
	repeat_password: [
		required('Повторите пароль'),
		minLength(8, 'Пароль должен быть не менее 8 символов'),
	],
};

export const shouldBlockSubmit = (
	values: IResetPasswordForm,
	errors: TFormValidationErrors
) => {
	return (
		!values.new_password.trim() ||
		!!errors.new_password ||
		!values.repeat_password.trim() ||
		!!errors.repeat_password ||
		values.new_password !== values.repeat_password
	);
};
