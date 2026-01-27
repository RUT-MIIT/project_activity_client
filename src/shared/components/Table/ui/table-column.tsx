import type { FC } from 'react';
import type { ITableColumnProps } from '../types/types';

import styles from '../styles/table.module.scss';

export const TableColumn: FC<ITableColumnProps> = ({
	text,
	textWeight = 'normal',
	textColor = 'default',
	columnType = 'default',
	alignType = 'left',
	columnSize,
	onClick,
	id,
	withChildren = false,
	active = false,
	children,
}) => {
	return (
		<div
			className={[
				styles.table__column,
				styles[`table__column_type_${columnType}`],
				styles[`table__column_align_${alignType}`],
				columnSize ? styles[`table__column_size_${columnSize}`] : '',
				onClick ? styles.table__column_clickable : '',
			].join(' ')}>
			{!withChildren && (
				<p
					className={[
						styles.table__text,
						active ? styles.table__text_active : '',
						styles[`table__text_weight_${textWeight}`],
						styles[`table__text_color_${textColor}`],
					].join(' ')}
					onClick={onClick && id ? () => onClick(id) : undefined}>
					{text}
				</p>
			)}

			{children}
		</div>
	);
};
