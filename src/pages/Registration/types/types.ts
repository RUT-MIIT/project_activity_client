export interface IRegistrationForm {
	lastName: string;
	firstName: string;
	middleName: string;
	email: string;
	phone: string;
	comment: string;
}

export type TRegistrationStep = 1 | 2 | 3;

export type TAuthMethod = 'student_card' | 'personnel_number' | 'snils';

export interface IAuthMethodOption {
	value: TAuthMethod;
	label: string;
	placeholder: string;
	info: string;
}
