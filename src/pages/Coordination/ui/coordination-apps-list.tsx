import type { FC } from 'react';
import type { ICoordinationAppsListProps } from '../types/types';

import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

import { AppCard } from '../../Application/components/AppCard/ui/app-card';
import { Text } from '../../../shared/components/Typography';
import { CoordinationAppsTable } from './coordination-apps-table';
import { Filter } from '../../../shared/components/Filter/ui/filter';

import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/coordination.module.scss';

const viewOptions = [
	{ id: 'cards', name: 'Плитка' },
	{ id: 'table', name: 'Таблица' },
];

export const CoordinationAppsList: FC<ICoordinationAppsListProps> = ({
	apps,
	description,
}) => {
	const navigate = useNavigate();

	const [filteredApps, setFilteredApps] = useState(apps);
	const [activeView, setActiveView] = useState<'cards' | 'table'>(() => {
		const saved = localStorage.getItem('coordinationView');
		return saved === 'cards' || saved === 'table' ? saved : 'cards';
	});

	const showHistoryApp = (id: number) => {
		navigate(`/${EMAINROUTES.COORDINATION}/history/${id}`);
	};

	const showDetailApp = (id: number) => {
		navigate(`/${EMAINROUTES.COORDINATION}/app/${id}`);
	};

	useEffect(() => {
		localStorage.setItem('coordinationView', activeView);
	}, [activeView]);

	const sortedApps = useMemo(() => filteredApps, [filteredApps]);

	useEffect(() => {
		setFilteredApps(apps);
	}, [apps]);

	if (apps.length < 1) {
		return <Text text='Заявки не найдены.' color='grey' withMarginTop />;
	}

	return (
		<>
			<p className={styles.description}>{description || ''}</p>

			<div className={styles.header}>
				<Filter
					data={apps}
					searchKey='title'
					placeholder='Поиск по названию заявки...'
					onFilter={setFilteredApps}
				/>

				<div className={styles.view}>
					{viewOptions.map((option) => (
						<button
							key={option.id}
							className={`${styles.view__btn} ${
								activeView === option.id ? styles.view__btn_active : ''
							}`}
							onClick={() => setActiveView(option.id as 'cards' | 'table')}>
							{option.name}
						</button>
					))}
				</div>
			</div>

			{sortedApps.length > 0 ? (
				activeView === 'cards' ? (
					<ul className={styles.cards}>
						{sortedApps.map((app) => (
							<AppCard
								card={app}
								key={app.id}
								withAuthor
								onShowHistory={showHistoryApp}
								onShowDetail={showDetailApp}
							/>
						))}
					</ul>
				) : (
					<CoordinationAppsTable
						apps={sortedApps}
						onShowHistory={showHistoryApp}
						onShowDetail={showDetailApp}
					/>
				)
			) : (
				<Text text='Заявки не найдены.' color='grey' withMarginTop />
			)}
		</>
	);
};
