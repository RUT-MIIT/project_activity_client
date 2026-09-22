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
	withMarginAuto?: boolean;
}

export type TStatsCardColor =
	| 'blue'
	| 'green'
	| 'yellow'
	| 'red'
	| 'purple'
	| 'default';

export interface ICardStatsProps {
	label: string;
	value: string | number;
	subtext?: string;
	unit?: string;
	color?: TStatsCardColor;
}
