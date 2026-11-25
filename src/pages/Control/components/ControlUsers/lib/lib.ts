export const getRoleColor = (roleCode?: string) => {
	switch (roleCode) {
		case 'cpds':
			return 'purple';

		case 'department_validator':
			return 'yellow';

		case 'institute_validator':
			return 'blue';

		case 'mentor':
			return 'green';

		case 'user':
			return 'grey';

		default:
			return 'grey';
	}
};

export const getRoleText = (roleCode?: string) => {
	switch (roleCode) {
		case 'cpds':
			return 'Сотрудник ЦПДС';

		case 'department_validator':
			return 'Представитель кафедры';

		case 'institute_validator':
			return 'Ответственный от института';

		case 'mentor':
			return 'Сотрудник РУТ(МИИТ)';

		case 'user':
			return 'Пользователь';

		default:
			return 'Пользователь';
	}
};

export const roleOptions = [
	{ id: 'cpds', name: 'Сотрудник ЦПДС' },
	{ id: 'department_validator', name: 'Представитель кафедры' },
	{ id: 'institute_validator', name: 'Ответственный от института' },
	{ id: 'mentor', name: 'Сотрудник РУТ(МИИТ)' },
];

export const structureRoleOptions = [
	{ id: 'user', name: 'Пользователь' },
	{ id: 'department_validator', name: 'Представитель кафедры' },
	{ id: 'institute_validator', name: 'Ответственный от института' },
	{ id: 'mentor', name: 'Сотрудник РУТ(МИИТ)' },
];

export type TRoleOptions =
	| (typeof roleOptions)[number]
	| (typeof structureRoleOptions)[number];
