import type { ICreateAppForm } from '../types/types';

import {
	required,
	emailFormat,
	phoneFormat,
	minLength,
	maxLength,
	minValue,
} from '../../../shared/lib/validationRules';

export const validationSchema = {
	author_lastname: [required('Введите фамилию'), maxLength(100)],
	author_firstname: [required('Введите имя'), maxLength(100)],
	author_middlename: [required('Введите отчество'), maxLength(100)],
	author_email: [
		required('Введите электронную почту'),
		emailFormat('Неверный формат электронной почты'),
		maxLength(100),
	],
	author_phone: [
		required('Введите номер телефона'),
		phoneFormat('Неверный формат номера телефона'),
		maxLength(100),
	],
	author_role: [required('Введите категорию'), maxLength(100)],
	author_division: [
		required('Введите компанию или подразделение'),
		maxLength(100),
	],

	company_type: [],
	company: [required('Введите наименование'), minLength(6), maxLength(100)],
	company_contacts: [
		required('Введите контактные данные'),
		minLength(10),
		maxLength(300),
	],
	project_level: [],
	target_institutes: [],

	problem_holder: [
		required('Введите носителя проблемы'),
		minLength(10),
		maxLength(100),
	],
	goal: [required('Введите цель'), minLength(30), maxLength(500)],
	barrier: [required('Введите барьер'), minLength(30), maxLength(500)],
	existing_solutions: [
		required('Введите существующие решения'),
		minLength(30),
		maxLength(2000),
	],

	context: [minLength(30), maxLength(500)],
	stakeholders: [maxLength(500)],
	recommended_tools: [maxLength(1000)],
	experts: [maxLength(500)],

	tags: [],
	title: [
		required('Введите наименование проекта'),
		minLength(5),
		maxLength(50),
	],
	additional_materials: [maxLength(1000)],
	track_composer_comment: [maxLength(500)],
	recommended_teams_count: [
		minValue(1, 'Количество команд должно быть больше 0'),
	],
};

export const initialAppValues: ICreateAppForm = {
	author_lastname: '',
	author_firstname: '',
	author_middlename: '',
	author_email: '',
	author_phone: '',
	author_role: { id: 0, name: 'Выберите категорию автора..' },
	author_division: '',

	company_type: null,
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

	title: '',
	tags: null,
	additional_materials: '',
	track_composer_comment: '',
	recommended_teams_count: 3,
	needs_consultation: false,
	is_continuing: false,
	privacy_person: false,
	privacy_org: false,
};

