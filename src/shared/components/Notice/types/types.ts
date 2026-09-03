import type { ReactNode, CSSProperties } from 'react';

export type NoticeType = 'info' | 'warning' | 'error' | 'success';

export interface INoticeProps {
	type: NoticeType;
	title: string;
	text?: string;
	button?: ReactNode;
	style?: CSSProperties;
}
