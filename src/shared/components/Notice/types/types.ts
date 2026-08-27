import type { ReactNode } from 'react';

export type NoticeType = 'info' | 'warning' | 'error' | 'success';

export interface INoticeProps {
	type: NoticeType;
	title: string;
	text?: string;
	button?: ReactNode;
}