export const formFieldMainData = {
	company_type: {
		name: 'company_type',
		title: 'Тип организации-заказчика*',
		info: 'Если заказчик проекта РУТ (МИИТ), выберите «внутренний заказчик». Если другая компания, выберите «внешний заказчик».',
		placeholder: '',
	},
	company: {
		name: 'company',
		title: 'Наименование организации-заказчика*',
		info: 'Название организации и, по возможности, отдел.',
		placeholder: 'Введите наименование организации-заказчика',
	},
	company_contacts: {
		name: 'company_contacts',
		title: 'Контактные данные представителя заказчика*',
		info: 'Именно этот человек отвечает за описываемую ситуацию, будет консультировать студентов, и именно через оставленные здесь контакты с ним свяжется наставник студенческой команды.',
		placeholder: 'Введите контактные данные',
	},
	project_level: {
		name: 'project_level',
		title: 'Уровень проекта*',
		info: 'Это определяет предполагаемый уровень сложности проекта. Учебные проекты предназначены для знакомства младшекурсников с инструментами проектной работы, учебно-прикладные проекты подразумевают наличие прототипа решения, прикладные проекты подразумевают наличие прототипа И самостоятельную его проверку командой при помощи заказчика.',
		placeholder: '',
	},
	target_institutes: {
		name: 'target_institutes',
		title: 'Экспертам из какого института / академии обратить внимание',
		info: 'Заполняется, если вы точно знаете. Выбранные подразделения получат и рассмотрят заявку. Рекомендуется заранее обсудить заявку с наставниками из соответствующих подразделений.',
		placeholder: '',
	},
	problem_holder: {
		name: 'problem_holder',
		title: 'Носитель проблемы*',
		info: 'У кого возникает ограничение в деятельности? Кто несёт ответственность внутри предприятия за этот участок работ или кому вменено в обязанности разобраться с ситуацией. Этот человек должен непосредственно иметь отношение к ситуации и обладать всей полнотой информации о ней.',
		placeholder: 'Введите носителя проблемы',
	},
	goal: {
		name: 'goal',
		title: 'Цель*',
		info: 'Чего хочет добиться Носитель проблемы, но не может? Чего ему вменили в обязанность? Каково целевое состояние?',
		placeholder: 'Введите цель проекта',
	},
	barrier: {
		name: 'barrier',
		title: 'Барьер*',
		info: 'Что мешает Носителю проблемы достичь Цели? Что ограничивает прямо сейчас? Это должно быть объективное ограничение, которое невозможно преодолеть имеющимися на рынке средствами. Обратите внимание, что деньги или отсутствие у заказчика в непосредственном распоряжении известных решений – это всего лишь факт, но не барьер. Проверочное слово – «слишком». Барьер всегда начинается со слова «слишком». Например: «слишком долгий...», «слишком трудоёмкий...», «слишком тяжёлый...», «слишком сложный...».',
		placeholder: 'Что мешает решить проблему сейчас?',
	},
	existing_solutions: {
		name: 'existing_solutions',
		title: 'Существующие решения*',
		info: 'Как сейчас решают похожие проблемы? Почему существующие решения в данном случае не подходят? Стоит перечислить все известные попытки и идеи решения, опробованные заказчиком или другими предприятиями из той же отрасли. Это поможет команде студентов лучше подготовить анализ ситуации.',
		placeholder: 'Введите существующие решения',
	},
	context: {
		name: 'context',
		title: 'Контекст проекта*',
		info: 'В какой области решаем проблему? Какой рынок, какая сфера деятельности, например: информационные технологии, анализ данных. Можно описать свободно или как ключевые слова (5-10 пар).',
		placeholder: 'Введите контекст проекта',
	},
	stakeholders: {
		name: 'stakeholders',
		title: 'Другие заинтересованные стороны',
		info: 'Кто вовлечен (какие заинтересованные стороны, целевые аудитории и их сегменты)? Это поможет студенческой команде подготовиться быстрее.',
		placeholder: 'Введите другие заинтересованные стороны',
	},
	recommended_tools: {
		name: 'recommended_tools',
		title: 'Рекомендуемые инструменты / методы',
		info: 'Есть ли у заказчика дополнительные ограничения по инструментам/методам, которыми такие проблемы могут быть решены? Здесь в первую очередь перечисляются однозначные запреты на использование ПО и иных инструментов, связанные с характером работы компании заказчика.',
		placeholder: 'Введите рекомендуемые инструменты / методы',
	},
	experts: {
		name: 'experts',
		title: 'Эксперты',
		info: 'Какие эксперты уже готовы помочь проекту? Кто ещё может проконсультировать студентов?',
		placeholder: 'Введите экспертов',
	},
	tags: {
		name: 'tags',
		title: 'Направление проекта',
		info: 'Выберите подходящее направление, связанное с вашим проектом. Это поможет найти экспертов и участников с соответствующей компетенцией.',
		placeholder: 'Выберите направление',
	},
	title: {
		name: 'title',
		title: 'Наименование проекта*',
		info: 'Максимально коротко, ясно и ёмко. «Обходчик» предпочтительнее, чем «Проектирование и разработка системы мониторинга качества и дефектов путевого полотна, позволяющей избегать влияния человеческого фактора». Постарайтесь сформулировать так, чтобы название проекта напоминало всем о контексте существования проблемы.',
		placeholder: 'Введите наименование проекта',
	},
	additional_materials: {
		name: 'additional_materials',
		title: 'Дополнительные материалы',
		info: 'Ссылки на дополнительные материалы – что будет полезно почитать, посмотреть, изучить участникам, ваши дополнительные комментарии в произвольной форме. Это поможет студенческой команде лучше подготовиться к проведению интервью.',
		placeholder: 'Введите дополнительные материалы',
	},
	track_composer_comment: {
		name: 'track_composer_comment',
		title: 'Комментарий для составителя трека',
		info: 'Укажите дополнительную информацию или комментарий, который поможет составителю трека учесть ваши пожелания.',
		placeholder: 'Введите комментарий',
	},
	recommended_teams_count: {
		name: 'recommended_teams_count',
		title: 'Рекомендуемое число команд на проект',
		info: '',
		placeholder: 'Введите число команд',
	},
	needs_consultation: {
		name: 'needs_consultation',
		title: 'Консультация',
		info: '',
		placeholder: 'Хочу, чтобы мне помогли заполнить заявку',
	},
	is_continuing: {
		name: 'is_continuing',
		title: 'Продолжающийся проект',
		info: '',
		placeholder: 'Выберите, если проект продолжается',
	},
};

