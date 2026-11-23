import type { FC } from 'react';
import type { IWorkflowEvent } from '../types/events';

import { Notice } from '../../../shared/components/Notice/ui/notice';

import {
	WEEKDAYS,
	formatDayTitle,
	formatMonthTitle,
	getEventTypeColor,
	getMonthCells,
	toDateKey,
} from '../lib/events';

import { WorkflowEventRow } from './workflow-event-row';

import styles from '../styles/events.module.scss';

interface IWorkflowEventCalendarProps {
	year: number;
	month: number;
	selectedDate: string;
	eventsByDay: Record<string, IWorkflowEvent[]>;
	onSelectDate: (key: string) => void;
	onOpenEvent: (event: IWorkflowEvent) => void;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
}

export const WorkflowEventCalendar: FC<IWorkflowEventCalendarProps> = ({
	year,
	month,
	selectedDate,
	eventsByDay,
	onSelectDate,
	onOpenEvent,
	onPrevMonth,
	onNextMonth,
	onToday,
}) => {
	const today = new Date();
	const todayKey = toDateKey(today);
	const isCurrentMonth =
		year === today.getFullYear() && month === today.getMonth();
	const cells = getMonthCells(year, month);
	const dayEvents = eventsByDay[selectedDate] || [];

	return (
		<div className={styles.layout}>
			<div className={styles.calendar}>
				<div className={styles.calendar__header}>
					<div className={styles.calendar__switch}>
						<button
							className={styles.calendar__shift}
							type='button'
							aria-label='Предыдущий месяц'
							onClick={onPrevMonth}
						/>
						<p className={styles.calendar__title}>
							{formatMonthTitle(year, month)}
						</p>
						<button
							className={`${styles.calendar__shift} ${styles.calendar__shift_next}`}
							type='button'
							aria-label='Следующий месяц'
							onClick={onNextMonth}
						/>
					</div>
					<button
						className={`${styles.calendar__today} ${
							isCurrentMonth ? styles.calendar__today_current : ''
						}`}
						type='button'
						disabled={isCurrentMonth}
						onClick={onToday}>
						Сегодня
					</button>
				</div>
				<div className={styles.grid}>
					{WEEKDAYS.map((day) => (
						<p className={styles.grid__weekday} key={day}>
							{day}
						</p>
					))}
					{cells.map((cell) => {
						const events = eventsByDay[cell.key] || [];
						const types = events
							.map((event) => event.type)
							.filter((type, index, list) => list.indexOf(type) === index)
							.slice(0, 3);

						return (
							<button
								className={`${styles.day} ${
									cell.isCurrentMonth ? '' : styles.day_muted
								} ${cell.key === todayKey ? styles.day_today : ''} ${
									cell.key === selectedDate ? styles.day_selected : ''
								} ${events.length > 0 ? styles.day_event : ''}`}
								key={cell.key}
								type='button'
								onClick={() => onSelectDate(cell.key)}>
								<span className={styles.day__number}>{cell.day}</span>
								{types.length > 0 && (
									<span className={styles.day__dots}>
										{types.map((type) => (
											<span
												className={`${styles.day__dot} ${
													styles[`day__dot_color_${getEventTypeColor(type)}`]
												}`}
												key={type}
											/>
										))}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			<div className={styles.daypanel}>
				<p className={styles.daypanel__title}>{formatDayTitle(selectedDate)}</p>
				{dayEvents.length > 0 ? (
					<ul className={styles.daypanel__list}>
						{dayEvents.map((event) => (
							<li key={event.id}>
								<WorkflowEventRow event={event} onOpen={onOpenEvent} />
							</li>
						))}
					</ul>
				) : (
					<Notice
						type='info'
						title='Нет мероприятий'
						text='На выбранный день события не запланированы.'
					/>
				)}
			</div>
		</div>
	);
};
