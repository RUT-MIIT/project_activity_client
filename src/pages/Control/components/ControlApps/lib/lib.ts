export type TStatusFilter = {
	id: string;
	name: string;
};

export const statusOptions: TStatusFilter[] = [
	{ id: 'approved', name: 'Согласованные' },
	{ id: 'rejected', name: 'Отклоненные' },
	{ id: 'in_progress', name: 'В работе' },
];
