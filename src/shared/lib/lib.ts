export interface IProjectLevel {
	id: number;
	name: string;
}

export const projectLevels: IProjectLevel[] = [
	{ id: 1, name: 'Учебный' },
	{ id: 2, name: 'Учебно-прикладной' },
	{ id: 3, name: 'Прикладной' },
];

export interface IAuthorCategory {
	id: number;
	name: string;
}

export const authorCategories: IAuthorCategory[] = [
	{ id: 1, name: 'Работник РУТ (МИИТ)' },
	{ id: 2, name: 'Представитель компании' },
];

export type TCustomerType = 'internal' | 'representative' | 'external';

export interface ICompanyType {
	id: TCustomerType;
	name: string;
}

export const companyTypes: ICompanyType[] = [
	{ id: 'internal', name: 'Внутренний заказчик' },
	{ id: 'representative', name: 'Через представителя' },
	{ id: 'external', name: 'Внешний заказчик' },
];

export const isInternalCustomer = (type?: TCustomerType | null) =>
	type === 'internal';

export type TApplicationKind = 'project' | 'case';

export interface IApplicationKind {
	id: TApplicationKind;
	name: string;
}

export const applicationKinds: IApplicationKind[] = [
	{ id: 'project', name: 'Обычная заявка' },
	{ id: 'case', name: 'Заявка-кейс' },
];

export const PROJECT_PROBLEM_FIELDS = [
	'problem_holder',
	'goal',
	'barrier',
	'existing_solutions',
] as const;

export const getApplicationKind = (kind?: string | null): TApplicationKind =>
	kind === 'case' ? 'case' : 'project';

export const isCaseApplication = (kind?: string | null) =>
	getApplicationKind(kind) === 'case';

export const pickApplicationKind = (item: {
	application_kind?: string | null;
	applicationKind?: string | null;
}) => getApplicationKind(item.application_kind ?? item.applicationKind);

export const pickCaseDescription = (item: {
	case_description?: string | null;
	caseDescription?: string | null;
}) => item.case_description ?? item.caseDescription ?? '';

export const getApplicationKindPayload = (
	kind: TApplicationKind | undefined,
	fields: {
		problem_holder: string;
		goal: string;
		barrier: string;
		existing_solutions: string;
		case_description: string;
	}
) => {
	if (kind === 'case') {
		return {
			application_kind: 'case' as const,
			case_description: fields.case_description,
		};
	}

	return {
		application_kind: 'project' as const,
		problem_holder: fields.problem_holder,
		goal: fields.goal,
		barrier: fields.barrier,
		existing_solutions: fields.existing_solutions,
	};
};
