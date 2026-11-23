import type { FC } from 'react';
import type { TEventStatus } from '../types/events';

import { getEventStatusColor, getEventStatusText } from '../lib/events';

import styles from '../styles/events.module.scss';

interface IWorkflowEventStatusProps {
	status: TEventStatus;
}

export const WorkflowEventStatus: FC<IWorkflowEventStatusProps> = ({
	status,
}) => {
	return (
		<span className={styles.status}>
			<span
				className={`${styles.status__dot} ${
					styles[`status__dot_color_${getEventStatusColor(status)}`]
				}`}
			/>
			<span className={styles.status__label}>{getEventStatusText(status)}</span>
		</span>
	);
};
