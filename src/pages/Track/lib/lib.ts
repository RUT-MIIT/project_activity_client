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

export interface IProject {
	id: number;
	title: string;
	company: string;
	author_name: string;
	author_email: string;
	tag: { name: string; id: number };
	print_number: string;
	img: string;
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

export const projects: IProject[] = [
	{
		id: 503,
		title: 'Интеллектуальная система мониторинга пассажиропотока',
		company: 'ОАО "РЖД"',
		author_name: 'Костюлин Иван Алексеевич',
		author_email: 'ivav-kostyulin@yandex.ru',
		tag: { name: 'Транспорт', id: 23 },
		print_number: '26-00301',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 504,
		title: 'Оптимизация расписания пригородных поездов',
		company: 'ОАО "РЖД"',
		author_name: 'Смирнов Артём Павлович',
		author_email: 'smirnov.artem@mail.ru',
		tag: { name: 'Логистика', id: 12 },
		print_number: '26-00302',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 505,
		title: 'Сервис прогнозирования загруженности вокзалов',
		company: 'АО "ТрансТех"',
		author_name: 'Егорова Мария Ильинична',
		author_email: 'egorova.mi@gmail.com',
		tag: { name: 'Аналитика', id: 18 },
		print_number: '26-00303',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 506,
		title: 'Платформа цифрового сопровождения грузоперевозок',
		company: 'ПАО "Совкомфлот"',
		author_name: 'Новиков Даниил Сергеевич',
		author_email: 'novikov.ds@yandex.ru',
		tag: { name: 'Цифровизация', id: 31 },
		print_number: '26-00304',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 507,
		title: 'Модель оценки риска транспортных задержек',
		company: 'ОАО "РЖД"',
		author_name: 'Фролова Алина Максимовна',
		author_email: 'frolova.alina@mail.ru',
		tag: { name: 'Безопасность', id: 9 },
		print_number: '26-00305',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 508,
		title: 'Система навигации для автономного транспорта',
		company: 'ООО "НавиСофт"',
		author_name: 'Морозов Кирилл Андреевич',
		author_email: 'morozov.ka@gmail.com',
		tag: { name: 'Беспилотный транспорт', id: 41 },
		print_number: '26-00306',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 509,
		title: 'Автоматизация управления транспортными потоками',
		company: 'АО "МосТранс"',
		author_name: 'Васильева Дарья Олеговна',
		author_email: 'vasileva.do@mail.ru',
		tag: { name: 'Smart City', id: 35 },
		print_number: '26-00307',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 510,
		title: 'Платформа анализа состояния железнодорожной инфраструктуры',
		company: 'ОАО "РЖД"',
		author_name: 'Петров Никита Евгеньевич',
		author_email: 'petrov.ne@yandex.ru',
		tag: { name: 'Инфраструктура', id: 27 },
		print_number: '26-00308',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 511,
		title: 'Система интеллектуального контроля перевозок',
		company: 'ООО "ТрансЛогик"',
		author_name: 'Кузнецова Виктория Романовна',
		author_email: 'kuznetsova.vr@gmail.com',
		tag: { name: 'Контроль', id: 15 },
		print_number: '26-00309',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 512,
		title: 'Мобильное приложение для цифрового маршрута пассажира',
		company: 'АО "Городские технологии"',
		author_name: 'Орлов Максим Игоревич',
		author_email: 'orlov.mi@mail.ru',
		tag: { name: 'Мобильные сервисы', id: 44 },
		print_number: '26-00310',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},

	// 11–30

	{
		id: 513,
		title: 'Цифровой двойник транспортного узла',
		company: 'ОАО "РЖД"',
		author_name: 'Лебедев Илья Дмитриевич',
		author_email: 'lebedev.id@mail.ru',
		tag: { name: 'Digital Twin', id: 51 },
		print_number: '26-00311',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 514,
		title: 'AI-система управления грузовыми потоками',
		company: 'ООО "Транс AI"',
		author_name: 'Соколова Полина Андреевна',
		author_email: 'sokolova.pa@gmail.com',
		tag: { name: 'Искусственный интеллект', id: 61 },
		print_number: '26-00312',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 515,
		title: 'Платформа предиктивного ремонта вагонов',
		company: 'ОАО "РЖД"',
		author_name: 'Жуков Андрей Николаевич',
		author_email: 'zhukov.an@yandex.ru',
		tag: { name: 'Предиктивная аналитика', id: 22 },
		print_number: '26-00313',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 516,
		title: 'Система контроля расхода топлива',
		company: 'АО "ТрансОйл"',
		author_name: 'Громова Анна Сергеевна',
		author_email: 'gromova.as@mail.ru',
		tag: { name: 'Энергетика', id: 71 },
		print_number: '26-00314',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 517,
		title: 'Автоматизированная система управления складом',
		company: 'ООО "Логистик+"',
		author_name: 'Титов Максим Денисович',
		author_email: 'titov.md@gmail.com',
		tag: { name: 'Складская логистика', id: 13 },
		print_number: '26-00315',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 518,
		title: 'Платформа мониторинга морских перевозок',
		company: 'ПАО "Совкомфлот"',
		author_name: 'Давыдова Ирина Олеговна',
		author_email: 'davydova.io@mail.ru',
		tag: { name: 'Морской транспорт', id: 48 },
		print_number: '26-00316',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 519,
		title: 'Система анализа ДТП на железнодорожных переездах',
		company: 'ОАО "РЖД"',
		author_name: 'Крылов Павел Викторович',
		author_email: 'krylov.pv@yandex.ru',
		tag: { name: 'Безопасность', id: 9 },
		print_number: '26-00317',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 520,
		title: 'Умная парковочная система',
		company: 'АО "Smart Urban"',
		author_name: 'Мельникова Софья Аркадьевна',
		author_email: 'melnikova.sa@gmail.com',
		tag: { name: 'Smart City', id: 35 },
		print_number: '26-00318',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 521,
		title: 'Система управления электрозарядными станциями',
		company: 'ООО "ЭнергоТранс"',
		author_name: 'Зайцев Кирилл Олегович',
		author_email: 'zaytsev.ko@mail.ru',
		tag: { name: 'Электротранспорт', id: 52 },
		print_number: '26-00319',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 522,
		title: 'Цифровая карта транспортной инфраструктуры',
		company: 'АО "GeoTech"',
		author_name: 'Федорова Алиса Евгеньевна',
		author_email: 'fedorova.ae@gmail.com',
		tag: { name: 'GIS', id: 81 },
		print_number: '26-00320',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 523,
		title: 'Платформа управления мультимодальными перевозками',
		company: 'ООО "Мультитранс"',
		author_name: 'Назаров Арсений Владиславович',
		author_email: 'nazarov.av@mail.ru',
		tag: { name: 'Логистика', id: 12 },
		print_number: '26-00321',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 524,
		title: 'Сервис анализа пассажирского спроса',
		company: 'АО "МосТранс"',
		author_name: 'Комарова Виктория Игоревна',
		author_email: 'komarova.vi@gmail.com',
		tag: { name: 'Big Data', id: 54 },
		print_number: '26-00322',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 525,
		title: 'Система контроля контейнерных перевозок',
		company: 'ПАО "ТрансКонтейнер"',
		author_name: 'Белов Денис Романович',
		author_email: 'belov.dr@mail.ru',
		tag: { name: 'Контейнерные перевозки', id: 66 },
		print_number: '26-00323',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 526,
		title: 'Интеллектуальная система светофорного регулирования',
		company: 'АО "Городские технологии"',
		author_name: 'Савельева Марина Павловна',
		author_email: 'saveleva.mp@gmail.com',
		tag: { name: 'Умный город', id: 58 },
		print_number: '26-00324',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 527,
		title: 'Платформа анализа грузовых терминалов',
		company: 'ООО "CargoTech"',
		author_name: 'Романов Илья Сергеевич',
		author_email: 'romanov.is@yandex.ru',
		tag: { name: 'Грузоперевозки', id: 24 },
		print_number: '26-00325',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 528,
		title: 'Система автоматического учёта пассажиров',
		company: 'ОАО "РЖД"',
		author_name: 'Тарасова Екатерина Ильинична',
		author_email: 'tarasova.ei@mail.ru',
		tag: { name: 'Транспорт', id: 23 },
		print_number: '26-00326',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 529,
		title: 'AI-модель прогнозирования пробок',
		company: 'ООО "Urban AI"',
		author_name: 'Виноградов Алексей Петрович',
		author_email: 'vinogradov.ap@gmail.com',
		tag: { name: 'AI', id: 62 },
		print_number: '26-00327',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 530,
		title: 'Сервис цифрового сопровождения пассажиров',
		company: 'АО "МосТранс"',
		author_name: 'Киселева Юлия Дмитриевна',
		author_email: 'kiseleva.yd@mail.ru',
		tag: { name: 'UX/UI', id: 75 },
		print_number: '26-00328',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 531,
		title: 'Платформа мониторинга транспортных рисков',
		company: 'ООО "SafeWay"',
		author_name: 'Николаев Сергей Андреевич',
		author_email: 'nikolaev.sa@yandex.ru',
		tag: { name: 'Risk Management', id: 92 },
		print_number: '26-00329',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
	{
		id: 532,
		title: 'Система анализа эффективности маршрутов',
		company: 'ОАО "РЖД"',
		author_name: 'Павлова Анастасия Викторовна',
		author_email: 'pavlova.av@gmail.com',
		tag: { name: 'Оптимизация', id: 39 },
		print_number: '26-00330',
		img: 'https://project-api.emiit.ru/media/projects/img66.png',
	},
];
