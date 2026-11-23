import type { FC } from 'react';
import type {
	ITaskMember,
	ITaskStage,
	IWorkflowTask,
} from '../types/tasks';

import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Button } from '../../../shared/components/Button/ui/button';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';

import {
	getStageProgress,
	getStageStateColor,
	getStageStateText,
} from '../lib/tasks';

import { WorkflowTaskCard } from './workflow-task-card';

import styles from '../styles/tasks.module.scss';

interface IWorkflowTaskColumnProps {
	stage: ITaskStage;
	tasks: IWorkflowTask[];
	members: ITaskMember[];
	isOver: boolean;
	onOpenTask: (task: IWorkflowTask) => void;
	onCreate: (stageId: ITaskStage['id']) => void;
	onDragStart: (taskId: number) => void;
	onDragOver: (stageId: ITaskStage['id']) => void;
	onDrop: (stageId: ITaskStage['id']) => void;
	onDragLeave: () => void;
}

export const WorkflowTaskColumn: FC<IWorkflowTaskColumnProps> = ({
	stage,
	tasks,
	members,
	isOver,
	onOpenTask,
	onCreate,
	onDragStart,
	onDragOver,
	onDrop,
	onDragLeave,
}) => {
	const progress = getStageProgress(tasks, stage.id);
	const stageTasks = tasks.filter((task) => task.stageId === stage.id);

	return (
		<section
			className={`${styles.column} ${isOver ? styles.column_over : ''}`}
			onDragOver={(event) => {
				event.preventDefault();
				onDragOver(stage.id);
			}}
			onDrop={(event) => {
				event.preventDefault();
				onDrop(stage.id);
			}}
			onDragLeave={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node)) {
					onDragLeave();
				}
			}}>
			<div className={styles.column__header}>
				<div className={styles.column__heading}>
					<p className={styles.column__title}>
						Этап {stage.id}. {stage.shortTitle}
					</p>
					<Badge
						text={getStageStateText(progress.state)}
						color={getStageStateColor(progress.state)}
					/>
				</div>
				<p className={styles.column__desc}>{stage.description}</p>
				<ProgressBar
					value={progress.done}
					max={progress.total || 1}
					withInfo
					caption={`${progress.done} из ${progress.total} выполнено`}
				/>
			</div>
			<div className={styles.column__list}>
				{stageTasks.map((task) => (
					<WorkflowTaskCard
						key={task.id}
						task={task}
						members={members}
						onOpen={onOpenTask}
						onDragStart={onDragStart}
					/>
				))}
				{stageTasks.length === 0 && (
					<p className={styles.column__empty}>В этапе пока нет задач</p>
				)}
			</div>
			<Button
				text='Добавить задачу'
				color='blue'
				width='full'
				withIcon={{ type: 'add', color: 'white' }}
				onClick={() => onCreate(stage.id)}
			/>
		</section>
	);
};
