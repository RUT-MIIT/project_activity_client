import type { IEditAppForm } from '../types/types';
import type { TFormValidationErrors } from '../../../shared/components/Form/types/types';

import { required } from '../../../shared/lib/validationRules';

export const validationSchema = {
	title: [required('Введите название')],
	company: [required('Введите описание')],
	company_contacts: [required('Введите компанию')],
	project_level: [required('Введите компанию')],
	problem_holder: [required('Введите компанию')],
	goal: [required('Введите компанию')],
	barrier: [required('Введите компанию')],
	existing_solutions: [required('Введите компанию')],
	context: [required('Введите компанию')],
	recommended_tools: [required('Введите компанию')],
	stakeholders: [required('Введите компанию')],
	experts: [required('Введите компанию')],
	additional_materials: [required('Введите компанию')],
};

export const initialAppValues: IEditAppForm = {
	author_lastname: '',
	author_firstname: '',
	author_middlename: '',
	author_email: '',
	author_phone: '',
	author_role: '',
	author_division: '',
	title: '',
	company: '',
	company_contacts: '',
	project_level: null,
	target_institutes: [],
	problem_holder: '',
	goal: '',
	barrier: '',
	existing_solutions: '',
	context: '',
	recommended_tools: '',
	stakeholders: '',
	experts: '',
	tags: null,
	additional_materials: '',
	track_composer_comment: '',
	recommended_teams_count: 3,
};

export const shouldBlockSubmit = (
	values: IEditAppForm,
	errors: TFormValidationErrors
): boolean => {
	return (
		!values.title.trim() ||
		!!errors.title ||
		!values.company.trim() ||
		!!errors.company ||
		!values.company_contacts.trim() ||
		!!errors.company_contacts ||
		values.recommended_teams_count < 1 ||
		!!errors.recommended_teams_count
	);
};
