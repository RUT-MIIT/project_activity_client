import type { FC, FormEvent } from 'react';
import type {
	ITaskMember,
	IWorkflowTask,
	TTaskStatus,
} from '../types/tasks';

import { useState } from 'react';

import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Button } from '../../../shared/components/Button/ui/button';
import { Field } from '../../../shared/components/Field/ui/field';
import { FormField, FormTextarea } from '../../../shared/components/Form/components';
import { Link } from '../../../shared/components/Link/ui/link';
import { Select } from '../../../shared/components/Select/ui/select';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import { getMemberRoleName } from '../lib/helpers';
import {
	formatTaskDate,
	getMemberNameParts,
	getTaskAssignees,
	getTaskStatusColor,
	getTaskStatusText,
	taskStages,
} from '../lib/tasks';

import styles from '../styles/tasks.module.scss';

interface IWorkflowTaskDetailProps {
	task: IWorkflowTask;
	members: ITaskMember[];
	onChangeStatus: (status: TTaskStatus) => void;
	onAddComment: (text: string) => void;
	onEdit: () => void;
	onDelete: () => void;
}

const statusOptions: { id: TTaskStatus; name: string }[] = [
	{ id: 'todo', name: getTaskStatusText('todo') },
	{ id: 'in_progress', name: getTaskStatusText('in_progress') },
	{ id: 'review', name: getTaskStatusText('review') },
	{ id: 'done', name: getTaskStatusText('done') },
];

export const WorkflowTaskDetail: FC<IWorkflowTaskDetailProps> = ({
	task,
	members,
	onChangeStatus,
	onAddComment,
	onEdit,
	onDelete,
}) => {
	const [comment, setComment] = useState('');
	const assignees = getTaskAssignees(task, members);
	const stage = taskStages.find((item) => item.id === task.stageId);

	const handleComment = (event: FormEvent) => {
		event.preventDefault();

		if (!comment.trim()) {
			return;
		}

		onAddComment(comment.trim());
		setComment('');
	};

	return (
		<div className={styles.detail}>
			<div className={styles.detail__badges}>
				<Badge
					text={getTaskStatusText(task.status)}
					color={getTaskStatusColor(task.status)}
				/>
				<Badge text={`Этап ${task.stageId}`} color='blue' />
			</div>

			<Field
				title='Этап проектной деятельности'
				text={stage ? `${stage.id}. ${stage.title}` : ''}
			/>
			{task.description && <Field title='Описание' text={task.description} />}
			<Field
				title='Сроки'
				text={`${
					task.startAt ? `с ${formatTaskDate(task.startAt)}, ` : ''
				}до ${formatTaskDate(task.dueAt)}`}
			/>

			<div>
				<p className={styles.detail__label}>Исполнители</p>
				{assignees.length > 0 ? (
					<ul className={styles.detail__people}>
						{assignees.map((member) => {
							const { firstName, lastName } = getMemberNameParts(
								member.fullName
							);

							return (
								<li className={styles.detail__person} key={member.id}>
									<TeamAvatar
										firstName={firstName}
										lastName={lastName}
										memberRole={member.role}
									/>
									<div>
										<p className={styles.detail__name}>{member.fullName}</p>
										<p className={styles.detail__role}>
											{getMemberRoleName(member.role)}
										</p>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<p className={styles.detail__empty}>Исполнители не назначены</p>
				)}
			</div>

			<FormField title='Изменить статус'>
				<Select
					options={statusOptions}
					currentOption={
						statusOptions.find((option) => option.id === task.status) || null
					}
					onChooseOption={(option) => {
						if (option && option.id !== task.status) {
							onChangeStatus(option.id);
						}
					}}
					withClear={false}
				/>
			</FormField>

			{task.links.length > 0 && (
				<div>
					<p className={styles.detail__label}>Ссылки</p>
					<ul className={styles.detail__list}>
						{task.links.map((item) => (
							<li key={item.id}>
								<Link text={item.label} path={item.url} />
							</li>
						))}
					</ul>
				</div>
			)}

			<div>
				<p className={styles.detail__label}>Файлы</p>
				{task.files.length > 0 ? (
					<ul className={styles.files}>
						{task.files.map((file) => {
							const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';

							return (
								<li className={styles.file} key={file.id}>
									<span className={styles.file__icon}>{extension}</span>
									<div className={styles.file__main}>
										<p className={styles.file__name}>{file.name}</p>
										<p className={styles.file__meta}>
											{file.size} · {file.uploadedAt} · {file.author}
										</p>
									</div>
									<Button text='Скачать' color='blue' isBlock />
								</li>
							);
						})}
					</ul>
				) : (
					<p className={styles.detail__empty}>Файлы не прикреплены</p>
				)}
				<Button text='Прикрепить файл' color='cancel' isBlock />
			</div>

			<div>
				<p className={styles.detail__label}>Комментарии</p>
				{task.comments.length > 0 ? (
					<ul className={styles.comments}>
						{task.comments.map((item) => {
							const { firstName, lastName } = getMemberNameParts(item.author);

							return (
								<li className={styles.comment} key={item.id}>
									<TeamAvatar
										firstName={firstName}
										lastName={lastName}
										memberRole={item.authorRole}
									/>
									<div className={styles.comment__body}>
										<div className={styles.comment__head}>
											<p className={styles.comment__author}>{item.author}</p>
											<p className={styles.comment__date}>{item.createdAt}</p>
										</div>
										<p className={styles.comment__text}>{item.text}</p>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<p className={styles.detail__empty}>Комментариев пока нет</p>
				)}
				<form className={styles.detail__commentform} onSubmit={handleComment}>
					<FormTextarea
						name='comment'
						value={comment}
						onChange={(event) => setComment(event.target.value)}
					/>
					<Button type='submit' text='Добавить комментарий' color='blue' />
				</form>
			</div>

			{task.history.length > 0 && (
				<div>
					<p className={styles.detail__label}>История изменений</p>
					<ul className={styles.detail__list}>
						{task.history.map((item) => (
							<li className={styles.detail__history} key={item.id}>
								{item.createdAt}: {item.text}
							</li>
						))}
					</ul>
				</div>
			)}

			<div className={styles.detail__actions}>
				<Button text='Редактировать' color='blue' onClick={onEdit} />
				<Button text='Удалить' color='red' onClick={onDelete} />
			</div>
		</div>
	);
};
