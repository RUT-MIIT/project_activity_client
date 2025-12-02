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

export interface ICompanyType {
	id: number;
	name: string;
}

export const companyTypes: ICompanyType[] = [
	{ id: 1, name: 'Внутренний заказчик' },
	{ id: 2, name: 'Внешний заказчик' },
];
