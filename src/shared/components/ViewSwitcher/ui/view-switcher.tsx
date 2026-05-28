import type { IViewSwitcherProps } from '../types/types';

import { useEffect, useState } from 'react';

import { defaultOptions } from '../lib/lib';

import styles from '../styles/view-switcher.module.scss';

export const ViewSwitcher = <T extends string>({
	options = defaultOptions as never,
	defaultView,
	storageKey,
	onChange,
}: IViewSwitcherProps<T>) => {
	const [activeView, setActiveView] = useState<T>(() => {
		const saved = localStorage.getItem(storageKey);

		const found = options.find((opt) => opt.id === saved);

		return (found?.id ?? defaultView ?? options[0]?.id) as T;
	});

	const handleChangeView = (view: T) => {
		setActiveView(view);
		onChange(view);
	};

	useEffect(() => {
		localStorage.setItem(storageKey, activeView);
	}, [activeView, storageKey]);

	return (
		<div className={styles.view}>
			{options.map((option) => (
				<button
					key={option.id}
					type='button'
					className={`${styles.view__btn} ${
						activeView === option.id ? styles.view__btn_active : ''
					}`}
					onClick={() => handleChangeView(option.id)}>
					{option.name}
				</button>
			))}
		</div>
	);
};
