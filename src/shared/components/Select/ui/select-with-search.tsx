import { useState, useEffect, useRef } from 'react';
import type { ISelectProps } from '../types/types';
import { useOnClickOutside } from '../../../../hooks/useOnClickOutside';

import styles from '../styles/select.module.scss';

export const SelectWithSearch = <T,>({
	options,
	currentOption,
	onChooseOption,
	valueKey = 'id' as keyof T,
	labelKey = 'name' as keyof T,
	width = 'full',
	placeholder = 'Выберите значение...',
}: ISelectProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [filtered, setFiltered] = useState<T[]>(options);

	const selectRef = useRef<HTMLDivElement>(null);

	const getValue = (item: T) => String(item[valueKey]);
	const getLabel = (item: T) => String(item[labelKey]);

	useOnClickOutside(selectRef, () => setIsOpen(false));

	useEffect(() => {
		setFiltered(options);
	}, [options]);

	const handleChoose = (option: T, e: React.MouseEvent) => {
		e.stopPropagation(); // <-- важно!
		onChooseOption(option);
		setSearchText('');
		setIsOpen(false);
		setFiltered(options);
	};

	const toggleOpen = () => setIsOpen((prev) => !prev);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const text = e.target.value;
		setSearchText(text);

		const lowered = text.toLowerCase();
		setFiltered(
			options.filter((item) => getLabel(item).toLowerCase().includes(lowered))
		);
	};

	return (
		<div
			ref={selectRef}
			className={`${styles.select} ${
				width === 'default' ? styles.select_width_default : ''
			} ${isOpen ? styles.select_open : ''}`}
			onClick={toggleOpen}>
			<div className={styles.main}>
				{isOpen ? (
					<input
						autoFocus
						value={searchText}
						onChange={handleSearch}
						placeholder={currentOption ? getLabel(currentOption) : placeholder}
						className={styles.search}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<p
						className={`${styles.title} ${
							!currentOption || getValue(currentOption) === '0'
								? styles.text_empty
								: ''
						}`}>
						{currentOption ? getLabel(currentOption) : placeholder}
					</p>
				)}

				<div
					className={`${styles.arrow} ${
						isOpen ? styles.arrow_status_open : ''
					}`}
				/>
			</div>

			<div
				className={`${styles.options} ${
					isOpen ? styles.options_status_open : ''
				}`}>
				<ul className={styles.list}>
					{filtered.length > 0 ? (
						filtered
							.filter((item) =>
								currentOption
									? getValue(item) !== getValue(currentOption)
									: true
							)
							.map((item) => (
								<li
									key={getValue(item)}
									className={styles.item}
									onClick={(e) => handleChoose(item, e)}>
									<p className={styles.text}>{getLabel(item)}</p>
								</li>
							))
					) : (
						<li className={styles.item}>
							<p className={`${styles.text} ${styles.text_empty}`}>
								Результаты не найдены
							</p>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
};
