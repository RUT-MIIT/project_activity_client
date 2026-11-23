import type {
	ITaskMember,
	ITaskStage,
	IWorkflowTask,
	TStageState,
	TTaskStageId,
	TTaskStatus,
} from '../types/tasks';

export const taskStages: ITaskStage[] = [
	{
		id: 1,
		title: 'Анализ проекта, планирование и постановка требований',
		shortTitle: 'Анализ и планирование',
		description:
			'Команда знакомится с задачей, определяет проблему, цели и требования заказчика.',
	},
	{
		id: 2,
		title: 'Исследование и разработка идеи решения',
		shortTitle: 'Исследование и идея',
		description:
			'Сбор информации, анализ существующих решений и формирование концепции.',
	},
	{
		id: 3,
		title: 'Реализация решения',
		shortTitle: 'Реализация',
		description:
			'Практическая работа над проектом и подготовка прототипа или рабочей версии.',
	},
	{
		id: 4,
		title: 'Тестирование и доработка',
		shortTitle: 'Тестирование',
		description: 'Проверка результата, сбор обратной связи и устранение недостатков.',
	},
	{
		id: 5,
		title: 'Подготовка к защите и представление результатов',
		shortTitle: 'Подготовка к защите',
		description: 'Оформление материалов и демонстрация итогов работы.',
	},
];

export const getTaskStatusText = (status: TTaskStatus) => {
	switch (status) {
		case 'todo':
			return 'К выполнению';
		case 'in_progress':
			return 'В работе';
		case 'review':
			return 'На проверке';
		case 'done':
			return 'Выполнено';
		default:
			return status;
	}
};

export const getTaskStatusColor = (
	status: TTaskStatus
): 'grey' | 'yellow' | 'purple' | 'green' => {
	switch (status) {
		case 'todo':
			return 'grey';
		case 'in_progress':
			return 'yellow';
		case 'review':
			return 'purple';
		case 'done':
			return 'green';
		default:
			return 'grey';
	}
};

export const getStageStateText = (state: TStageState) => {
	switch (state) {
		case 'not_started':
			return 'Не начат';
		case 'in_progress':
			return 'В работе';
		case 'completed':
			return 'Завершён';
		default:
			return state;
	}
};

export const getStageStateColor = (
	state: TStageState
): 'grey' | 'yellow' | 'green' => {
	switch (state) {
		case 'not_started':
			return 'grey';
		case 'in_progress':
			return 'yellow';
		case 'completed':
			return 'green';
		default:
			return 'grey';
	}
};

export const formatTaskDate = (value?: string) => {
	if (!value) {
		return '';
	}

	const [year, month, day] = value.split('-');

	return `${day}.${month}.${year}`;
};

export const getTaskAssignees = (
	task: IWorkflowTask,
	members: ITaskMember[]
) => {
	return members.filter((member) => task.assigneeIds.includes(member.id));
};

export const getMemberNameParts = (fullName: string) => {
	const [lastName = '', firstName = ''] = fullName.split(' ');

	return { firstName, lastName };
};

export const getStageTasks = (
	tasks: IWorkflowTask[],
	stageId: TTaskStageId
) => {
	return tasks.filter((task) => task.stageId === stageId);
};

export const getStageProgress = (
	tasks: IWorkflowTask[],
	stageId: TTaskStageId
) => {
	const list = getStageTasks(tasks, stageId);
	const total = list.length;
	const done = list.filter((task) => task.status === 'done').length;
	const inProgress = list.filter((task) => task.status === 'in_progress').length;
	const review = list.filter((task) => task.status === 'review').length;
	const todo = list.filter((task) => task.status === 'todo').length;
	const state: TStageState =
		total === 0 ? 'not_started' : done === total ? 'completed' : 'in_progress';

	return {
		total,
		done,
		inProgress,
		review,
		todo,
		percent: total === 0 ? 0 : Math.round((done / total) * 100),
		state,
	};
};

export const getOverallTaskProgress = (tasks: IWorkflowTask[]) => {
	const total = tasks.length;
	const done = tasks.filter((task) => task.status === 'done').length;

	return {
		total,
		done,
		percent: total === 0 ? 0 : Math.round((done / total) * 100),
	};
};

export const getCurrentStage = (tasks: IWorkflowTask[]) => {
	const inProgress = taskStages.find(
		(stage) => getStageProgress(tasks, stage.id).state === 'in_progress'
	);

	if (inProgress) {
		return inProgress;
	}

	const notStarted = taskStages.find(
		(stage) => getStageProgress(tasks, stage.id).state === 'not_started'
	);

	return notStarted || taskStages[taskStages.length - 1];
};

export const getMemberTasks = (tasks: IWorkflowTask[], memberId: number) => {
	return tasks.filter((task) => task.assigneeIds.includes(memberId));
};

export const getMemberProgress = (tasks: IWorkflowTask[], memberId: number) => {
	return getOverallTaskProgress(getMemberTasks(tasks, memberId));
};

const statusOrder: Record<TTaskStatus, number> = {
	in_progress: 0,
	review: 1,
	todo: 2,
	done: 3,
};

export const getPreviewTasks = (tasks: IWorkflowTask[], limit = 4) => {
	return [...tasks]
		.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
		.slice(0, limit);
};

export const createHistoryItem = (text: string, id: number) => {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');

	return {
		id,
		text,
		createdAt: `${day}.${month}.${now.getFullYear()}`,
	};
};