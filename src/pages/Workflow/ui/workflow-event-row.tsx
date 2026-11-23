import type { FC } from 'react';
import type { IWorkflowEvent } from '../types/events';

import { Badge } from '../../../shared/components/Badge/ui/badge';

import {
	formatEventLocation,
	formatEventSchedule,
	getEventStatus,
	getEventTypeColor,
	getEventTypeText,
} from '../lib/events';

import { WorkflowEventStatus } from './workflow-event-status';

import styles from '../styles/events.module.scss';

interface IWorkflowEventRowProps {
	event: IWorkflowEvent;
	isHighlighted?: boolean;
	onOpen: (event: IWorkflowEvent) => void;
}

export const WorkflowEventRow: FC<IWorkflowEventRowProps> = ({
	event,
	isHighlighted = false,
	onOpen,
}) => {
	const status = getEventStatus(event);

	return (
		<button
			className={`${styles.row} ${isHighlighted ? styles.row_highlighted : ''} ${
				status === 'cancelled' ? styles.row_cancelled : ''
			}`}
			type='button'
			onClick={() => onOpen(event)}>
			<div className={styles.row__main}>
				<p className={styles.row__title}>{event.title}</p>
				<p className={styles.row__meta}>
					{formatEventSchedule(event)} · {formatEventLocation(event)}
				</p>
			</div>
			<div className={styles.row__aside}>
				<Badge
					text={getEventTypeText(event.type)}
					color={getEventTypeColor(event.type)}
				/>
				<WorkflowEventStatus status={status} />
			</div>
		</button>
	);
};
