import type { FC } from 'react';
import type { TEventsView } from '../types/events';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../../../shared/components/Card/ui';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { ViewSwitcher } from '../../../shared/components/ViewSwitcher/ui/view-switcher';

import { mockEvents } from '../lib/mock';
import {
	eventViewOptions,
	groupEventsByDay,
	parseDateKey,
	toDateKey,
} from '../lib/events';

import { WorkflowEventCalendar } from './workflow-event-calendar';
import { WorkflowEventDetail } from './workflow-event-detail';
import { WorkflowEventTimeline } from './workflow-event-timeline';

import pageStyles from '../styles/workflow.module.scss';
import styles from '../styles/events.module.scss';

const STORAGE_KEY = 'workflowEventsView';

const getStoredView = (): TEventsView => {
	const saved = localStorage.getItem(STORAGE_KEY);

	if (saved === 'timeline' || saved === 'calendar') {
		return saved;
	}

	return 'calendar';
};

export const WorkflowEvents: FC = () => {
	const navigate = useNavigate();
	const now = new Date();
	const [view, setView] = useState<TEventsView>(getStoredView);
	const [selectedDate, setSelectedDate] = useState(() => toDateKey(now));
	const [cursor, setCursor] = useState({
		year: now.getFullYear(),
		month: now.getMonth(),
	});
	const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

	const eventsByDay = useMemo(() => groupEventsByDay(mockEvents), []);
	const selectedEvent =
		mockEvents.find((event) => event.id === selectedEventId) || null;

	const handleSelectDate = (key: string) => {
		const date = parseDateKey(key);

		setSelectedDate(key);
		setCursor({ year: date.getFullYear(), month: date.getMonth() });
	};

	const handlePrevMonth = () => {
		setCursor((current) => {
			const date = new Date(current.year, current.month - 1, 1);

			return { year: date.getFullYear(), month: date.getMonth() };
		});
	};

	const handleNextMonth = () => {
		setCursor((current) => {
			const date = new Date(current.year, current.month + 1, 1);

			return { year: date.getFullYear(), month: date.getMonth() };
		});
	};

	const handleToday = () => {
		const today = new Date();

		setCursor({ year: today.getFullYear(), month: today.getMonth() });
		setSelectedDate(toDateKey(today));
	};

	return (
		<div className={pageStyles.page}>
			<Card
				title='Календарь мероприятий'
				subtitle='События команды, контрольные точки и оценочные процедуры. Данные пока демонстрационные.'>
				<div className={styles.toolbar}>
					{view === 'timeline' && (
						<p className={styles.toolbar__title}>Все мероприятия команды</p>
					)}
					<ViewSwitcher<TEventsView>
						options={eventViewOptions}
						defaultView={view}
						storageKey={STORAGE_KEY}
						onChange={setView}
					/>
				</div>

				{view === 'calendar' && (
					<WorkflowEventCalendar
						year={cursor.year}
						month={cursor.month}
						selectedDate={selectedDate}
						eventsByDay={eventsByDay}
						onSelectDate={handleSelectDate}
						onOpenEvent={(event) => setSelectedEventId(event.id)}
						onPrevMonth={handlePrevMonth}
						onNextMonth={handleNextMonth}
						onToday={handleToday}
					/>
				)}

				{view === 'timeline' && (
					<WorkflowEventTimeline
						events={mockEvents}
						selectedDate={selectedDate}
						onOpenEvent={(event) => setSelectedEventId(event.id)}
					/>
				)}
			</Card>

			<Modal
				isOpen={Boolean(selectedEvent)}
				onClose={() => setSelectedEventId(null)}
				title={selectedEvent?.title}
				description='Карточка мероприятия'>
				{selectedEvent && (
					<WorkflowEventDetail
						event={selectedEvent}
						onOpenModule={(path) => {
							setSelectedEventId(null);
							navigate(path);
						}}
					/>
				)}
			</Modal>
		</div>
	);
};
