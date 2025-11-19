import type { IRegistrationForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import {
	required,
	phoneFormat,
	emailFormat,
} from '../../../shared/lib/validationRules';

export const links = [
	{ label: 'Уже есть аккаунт?', text: 'Войти', url: '/login' },
];

export const validationSchema = {
	lastName: [required('Введите фамилию')],
	firstName: [required('Введите имя')],
	middleName: [required('Введите отчество')],
	email: [
		required('Введите электронную почту'),
		emailFormat('Неверный формат электронной почты'),
	],
	phone: [
		required('Введите номер телефона'),
		phoneFormat('Неверный формат номера телефона'),
	],
	comment: [],
};

export const initialRegistrationValues: IRegistrationForm = {
	lastName: '',
	firstName: '',
	middleName: '',
	email: '',
	phone: '',
	comment: '',
};

export const shouldBlockSubmit = (
	values: IRegistrationForm,
	errors: TFormValidationErrors
): boolean => {
	return (
		!values.lastName.trim() ||
		!!errors.lastName ||
		!values.firstName.trim() ||
		!!errors.firstName ||
		!values.middleName.trim() ||
		!!errors.middleName ||
		!values.email.trim() ||
		!!errors.email ||
		!values.phone.trim() ||
		!!errors.phone
	);
};
