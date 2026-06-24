import type { FC } from 'react';
import type { ISearchInputProps } from '../types/types';

import styles from '../styles/search.module.scss';

export const SearchInput: FC<ISearchInputProps> = ({
	placeholder = 'Поиск...',
	value = '',
	onChange,
}) => {
	return (
		<input
			className={styles.search}
			type='text'
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
};
