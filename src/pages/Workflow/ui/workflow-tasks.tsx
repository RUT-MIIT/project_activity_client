import type { FC } from 'react';
import type {
	ITaskFormValues,
	IWorkflowTask,
	TTaskStageId,
	TTaskStatus,
} from '../types/tasks';

import { useMemo, useState } from 'react';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';

import { mockTasks, mockTeamMembers } from '../lib/mock';
import {
	createHistoryItem,
	getOverallTaskProgress,
	getTaskStatusText,
	taskStages,
} from '../lib/tasks';

import { WorkflowTaskColumn } from './workflow-task-column';
import { WorkflowTaskDetail } from './workflow-task-detail';
import { WorkflowTaskForm } from './workflow-task-form';

import styles from '../styles/tasks.module.scss';

const emptyForm = (stageId: TTaskStageId): ITaskFormValues => ({
	title: '',
	description: '',
	stageId,
	status: 'todo',
	assigneeIds: [],
	startAt: '',
	dueAt: '',
});

export const WorkflowTasks: FC = () => {
	const [tasks, setTasks] = useState(mockTasks);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [isEdit, setIsEdit] = useState(false);
	const [createStageId, setCreateStageId] = useState<TTaskStageId | null>(null);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [dragId, setDragId] = useState<number | null>(null);
	const [overStageId, setOverStageId] = useState<TTaskStageId | null>(null);

	const selectedTask = tasks.find((task) => task.id === selectedId) || null;
	const overall = useMemo(() => getOverallTaskProgress(tasks), [tasks]);

	const nextId = () => Math.max(0, ...tasks.map((task) => task.id)) + 1;

	const addHistory = (task: IWorkflowTask, text: string): IWorkflowTask => {
		const historyId = Math.max(0, ...task.history.map((item) => item.id)) + 1;

		return {
			...task,
			history: [createHistoryItem(text, historyId), ...task.history],
		};
	};

	const handleCreate = (values: ITaskFormValues) => {
		const id = nextId();

		setTasks((prev) => [
			...prev,
			{
				id,
				title: values.title,
				description: values.description,
				stageId: values.stageId,
				status: values.status,
				assigneeIds: values.assigneeIds,
				startAt: values.startAt || undefined,
				dueAt: values.dueAt,
				comments: [],
				files: [],
				links: [],
				history: [createHistoryItem('Задача создана', 1)],
			},
		]);
		setCreateStageId(null);
	};

	const handleUpdate = (values: ITaskFormValues) => {
		if (!selectedId) {
			return;
		}

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id !== selectedId) {
					return task;
				}

				let next: IWorkflowTask = {
					...task,
					title: values.title,
					description: values.description,
					stageId: values.stageId,
					status: values.status,
					assigneeIds: values.assigneeIds,
					startAt: values.startAt || undefined,
					dueAt: values.dueAt,
				};

				if (task.status !== values.status) {
					next = addHistory(
						next,
						`Статус изменён на «${getTaskStatusText(values.status)}»`
					);
				}

				if (task.stageId !== values.stageId) {
					next = addHistory(
						next,
						`Задача перенесена на этап ${values.stageId}`
					);
				}

				return next;
			})
		);
		setIsEdit(false);
	};

	const handleStatus = (status: TTaskStatus) => {
		if (!selectedId) {
			return;
		}

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id !== selectedId) {
					return task;
				}

				return addHistory(
					{ ...task, status },
					`Статус изменён на «${getTaskStatusText(status)}»`
				);
			})
		);
	};

	const handleComment = (text: string) => {
		if (!selectedId) {
			return;
		}

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id !== selectedId) {
					return task;
				}

				const commentId =
					Math.max(0, ...task.comments.map((item) => item.id)) + 1;

				return addHistory(
					{
						...task,
						comments: [
							...task.comments,
							{
								id: commentId,
								author: 'Соколов Артём',
								authorRole: 'leader',
								text,
								createdAt: createHistoryItem('', 0).createdAt,
							},
						],
					},
					'Добавлен комментарий'
				);
			})
		);
	};

	const handleDrop = (stageId: TTaskStageId) => {
		if (dragId === null) {
			setOverStageId(null);
			return;
		}

		setTasks((prev) =>
			prev.map((task) => {
				if (task.id !== dragId || task.stageId === stageId) {
					return task;
				}

				return addHistory(
					{ ...task, stageId },
					`Задача перенесена на этап ${stageId}`
				);
			})
		);
		setDragId(null);
		setOverStageId(null);
	};

	return (
		<div className={styles.page}>
			<div className={styles.summary}>
				<div className={styles.summary__text}>
					<h2 className={styles.summary__title}>Задачи команды</h2>
					<p className={styles.summary__caption}>
						{overall.done} из {overall.total} задач выполнено
					</p>
				</div>
				<div className={styles.summary__progress}>
					<ProgressBar
						value={overall.done}
						max={overall.total || 1}
						withInfo
						caption='Общий прогресс'
					/>
				</div>
			</div>

			<div className={styles.board}>
				{taskStages.map((stage) => (
					<WorkflowTaskColumn
						key={stage.id}
						stage={stage}
						tasks={tasks}
						members={mockTeamMembers}
						isOver={overStageId === stage.id}
						onOpenTask={(task) => {
							setSelectedId(task.id);
							setIsEdit(false);
						}}
						onCreate={(stageId) => setCreateStageId(stageId)}
						onDragStart={setDragId}
						onDragOver={setOverStageId}
						onDrop={handleDrop}
						onDragLeave={() => setOverStageId(null)}
					/>
				))}
			</div>

			<Modal
				isOpen={Boolean(createStageId)}
				onClose={() => setCreateStageId(null)}
				title='Новая задача'
				description='Задачу может создать участник, капитан или наставник.'
				modalWidth='large'>
				{createStageId && (
					<WorkflowTaskForm
						initial={emptyForm(createStageId)}
						members={mockTeamMembers}
						submitText='Создать задачу'
						onSubmit={handleCreate}
						onCancel={() => setCreateStageId(null)}
					/>
				)}
			</Modal>

			<Modal
				isOpen={Boolean(selectedTask)}
				onClose={() => {
					setSelectedId(null);
					setIsEdit(false);
				}}
				title={selectedTask?.title}
				description={isEdit ? 'Редактирование задачи' : 'Карточка задачи'}
				modalWidth='large'>
				{selectedTask &&
					(isEdit ? (
						<WorkflowTaskForm
							initial={{
								title: selectedTask.title,
								description: selectedTask.description,
								stageId: selectedTask.stageId,
								status: selectedTask.status,
								assigneeIds: selectedTask.assigneeIds,
								startAt: selectedTask.startAt || '',
								dueAt: selectedTask.dueAt,
							}}
							members={mockTeamMembers}
							submitText='Сохранить'
							onSubmit={handleUpdate}
							onCancel={() => setIsEdit(false)}
						/>
					) : (
						<WorkflowTaskDetail
							task={selectedTask}
							members={mockTeamMembers}
							onChangeStatus={handleStatus}
							onAddComment={handleComment}
							onEdit={() => setIsEdit(true)}
							onDelete={() => setDeleteId(selectedTask.id)}
						/>
					))}
			</Modal>

			<ConfirmDelete
				isOpen={Boolean(deleteId)}
				onClose={() => setDeleteId(null)}
				id={deleteId || 0}
				onSubmit={(id) => {
					setTasks((prev) => prev.filter((task) => task.id !== id));
					setDeleteId(null);
					setSelectedId(null);
					setIsEdit(false);
				}}
			/>
		</div>
	);
};
