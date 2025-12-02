import type { FC } from 'react';
import type { ICheckboxProps } from '../types/types';

import styles from '../styles/checkbox.module.scss';

export const Checkbox: FC<ICheckboxProps> = ({
	checked,
	onChange,
	disabled = false,
	children,
	label,
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked);
	};

	return (
		// Контейнер НЕ является кликабельным
		<div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
			{/* Сам чекбокс кликабелен */}
			<input
				type='checkbox'
				checked={checked}
				disabled={disabled}
				onChange={handleChange}
				className={styles.checkbox}
			/>

			{/* Если есть children — рендерим */}
			{children && <div className={styles.text}>{children}</div>}

			{/* Если есть label — рендерим (не кликабельно) */}
			{label && !children && <span className={styles.text}>{label}</span>}
		</div>
	);
};