export const formFieldPublicData = {
	author_lastname: {
		name: 'author_lastname',
		title: 'Фамилия*',
		info: '',
		placeholder: 'Введите фамилию',
	},
	author_firstname: {
		name: 'author_firstname',
		title: 'Имя*',
		info: '',
		placeholder: 'Введите имя',
	},
	author_middlename: {
		name: 'author_middlename',
		title: 'Отчество*',
		info: '',
		placeholder: 'Введите отчество',
	},
	author_email: {
		name: 'author_email',
		title: 'Почта*',
		info: '',
		placeholder: 'Введите почту',
	},
	author_phone: {
		name: 'author_phone',
		title: 'Мобильный телефон*',
		info: '',
		placeholder: 'Введите телефон',
	},
	author_role: {
		name: 'author_role',
		title: 'Категория автора*',
		info: '',
		placeholder: 'Выберите категорию',
	},
	author_division: {
		name: 'author_division',
		title: 'Компания или подразделение*',
		info: 'Если вы представитель компании – укажите её наименование. Если вы работник РУТ (МИИТ) – укажите название вашего подразделения.',
		placeholder: 'Введите название компании или подразделения',
	},

	company_type: {
		name: 'company_type',
		title: 'Тип организации-заказчика*',
		info: 'Если заказчик проекта РУТ (МИИТ), выберите «внутренний заказчик». Если другая компания, выберите «внешний заказчик».',
		placeholder: '',
	},
	company: {
		name: 'company',
		title: 'Наименование организации-заказчика*',
		info: 'Название организации и, по возможности, отдел.',
		placeholder: 'Введите наименование организации-заказчика',
	},
	company_contacts: {
		name: 'company_contacts',
		title: 'Контактные данные представителя заказчика*',
		info: 'Именно этот человек отвечает за описываемую ситуацию, будет консультировать студентов, и именно через оставленные здесь контакты с ним свяжется наставник студенческой команды.',
		placeholder: 'Введите контактные данные',
	},
	target_institutes: {
		name: 'target_institutes',
		title: 'Экспертам из какого института / академии обратить внимание',
		info: 'Заполняется, если вы точно знаете. Если не уверены – выберите все. Выбранные подразделения получат и рассмотрят заявку. Рекомендуется заранее обсудить заявку с наставниками из соответствующих подразделений.',
		placeholder: '',
	},

	problem_holder: {
		name: 'problem_holder',
		title: 'Носитель проблемы*',
		info: 'У кого возникает ограничение в деятельности? Кто несёт ответственность внутри предприятия за этот участок работ или кому вменено в обязанности разобраться с ситуацией. Этот человек должен непосредственно иметь отношение к ситуации и обладать всей полнотой информации о ней.',
		placeholder: 'Введите носителя проблемы',
	},
	goal: {
		name: 'goal',
		title: 'Цель*',
		info: 'Чего хочет добиться Носитель проблемы, но не может? Чего ему вменили в обязанность? Каково целевое состояние?',
		placeholder: 'Введите цель проекта',
	},
	barrier: {
		name: 'barrier',
		title: 'Барьер*',
		info: 'Что мешает Носителю проблемы достичь Цели? Что ограничивает прямо сейчас? Это должно быть объективное ограничение, которое невозможно преодолеть имеющимися на рынке средствами. Обратите внимание, что деньги или отсутствие у заказчика в непосредственном распоряжении известных решений – это всего лишь факт, но не барьер. Проверочное слово – «слишком». Барьер всегда начинается со слова «слишком». Например: «слишком долгий...», «слишком трудоёмкий...», «слишком тяжёлый...», «слишком сложный...».',
		placeholder: 'Что мешает решить проблему сейчас?',
	},
	existing_solutions: {
		name: 'existing_solutions',
		title: 'Существующие решения*',
		info: 'Как сейчас решают похожие проблемы? Почему существующие решения в данном случае не подходят? Стоит перечислить все известные попытки и идеи решения, опробованные заказчиком или другими предприятиями из той же отрасли. Это поможет команде студентов лучше подготовить анализ ситуации.',
		placeholder: 'Введите существующие решения',
	},

	title: {
		name: 'title',
		title: 'Наименование проекта*',
		info: 'Максимально коротко, ясно и ёмко. «Обходчик» предпочтительнее, чем «Проектирование и разработка системы мониторинга качества и дефектов путевого полотна, позволяющей избегать влияния человеческого фактора». Постарайтесь сформулировать так, чтобы название проекта напоминало всем о контексте существования проблемы.',
		placeholder: 'Введите наименование проекта',
	},
	tags: {
		name: 'tags',
		title: 'Направление проекта',
		info: 'Выберите подходящее направление, связанное с вашим проектом. Это поможет найти экспертов и участников с соответствующей компетенцией.',
		placeholder: 'Выберите направление',
	},
	additional_materials: {
		name: 'additional_materials',
		title: 'Дополнительные материалы',
		info: 'Ссылки на дополнительные материалы – что будет полезно почитать, посмотреть, изучить участникам, ваши дополнительные комментарии в произвольной форме. Это поможет студенческой команде лучше подготовиться к проведению интервью.',
		placeholder: 'Введите дополнительные материалы',
	},
	privacy_person: {
		name: 'privacy_person',
		title: 'Cогласие на обработку персональных данных*',
		info: '',
		placeholder: '',
	},
	privacy_org: {
		name: 'privacy_org',
		title: 'Положение об обработке персональных данных*',
		info: '',
		placeholder: '',
	},
};

