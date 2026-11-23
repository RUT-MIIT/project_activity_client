import type {
	IWorkflowEvent,
	TEventStatus,
	TEventType,
	TEventsView,
} from '../types/events';
import type { IViewOption as ISwitcherOption } from '../../../shared/components/ViewSwitcher/types/types';

const MONTHS = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь',
];

const MONTHS_SHORT = [
	'янв',
	'фев',
	'мар',
	'апр',
	'мая',
	'июн',
	'июл',
	'авг',
	'сен',
	'окт',
	'ноя',
	'дек',
];

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const eventViewOptions: ISwitcherOption<TEventsView>[] = [
	{ id: 'calendar', name: 'Календарь' },
	{ id: 'timeline', name: 'Timeline' },
];

export const toDateKey = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
};

export const parseDateKey = (key: string) => {
	const [year, month, day] = key.split('-').map(Number);

	return new Date(year, month - 1, day);
};

export const formatDate = (iso: string) => {
	const date = new Date(iso);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');

	return `${day}.${month}.${date.getFullYear()}`;
};

export const formatTime = (iso: string) => {
	const date = new Date(iso);

	return `${String(date.getHours()).padStart(2, '0')}:${String(
		date.getMinutes()
	).padStart(2, '0')}`;
};

export const formatMonthTitle = (year: number, month: number) => {
	const name = MONTHS[month];

	return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
};

export const formatDayTitle = (key: string) => {
	const date = parseDateKey(key);

	return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatEventSchedule = (event: IWorkflowEvent) => {
	if (event.endAt) {
		return `${formatDate(event.startAt)} ${formatTime(
			event.startAt
		)} — ${formatDate(event.endAt)} ${formatTime(event.endAt)}`;
	}

	return `${formatDate(event.startAt)}, ${formatTime(event.startAt)}`;
};

export const formatEventLocation = (event: IWorkflowEvent) => {
	if (event.format === 'online') {
		return event.meetingUrl || 'Онлайн';
	}

	return event.place || 'Место не указано';
};

export const formatEventFormat = (format?: IWorkflowEvent['format']) => {
	if (format === 'online') {
		return 'Онлайн';
	}

	if (format === 'offline') {
		return 'Очно';
	}

	return '';
};

export const getEventTypeText = (type: TEventType) => {
	switch (type) {
		case 'customer_meeting':
			return 'Встреча с заказчиком';
		case 'assessment':
			return 'Оценивание';
		case 'checkpoint':
			return 'Контрольная точка';
		case 'expert_pipe':
			return 'Труба экспертов';
		case 'expertise':
			return 'Экспертиза проекта';
		case 'defense':
			return 'Защита проекта';
		default:
			return type;
	}
};

export const getEventTypeColor = (
	type: TEventType
): 'blue' | 'yellow' | 'green' | 'grey' | 'red' | 'purple' => {
	switch (type) {
		case 'customer_meeting':
			return 'blue';
		case 'assessment':
			return 'yellow';
		case 'checkpoint':
			return 'purple';
		case 'expert_pipe':
			return 'grey';
		case 'expertise':
			return 'green';
		case 'defense':
			return 'red';
		default:
			return 'blue';
	}
};

export const getEventStatus = (
	event: IWorkflowEvent,
	now = new Date()
): TEventStatus => {
	if (event.status === 'cancelled') {
		return 'cancelled';
	}

	const start = new Date(event.startAt);
	const end = event.endAt
		? new Date(event.endAt)
		: new Date(start.getTime() + 2 * 60 * 60 * 1000);

	if (now < start) {
		return 'upcoming';
	}

	if (now <= end) {
		return 'active';
	}

	return 'completed';
};

export const getEventStatusText = (status: TEventStatus) => {
	switch (status) {
		case 'upcoming':
			return 'Предстоящее';
		case 'active':
			return 'Активное';
		case 'completed':
			return 'Завершённое';
		case 'cancelled':
			return 'Отменённое';
		default:
			return status;
	}
};

export const getEventStatusColor = (
	status: TEventStatus
): 'blue' | 'green' | 'grey' | 'red' => {
	switch (status) {
		case 'upcoming':
			return 'blue';
		case 'active':
			return 'green';
		case 'completed':
			return 'grey';
		case 'cancelled':
			return 'red';
		default:
			return 'grey';
	}
};

export const getEventDayKeys = (event: IWorkflowEvent) => {
	const start = new Date(event.startAt);
	const end = new Date(event.endAt || event.startAt);
	const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
	const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
	const keys: string[] = [];

	while (cursor <= last) {
		keys.push(toDateKey(cursor));
		cursor.setDate(cursor.getDate() + 1);
	}

	return keys;
};

export const groupEventsByDay = (events: IWorkflowEvent[]) => {
	return events.reduce<Record<string, IWorkflowEvent[]>>((acc, event) => {
		getEventDayKeys(event).forEach((key) => {
			acc[key] = [...(acc[key] || []), event];
		});

		return acc;
	}, {});
};

export const getMonthCells = (year: number, month: number) => {
	const firstDay = new Date(year, month, 1);
	const startOffset = (firstDay.getDay() + 6) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const prevMonthDays = new Date(year, month, 0).getDate();
	const cells: { key: string; day: number; isCurrentMonth: boolean }[] = [];

	for (let i = startOffset - 1; i >= 0; i -= 1) {
		const date = new Date(year, month - 1, prevMonthDays - i);
		cells.push({
			key: toDateKey(date),
			day: date.getDate(),
			isCurrentMonth: false,
		});
	}

	for (let day = 1; day <= daysInMonth; day += 1) {
		const date = new Date(year, month, day);
		cells.push({
			key: toDateKey(date),
			day,
			isCurrentMonth: true,
		});
	}

	while (cells.length % 7 !== 0) {
		const last = parseDateKey(cells[cells.length - 1].key);
		last.setDate(last.getDate() + 1);
		cells.push({
			key: toDateKey(last),
			day: last.getDate(),
			isCurrentMonth: false,
		});
	}

	return cells;
};

export const getOverviewEvents = (events: IWorkflowEvent[], limit = 3) => {
	const now = new Date();
	const visible = events
		.filter((event) => getEventStatus(event, now) !== 'cancelled')
		.sort(
			(a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
		);

	const upcoming = visible.filter((event) => {
		const status = getEventStatus(event, now);

		return status === 'upcoming' || status === 'active';
	});

	if (upcoming.length >= limit) {
		return upcoming.slice(0, limit);
	}

	return visible.slice(-limit);
};

export const sortEvents = (events: IWorkflowEvent[]) => {
	return [...events].sort(
		(a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
	);
};

export const groupEventsByDate = (events: IWorkflowEvent[]) => {
	return sortEvents(events).reduce<{ key: string; events: IWorkflowEvent[] }[]>(
		(groups, event) => {
			const key = toDateKey(new Date(event.startAt));
			const last = groups[groups.length - 1];

			if (last && last.key === key) {
				last.events.push(event);
			} else {
				groups.push({ key, events: [event] });
			}

			return groups;
		},
		[]
	);
};
