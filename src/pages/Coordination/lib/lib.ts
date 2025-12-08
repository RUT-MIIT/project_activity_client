export const sortOptions = [
	{ name: 'По дате', id: 1 },
	{ name: 'По имени', id: 2 },
	{ name: 'По автору', id: 3 },
	{ name: 'По номеру', id: 4 },
];

export const viewOptions = [
	{ id: 'cards', name: 'Плитка' },
	{ id: 'table', name: 'Таблица' },
];

export interface ISortOption {
	name: string;
	id: number;
}
