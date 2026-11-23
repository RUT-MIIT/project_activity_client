import type { IWorkflowEvent } from '../types/events';
import type { ITaskMember, IWorkflowTask } from '../types/tasks';

export const mockProject = {
	title: 'Обходчик',
	company: 'Центральная дирекция инфраструктуры ОАО «РЖД»',
	project_level: 'Учебно-прикладной',
	problem_holder:
		'Начальник участка диагностики пути, отвечающий за своевременное выявление дефектов путевого полотна.',
	goal: 'Сократить время обнаружения критических дефектов пути и повысить полноту обхода за счёт цифрового сопровождения инспектора.',
	barrier:
		'Слишком трудоёмкий ручной обход: осмотр большого участка пути занимает смену и зависит от внимания конкретного работника.',
	existing_solutions:
		'Бумажные чек-листы и фотофиксация с телефона. Не дают единого журнала дефектов и плохо стыкуются с графиком работ дистанции.',
	context: 'Инфраструктура железнодорожного транспорта, диагностика пути.',
	stakeholders:
		'Дистанция пути, служба диагностики, наставник команды, представители заказчика.',
	recommended_tools: 'Веб-прототип, мобильная фиксация, таблицы и схемы участка.',
	experts: 'Наставник кафедры, представитель заказчика по диагностике пути.',
};

export const mockProjectTemplates = [
	{
		id: 1,
		name: 'Шаблон описания текущего процесса.docx',
		size: '86 КБ',
		kind: 'Шаблон',
	},
	{
		id: 2,
		name: 'Карта стейкхолдеров.xlsx',
		size: '124 КБ',
		kind: 'Шаблон',
	},
	{
		id: 3,
		name: 'Критерии контрольной точки.pdf',
		size: '410 КБ',
		kind: 'Методика',
	},
	{
		id: 4,
		name: 'Чек-лист подготовки к защите.pdf',
		size: '190 КБ',
		kind: 'Чек-лист',
	},
	{
		id: 5,
		name: 'Шаблон презентации проекта.pptx',
		size: '2,1 МБ',
		kind: 'Шаблон',
	},
];

export const mockProgress = {
	currentStage: 'Анализ ситуации',
	currentStageValue: 2,
	currentStageMax: 5,
	overallValue: 38,
	overallMax: 100,
};

export const mockTeamMembers: ITaskMember[] = [
	{ id: 1, fullName: 'Соколов Артём', role: 'leader' },
	{ id: 2, fullName: 'Морозова Анна', role: 'member' },
	{ id: 3, fullName: 'Кузнецов Павел', role: 'mentor' },
];

export const mockMentorProfile = {
	id: 3,
	firstName: 'Павел',
	lastName: 'Кузнецов',
	middleName: 'Игоревич',
	position: 'Наставник команды',
	email: 'p.kuznetsov@university.ru',
	phone: '8 (999) 123-45-67',
	academicDegree: 'Кандидат технических наук',
	academicTitle: 'Доцент',
};

