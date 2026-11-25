import type { FC } from 'react';
import type { ITaskStage } from '../types/tasks';

import styles from '../styles/tasks.module.scss';

interface IWorkflowStageModalProps {
	stage: ITaskStage;
}

export const WorkflowStageModal: FC<IWorkflowStageModalProps> = ({ stage }) => {
	return (
		<div className={styles.stage}>
			<p className={styles.stage__text}>{stage.description}</p>
		</div>
	);
};