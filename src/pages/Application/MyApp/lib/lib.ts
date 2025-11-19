export const sortOptions = [
	{ name: 'По дате', id: 1 },
	{ name: 'По статусу', id: 2 },
	{ name: 'По имени', id: 3 },
];

export interface ISortOption {
	name: string;
	id: number;
}