export const mockTasks: IWorkflowTask[] = [
	{
		id: 1,
		title: 'Изучить исходное описание проекта',
		description:
			'Разобрать заявку заказчика и зафиксировать ключевые условия обхода пути.',
		stageId: 1,
		status: 'done',
		assigneeIds: [1],
		startAt: '2026-11-03',
		dueAt: '2026-11-07',
		comments: [
			{
				id: 1,
				author: 'Соколов Артём',
				authorRole: 'leader',
				text: 'Описание проекта разобрали на встрече команды.',
				createdAt: '07.11.2026',
			},
		],
		files: [
			{
				id: 1,
				name: 'Описание_проекта.pdf',
				size: '1,2 МБ',
				uploadedAt: '07.11.2026',
				author: 'Соколов Артём',
			},
		],
		links: [],
		history: [
			{ id: 1, text: 'Задача создана', createdAt: '03.11.2026' },
			{ id: 2, text: 'Статус изменён на «Выполнено»', createdAt: '07.11.2026' },
		],
	},
	{
		id: 2,
		title: 'Определить проблему и целевую аудиторию',
		description:
			'Сформулировать барьер, целевое состояние и список заинтересованных сторон.',
		stageId: 1,
		status: 'done',
		assigneeIds: [2],
		dueAt: '2026-11-12',
		comments: [],
		files: [],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '05.11.2026' }],
	},
	{
		id: 3,
		title: 'Проанализировать требования заказчика',
		description:
			'Собрать обязательные требования к цифровому журналу дефектов.',
		stageId: 1,
		status: 'in_progress',
		assigneeIds: [1, 2],
		startAt: '2026-11-13',
		dueAt: '2026-11-21',
		comments: [
			{
				id: 1,
				author: 'Кузнецов Павел',
				authorRole: 'mentor',
				text: 'Уточните, какие дефекты заказчик считает критическими.',
				createdAt: '14.11.2026',
			},
		],
		files: [],
		links: [{ id: 1, label: 'Бриф заказчика', url: 'https://example.com' }],
		history: [{ id: 1, text: 'Задача создана', createdAt: '13.11.2026' }],
	},
	{
		id: 4,
		title: 'Распределить обязанности между участниками',
		description: 'Зафиксировать роли на ближайшие две недели работы.',
		stageId: 1,
		status: 'todo',
		assigneeIds: [1],
		dueAt: '2026-11-20',
		comments: [],
		files: [],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '17.11.2026' }],
	},
	{
		id: 5,
		title: 'Провести поиск существующих решений',
		description:
			'Собрать аналоги цифровых журналов осмотра и сравнить ограничения.',
		stageId: 2,
		status: 'in_progress',
		assigneeIds: [2],
		startAt: '2026-11-17',
		dueAt: '2026-11-25',
		comments: [],
		files: [
			{
				id: 1,
				name: 'Подборка_аналогов.xlsx',
				size: '340 КБ',
				uploadedAt: '17.11.2026',
				author: 'Морозова Анна',
			},
		],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '17.11.2026' }],
	},
	{
		id: 6,
		title: 'Рассмотреть варианты концепции решения',
		description: 'Описать 2–3 сценария сопровождения инспектора на обходе.',
		stageId: 2,
		status: 'todo',
		assigneeIds: [1, 2],
		dueAt: '2026-11-28',
		comments: [],
		files: [],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '18.11.2026' }],
	},
	{
		id: 7,
		title: 'Подготовить описание предлагаемого решения',
		description: 'Собрать выбранную концепцию в короткий документ для наставника.',
		stageId: 2,
		status: 'todo',
		assigneeIds: [1],
		dueAt: '2026-12-02',
		comments: [],
		files: [],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '18.11.2026' }],
	},
	{
		id: 8,
		title: 'Набросать структуру прототипа журнала дефектов',
		description: 'Определить экраны фиксации дефекта, списка и передачи в дистанцию.',
		stageId: 3,
		status: 'todo',
		assigneeIds: [2],
		dueAt: '2026-12-08',
		comments: [],
		files: [],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '18.11.2026' }],
	},
	{
		id: 9,
		title: 'Проверить соответствие реализации требованиям',
		description: 'Сверить прототип с исходными требованиями заказчика.',
		stageId: 3,
		status: 'review',
		assigneeIds: [1, 3],
		dueAt: '2026-12-12',
		comments: [
			{
				id: 1,
				author: 'Соколов Артём',
				authorRole: 'leader',
				text: 'Прототип готов к просмотру наставником.',
				createdAt: '18.11.2026',
			},
		],
		files: [],
		links: [],
		history: [
			{ id: 1, text: 'Задача создана', createdAt: '15.11.2026' },
			{
				id: 2,
				text: 'Статус изменён на «На проверке»',
				createdAt: '18.11.2026',
			},
		],
	},
	{
		id: 10,
		title: 'Собрать обратную связь от заказчика',
		description: 'Зафиксировать замечания после консультации 24 ноября.',
		stageId: 4,
		status: 'todo',
		assigneeIds: [1],
		dueAt: '2026-11-26',
		comments: [],
		files: [],
		links: [],
		history: [{ id: 1, text: 'Задача создана', createdAt: '18.11.2026' }],
	},
];