export const requiredFieldsMain: (keyof ICreateAppForm)[] = [
	'company_type',
	'company',
	'company_contacts',
	'project_level',

	'problem_holder',
	'goal',
	'barrier',
	'existing_solutions',

	'context',

	'title',
	'recommended_teams_count',
];

export const requiredFieldsPublic: (keyof ICreateAppForm)[] = [
	'author_lastname',
	'author_firstname',
	'author_middlename',
	'author_email',
	'author_phone',
	'author_role',
	'author_division',

	'company_type',
	'company',
	'company_contacts',

	'problem_holder',
	'goal',
	'barrier',
	'existing_solutions',

	'title',
	'privacy_person',
	'privacy_org',
];

export const shouldBlockSubmit = (
	values: ICreateAppForm,
	requiredFields: (keyof ICreateAppForm)[],
	errors: { [K in keyof ICreateAppForm]?: string }
): boolean => {
	// 1. есть ли ошибки
	if (Object.values(errors).some(Boolean)) {
		return true;
	}

	// 2. проверка обязательных полей
	for (const field of requiredFields) {
		const value = values[field];

		// null / undefined — всегда невалидно
		if (value === null || value === undefined) {
			return true;
		}

		// строки
		if (typeof value === 'string') {
			if (value.trim().length === 0) {
				return true;
			}
			continue;
		}

		if (field === 'recommended_teams_count') {
			if (typeof value !== 'number' || value < 1) {
				return true;
			}

			continue;
		}

		// boolean (обязательные чекбоксы)
		if (typeof value === 'boolean') {
			if (!value) {
				return true;
			}
			continue;
		}

		// массивы
		if (Array.isArray(value)) {
			if (value.length === 0) {
				return true;
			}
			continue;
		}

		// объекты селектов (IProjectLevel, ITag, ICompanyType и т.д.)
		if (typeof value === 'object') {
			// безопасный каст только для id-based объектов
			const maybeWithId = value as { id?: unknown };

			if (typeof maybeWithId.id === 'number' && maybeWithId.id === 0) {
				return true;
			}
		}
	}

	return false;
};
