export type TTaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TTaskStageId = 1 | 2 | 3 | 4 | 5;

export type TTaskMemberRole = 'leader' | 'member' | 'mentor';

export type TStageState = 'not_started' | 'in_progress' | 'completed';

export interface ITaskMember {
	id: number;
	fullName: string;
	role: TTaskMemberRole;
}

export interface ITaskComment {
	id: number;
	author: string;
	authorRole: TTaskMemberRole;
	text: string;
	createdAt: string;
}

export interface ITaskFile {
	id: number;
	name: string;
	size: string;
	uploadedAt: string;
	author: string;
}

export interface ITaskLink {
	id: number;
	label: string;
	url: string;
}

export interface ITaskHistoryItem {
	id: number;
	text: string;
	createdAt: string;
}

export interface IWorkflowTask {
	id: number;
	title: string;
	description: string;
	stageId: TTaskStageId;
	status: TTaskStatus;
	assigneeIds: number[];
	startAt?: string;
	dueAt: string;
	comments: ITaskComment[];
	files: ITaskFile[];
	links: ITaskLink[];
	history: ITaskHistoryItem[];
}

export interface ITaskStage {
	id: TTaskStageId;
	title: string;
	shortTitle: string;
	description: string;
}

export interface ITaskFormValues {
	title: string;
	description: string;
	stageId: TTaskStageId;
	status: TTaskStatus;
	assigneeIds: number[];
	startAt: string;
	dueAt: string;
}
