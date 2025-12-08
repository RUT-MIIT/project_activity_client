import type { ChangeEvent } from 'react';
import type { ISearchProps } from '../types/types';

import { useState } from 'react';

import styles from '../styles/search.module.scss';

export const Search = <T,>({
	data,
	searchKey,
	placeholder = 'Поиск...',
	onFilter,
}: ISearchProps<T>) => {
	const [query, setQuery] = useState('');
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		const filtered = data.filter((item) => {
			const fieldValue = item[searchKey];
			return (
				typeof fieldValue === 'string' &&
				fieldValue.toLowerCase().includes(value.toLowerCase())
			);
		});
		onFilter(filtered);
	};

	return (
		<input
			className={styles.search}
			type='text'
			placeholder={placeholder}
			value={query}
			onChange={handleChange}
		/>
	);
};
