import type { ReactNode } from 'react';

export interface ICardProps {
	title?: string;
	subtitle?: string;
	withHeightStretch?: boolean;
	width?: 'default' | 'content' | 'full';
	children?: ReactNode;
}

export interface ICardControlProps {
	children?: ReactNode;
}
