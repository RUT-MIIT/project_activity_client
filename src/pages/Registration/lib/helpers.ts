import type { IRegistrationForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';
import type { IDepartment } from '../../../store/catalog/types';

import {
	required,
	phoneFormat,
	emailFormat,
} from '../../../shared/lib/validationRules';
import { EPAGESROUTES } from '../../../shared/utils/routes';

export const links = [
	{ label: 'Уже есть аккаунт?', text: 'Войти', url: EPAGESROUTES.LOGIN },
	/*
	{
		label: 'Вы не сотрудник РУТ (МИИТ)?',
		text: 'Подать заявку',
		url: EPAGESROUTES.APPLY,
	},
	*/
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
	errors: TFormValidationErrors,
	department: IDepartment | null
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
		!!errors.phone ||
		!department
	);
};
