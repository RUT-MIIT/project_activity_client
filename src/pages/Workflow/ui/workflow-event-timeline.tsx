import type { FC } from 'react';
import type { IWorkflowEvent } from '../types/events';

import { Notice } from '../../../shared/components/Notice/ui/notice';

import {
	formatDayTitle,
	getEventDayKeys,
	getEventTypeColor,
	sortEvents,
	toDateKey,
} from '../lib/events';

import { WorkflowEventRow } from './workflow-event-row';

import styles from '../styles/events.module.scss';

interface IWorkflowEventTimelineProps {
	events: IWorkflowEvent[];
	selectedDate: string;
	onOpenEvent: (event: IWorkflowEvent) => void;
}

export const WorkflowEventTimeline: FC<IWorkflowEventTimelineProps> = ({
	events,
	selectedDate,
	onOpenEvent,
}) => {
	const items = sortEvents(events);

	if (items.length === 0) {
		return (
			<Notice
				type='info'
				title='Мероприятий нет'
				text='Шкала появится, когда для команды будут назначены события.'
			/>
		);
	}

	return (
		<ol className={styles.timeline}>
			{items.map((event) => {
				const key = toDateKey(new Date(event.startAt));

				return (
					<li className={styles.timeline__item} key={event.id}>
						<p className={styles.timeline__date}>{formatDayTitle(key)}</p>
						<div className={styles.timeline__axis}>
							<span
								className={`${styles.timeline__point} ${
									styles[
										`timeline__point_color_${getEventTypeColor(event.type)}`
									]
								}`}
							/>
						</div>
						<WorkflowEventRow
							event={event}
							isHighlighted={getEventDayKeys(event).includes(selectedDate)}
							onOpen={onOpenEvent}
						/>
					</li>
				);
			})}
		</ol>
	);
};
