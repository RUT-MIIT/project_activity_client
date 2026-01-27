import type { ReactNode } from 'react';

export interface ITableProps {
	children?: ReactNode;
}

export interface ITableHeaderProps {
	children?: ReactNode;
	withControl?: boolean;
}

export interface ITableColumnProps {
	children?: ReactNode;
	withChildren?: boolean;
	text?: string | number;
	textWeight?: 'normal' | 'bold';
	textColor?: 'default' | 'grey' | 'blue' | 'red' | 'yellow' | 'green';
	columnType?: 'header' | 'default';
	alignType?: 'left' | 'right' | 'center';
	columnSize: string;
	active?: boolean;
	onClick?: (id: number) => void;
	id?: number;
}

export interface ITableControlProps {
	type?: 'default' | 'header';
	size?: number;
	children?: ReactNode;
}

export interface ITableTextProps {
	text: string;
	type?: 'default' | 'empty';
}
