import type { FC } from 'react';
import type { ITaskMember, IWorkflowTask } from '../types/tasks';

import { useRef } from 'react';

import { Badge } from '../../../shared/components/Badge/ui/badge';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import {
	formatTaskDate,
	getMemberNameParts,
	getTaskAssignees,
	getTaskStatusColor,
	getTaskStatusText,
} from '../lib/tasks';

import styles from '../styles/tasks.module.scss';

interface IWorkflowTaskCardProps {
	task: IWorkflowTask;
	members: ITaskMember[];
	onOpen: (task: IWorkflowTask) => void;
	onDragStart: (taskId: number) => void;
}

export const WorkflowTaskCard: FC<IWorkflowTaskCardProps> = ({
	task,
	members,
	onOpen,
	onDragStart,
}) => {
	const wasDragged = useRef(false);
	const assignees = getTaskAssignees(task, members);

	return (
		<article
			className={styles.card}
			draggable
			onDragStart={(event) => {
				wasDragged.current = true;
				event.dataTransfer.setData('text/plain', String(task.id));
				event.dataTransfer.effectAllowed = 'move';
				onDragStart(task.id);
			}}
			onClick={() => {
				if (wasDragged.current) {
					wasDragged.current = false;
					return;
				}

				onOpen(task);
			}}>
			<div className={styles.card__top}>
				<div className={styles.card__badge}>
					<Badge
						text={getTaskStatusText(task.status)}
						color={getTaskStatusColor(task.status)}
					/>
				</div>
				<p className={styles.card__title}>{task.title}</p>
			</div>
			<p className={styles.card__due}>до {formatTaskDate(task.dueAt)}</p>
			<div className={styles.card__footer}>
				<div className={styles.card__people}>
					{assignees.map((member) => {
						const { firstName, lastName } = getMemberNameParts(member.fullName);

						return (
							<TeamAvatar
								key={member.id}
								firstName={firstName}
								lastName={lastName}
								memberRole={member.role}
							/>
						);
					})}
				</div>
				<p className={styles.card__meta}>
					{task.comments.length > 0 ? `${task.comments.length} комм.` : ''}
					{task.comments.length > 0 && task.files.length > 0 ? ' · ' : ''}
					{task.files.length > 0 ? `${task.files.length} файл.` : ''}
				</p>
			</div>
		</article>
	);
};
