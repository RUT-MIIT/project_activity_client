import type { FC } from 'react';
import type { ITagListProps } from '../types/types';

import { Text } from '../../Typography';
import { Tag } from './tag';

import styles from '../styles/tag.module.scss';

export const TagList: FC<ITagListProps> = ({
	items,
	emptyText = 'Список пуст',
	onRemove,
}) => {
	return items.length > 0 ? (
		<ul className={styles.list}>
			{items.map((tag) => (
				<Tag name={tag.name} id={tag.id} key={tag.id} onRemove={onRemove} />
			))}
		</ul>
	) : (
		<Text text={emptyText} color='grey' />
	);
};
