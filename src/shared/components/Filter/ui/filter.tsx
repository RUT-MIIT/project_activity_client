import type { FC, ChangeEvent } from 'react';
import type { IFilterProps } from '../types/types';
import { useState } from 'react';

import styles from '../styles/filter.module.scss';

export const Filter: FC<IFilterProps> = ({
	placeholder = 'Поиск...',
	onFilter,
}) => {
	const [query, setQuery] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		onFilter(value);
	};

	return (
		<input
			className={styles.filter}
			type='text'
			placeholder={placeholder}
			value={query}
			onChange={handleChange}
		/>
	);
};
