import type { FC } from 'react';
import type { ITagProps } from '../types/types';

import styles from '../styles/tag.module.scss';

export const Tag: FC<ITagProps> = ({ name, id, onRemove }) => {
	return (
		<li className={styles.item} key={id}>
			<span className={styles.remove} onClick={() => onRemove(id)}></span>
			{name}
		</li>
	);
};
