import type { FC } from 'react';
import type { ITaskMember, IWorkflowTask } from '../types/tasks';

import { Badge } from '../../../shared/components/Badge/ui/badge';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import { getMemberRoleName } from '../lib/helpers';
import {
	formatTaskDate,
	getMemberNameParts,
	getMemberProgress,
	getMemberTasks,
	getTaskStatusColor,
	getTaskStatusText,
} from '../lib/tasks';

import styles from '../styles/workflow.module.scss';

interface IWorkflowMemberModalProps {
	member: ITaskMember;
	tasks: IWorkflowTask[];
}

export const WorkflowMemberModal: FC<IWorkflowMemberModalProps> = ({
	member,
	tasks,
}) => {
	const { firstName, lastName } = getMemberNameParts(member.fullName);
	const memberTasks = getMemberTasks(tasks, member.id);
	const progress = getMemberProgress(tasks, member.id);

	return (
		<div className={styles.member}>
			<div className={styles.member__head}>
				<TeamAvatar
					firstName={firstName}
					lastName={lastName}
					memberRole={member.role}
				/>
				<div>
					<p className={styles.member__name}>{member.fullName}</p>
					<p className={styles.member__role}>
						{getMemberRoleName(member.role)}
					</p>
				</div>
			</div>

			<ProgressBar
				value={progress.done}
				max={progress.total || 1}
				withInfo
				caption={`Выполнено ${progress.done} из ${progress.total} задач`}
			/>

			{memberTasks.length > 0 ? (
				<ul className={styles.member__tasks}>
					{memberTasks.map((task) => (
						<li className={styles.member__task} key={task.id}>
							<div className={styles.member__taskmain}>
								<p className={styles.member__tasktitle}>{task.title}</p>
								<p className={styles.member__taskmeta}>
									до {formatTaskDate(task.dueAt)}
								</p>
							</div>
							<Badge
								text={getTaskStatusText(task.status)}
								color={getTaskStatusColor(task.status)}
							/>
						</li>
					))}
				</ul>
			) : (
				<Notice
					type='info'
					title='Нет назначенных задач'
					text='Этому участнику пока не назначены задачи на доске команды.'
				/>
			)}
		</div>
	);
};
