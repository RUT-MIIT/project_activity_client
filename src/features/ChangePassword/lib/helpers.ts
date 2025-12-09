import type { IChangePasswordForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import { required, minLength } from '../../../shared/lib/validationRules';

export const validationSchema = {
	old_password: [
		required('Введите старый пароль'),
		minLength(8, 'Пароль должен быть не менее 8 символов'),
	],
	new_password: [
		required('Введите новый пароль'),
		minLength(8, 'Пароль должен быть не менее 8 символов'),
	],
	repeat_password: [
		required('Повторите новый пароль'),
		minLength(8, 'Пароль должен быть не менее 8 символов'),
	],
};

export const shouldBlockSubmit = (
	values: IChangePasswordForm,
	errors: TFormValidationErrors
): boolean => {
	const passwordsMatch = values.new_password === values.repeat_password;

	return (
		!values.new_password.trim() ||
		!!errors.new_password ||
		!values.old_password.trim() ||
		!!errors.old_password ||
		!values.repeat_password.trim() ||
		!!errors.repeat_password ||
		!passwordsMatch
	);
};
