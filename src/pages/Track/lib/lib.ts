import type { ITab } from '../../../shared/components/Tabs/types/types';

export const tabs: ITab[] = [
	{
		label: 'Создание',
		path: '/track/tabs/create',
	},
	{
		label: 'Просмотр',
		path: '/track/tabs/view',
	},
];

export interface IDirection {
	id: number;
	name: string;
}

export interface ICourse {
	id: number;
	name: string;
}

export interface IGroup {
	id: number;
	courseId: number;
	directionId: number;
	name: string;
}

export const directions: IDirection[] = [
	{
		id: 1,
		name: 'Тестовое направление 1',
	},
	{
		id: 2,
		name: 'Тестовое направление 2',
	},
	{
		id: 3,
		name: 'Тестовое направление 3',
	},
	{
		id: 4,
		name: 'Тестовое направление 4',
	},
];

export const courses: ICourse[] = [
	{
		id: 1,
		name: 'Первый курс',
	},
	{
		id: 2,
		name: 'Второй курс',
	},
	{
		id: 3,
		name: 'Третий курс',
	},
	{
		id: 4,
		name: 'Четвертый курс',
	},
	{
		id: 5,
		name: 'Пятый курс',
	},
];

export const groups: IGroup[] = [
	{ id: 1, name: 'ЭББ-411', courseId: 4, directionId: 1 },
	{ id: 2, name: 'ИС-221', courseId: 2, directionId: 2 },
	{ id: 3, name: 'ПМИ-331', courseId: 3, directionId: 3 },
	{ id: 4, name: 'ИБ-141', courseId: 1, directionId: 4 },
	{ id: 5, name: 'АСУ-511', courseId: 5, directionId: 1 },
	{ id: 6, name: 'МТ-421', courseId: 4, directionId: 2 },
	{ id: 7, name: 'ТМО-311', courseId: 3, directionId: 3 },
	{ id: 8, name: 'ЭББ-212', courseId: 2, directionId: 4 },
	{ id: 9, name: 'ИС-112', courseId: 1, directionId: 1 },
	{ id: 10, name: 'ПМИ-522', courseId: 5, directionId: 2 },

	{ id: 11, name: 'ИБ-431', courseId: 4, directionId: 3 },
	{ id: 12, name: 'АСУ-231', courseId: 2, directionId: 4 },
	{ id: 13, name: 'МТ-321', courseId: 3, directionId: 1 },
	{ id: 14, name: 'ТМО-121', courseId: 1, directionId: 2 },
	{ id: 15, name: 'ЭББ-541', courseId: 5, directionId: 3 },
	{ id: 16, name: 'ИС-412', courseId: 4, directionId: 4 },
	{ id: 17, name: 'ПМИ-222', courseId: 2, directionId: 1 },
	{ id: 18, name: 'ИБ-332', courseId: 3, directionId: 2 },
	{ id: 19, name: 'АСУ-132', courseId: 1, directionId: 3 },
	{ id: 20, name: 'МТ-552', courseId: 5, directionId: 4 },

	{ id: 21, name: 'ТМО-413', courseId: 4, directionId: 1 },
	{ id: 22, name: 'ЭББ-213', courseId: 2, directionId: 2 },
	{ id: 23, name: 'ИС-323', courseId: 3, directionId: 3 },
	{ id: 24, name: 'ПМИ-123', courseId: 1, directionId: 4 },
	{ id: 25, name: 'ИБ-533', courseId: 5, directionId: 1 },
	{ id: 26, name: 'АСУ-423', courseId: 4, directionId: 2 },
	{ id: 27, name: 'МТ-223', courseId: 2, directionId: 3 },
	{ id: 28, name: 'ТМО-333', courseId: 3, directionId: 4 },
	{ id: 29, name: 'ЭББ-133', courseId: 1, directionId: 1 },
	{ id: 30, name: 'ИС-543', courseId: 5, directionId: 2 },
];