export const mockEvents: IWorkflowEvent[] = [
	{
		id: 1,
		type: 'checkpoint',
		title: 'Контрольная точка: погружение в контекст',
		startAt: '2026-10-30T14:00:00',
		description:
			'Команда представляет понимание контекста проекта и описание текущего процесса обхода.',
		resultRequirements:
			'Краткий отчёт о текущем процессе, список стейкхолдеров и формулировка барьера.',
		place: 'Центр проектной деятельности',
		format: 'offline',
		materials: [{ name: 'Шаблон отчёта по контрольной точке.pdf' }],
	},
	{
		id: 2,
		type: 'expert_pipe',
		title: 'Труба экспертов',
		startAt: '2026-11-10T15:00:00',
		description:
			'Консультация команды с внешними экспертами. Формат и состав участников уточняются.',
		extra: 'Подготовить вопросы по диагностике пути и текущему сценарию обхода.',
		format: 'offline',
		place: 'Центр проектной деятельности',
	},
	{
		id: 3,
		type: 'assessment',
		title: 'Оценка 360 градусов',
		startAt: '2026-11-17T09:00:00',
		endAt: '2026-11-21T18:00:00',
		assessmentKind: 'Оценка 360 градусов',
		description:
			'Участники команды заполняют форму взаимного оценивания. Форма доступна только в указанный период.',
		extra: 'Оцените вклад каждого участника и работу капитана команды.',
		relatedModuleLabel: 'Перейти к оцениванию',
		relatedModulePath: '/workflow/tasks',
	},
	{
		id: 4,
		type: 'customer_meeting',
		title: 'Встреча с заказчиком (перенесена)',
		startAt: '2026-11-19T12:00:00',
		status: 'cancelled',
		format: 'online',
		meetingUrl: 'https://teams.microsoft.com/l/meetup-join/mock',
		description: 'Встреча отменена. Новая дата будет назначена отдельно.',
	},
	{
		id: 5,
		type: 'customer_meeting',
		title: 'Согласование сценария интервью с заказчиком',
		startAt: '2026-11-20T14:00:00',
		format: 'offline',
		place: 'Аудитория 1230',
		description:
			'Команда согласовывает вопросы интервью и ожидаемый результат встречи с представителем заказчика.',
		extra: 'Взять черновик вопросов и фото участка пути.',
	},
	{
		id: 6,
		type: 'customer_meeting',
		title: 'Консультация с представителем заказчика',
		startAt: '2026-11-24T11:30:00',
		format: 'online',
		meetingUrl: 'https://teams.microsoft.com/l/meetup-join/mock',
		description:
			'Онлайн-встреча по текущему процессу обхода и требованиям к цифровому журналу дефектов.',
	},
	{
		id: 7,
		type: 'checkpoint',
		title: 'Контрольная точка: анализ ситуации',
		startAt: '2026-12-02T16:00:00',
		format: 'offline',
		place: 'Центр проектной деятельности',
		description:
			'Промежуточный контроль хода проекта. Команда показывает карту стейкхолдеров и целевое состояние.',
		resultRequirements:
			'Презентация на 7–10 минут и список открытых вопросов к заказчику.',
		materials: [{ name: 'Критерии контрольной точки.pdf' }],
	},
	{
		id: 8,
		type: 'expertise',
		title: 'Экспертиза промежуточных материалов',
		startAt: '2026-12-08T09:00:00',
		endAt: '2026-12-12T18:00:00',
		description:
			'Эксперты оценивают промежуточные материалы проекта по установленным критериям.',
		criteria:
			'Полнота описания проблемы, качество целевого состояния, обоснованность концепции.',
		materials: [{ name: 'Критерии экспертизы проекта.pdf' }],
	},
	{
		id: 9,
		type: 'defense',
		title: 'Защита проекта',
		startAt: '2026-12-18T10:00:00',
		format: 'offline',
		place: 'Аудитория 1230',
		description:
			'Итоговое представление результатов проектной деятельности перед комиссией.',
		preparation:
			'Презентация, прототип журнала дефектов и ответы на замечания экспертизы.',
		extra: 'Прибыть за 15 минут до начала. Формат выступления — 10 минут + вопросы.',
	},
];

export const mockActivity = [
	{
		id: 1,
		author: 'Соколов Артём',
		role: 'leader' as const,
		text: 'выполнил задачу «Изучить исходное описание проекта»',
		time: '07.11.2026, 16:20',
	},
	{
		id: 2,
		author: 'Морозова Анна',
		role: 'member' as const,
		text: 'загрузила файл «Фото_участка_пути.zip»',
		time: '16.11.2026, 11:04',
	},
	{
		id: 3,
		author: 'Кузнецов Павел',
		role: 'mentor' as const,
		text: 'оставил комментарий к задаче «Проанализировать требования заказчика»',
		time: '14.11.2026, 19:12',
	},
	{
		id: 4,
		author: 'Соколов Артём',
		role: 'leader' as const,
		text: 'создал задачу «Распределить обязанности между участниками»',
		time: '17.11.2026, 10:40',
	},
	{
		id: 5,
		author: 'Морозова Анна',
		role: 'member' as const,
		text: 'взяла в работу задачу «Провести поиск существующих решений»',
		time: '17.11.2026, 13:15',
	},
	{
		id: 6,
		author: 'Соколов Артём',
		role: 'leader' as const,
		text: 'перенёс задачу «Собрать обратную связь от заказчика» на этап тестирования',
		time: '18.11.2026, 09:05',
	},
	{
		id: 7,
		author: 'Морозова Анна',
		role: 'member' as const,
		text: 'прикрепила файл «Подборка_аналогов.xlsx»',
		time: '17.11.2026, 18:40',
	},
	{
		id: 8,
		author: 'Кузнецов Павел',
		role: 'mentor' as const,
		text: 'изменил срок задачи «Проанализировать требования заказчика»',
		time: '18.11.2026, 10:12',
	},
];

export const mockFiles = [
	{
		id: 1,
		name: 'Описание_текущего_процесса.pdf',
		size: '1,2 МБ',
		uploadedAt: '17.11.2026',
		author: 'Соколов Артём',
		authorRole: 'leader' as const,
	},
	{
		id: 2,
		name: 'Фото_участка_пути.zip',
		size: '8,4 МБ',
		uploadedAt: '16.11.2026',
		author: 'Морозова Анна',
		authorRole: 'member' as const,
	},
	{
		id: 3,
		name: 'Черновик_интервью.docx',
		size: '240 КБ',
		uploadedAt: '15.11.2026',
		author: 'Кузнецов Павел',
		authorRole: 'mentor' as const,
	},
];
