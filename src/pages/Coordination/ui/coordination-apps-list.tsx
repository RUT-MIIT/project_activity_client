import type { FC } from 'react';
import type { IApplicationItem } from '../../../store/application/types';
import type { ICoordinationAppsListProps } from '../types/types';

import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';

import { AppCard } from '../../Application/components/AppCard/ui/app-card';
import { Text } from '../../../shared/components/Typography';
import { CoordinationAppsTable } from './coordination-apps-table';
import { Filter } from '../../../shared/components/Filter/ui/filter';
import { Select } from '../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { ViewSwitcher } from '../../../shared/components/ViewSwitcher/ui/view-switcher';

import { EMAINROUTES } from '../../../shared/utils/routes';
import { sortOptions, type ISortOption } from '../lib/lib';

import styles from '../styles/coordination.module.scss';

export const CoordinationAppsList: FC<ICoordinationAppsListProps> = ({
	apps,
	description,
}) => {
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState('');
	const [currentSortOption, setCurrentSortOption] =
		useState<ISortOption | null>(sortOptions[0]);
	const [currentCompany, setCurrentCompany] = useState<ISortOption | null>(
		null
	);
	const [filteredApps, setFilteredApps] = useState(apps);
	const [activeView, setActiveView] = useState<string>(() => {
		const view = localStorage.getItem('coordinationView');
		return view ?? 'cards';
	});

	const companyOptions = useMemo<ISortOption[]>(() => {
		const map = new Map<string, ISortOption>();
		let counter = 1;

		apps.forEach((app) => {
			if (app.company && !map.has(app.company)) {
				map.set(app.company, { id: counter++, name: app.company });
			}
		});

		return [...Array.from(map.values())];
	}, [apps]);

	const showHistoryApp = (id: number) => {
		navigate(`/${EMAINROUTES.COORDINATION}/history/${id}`);
	};

	const showDetailApp = (id: number) => {
		navigate(`/${EMAINROUTES.COORDINATION}/app/${id}`);
	};

	const sortApps = (apps: IApplicationItem[], option: ISortOption) => {
		switch (option.id) {
			case 1: // По дате
				return [...apps].sort(
					(a, b) =>
						new Date(b.creation_date).getTime() -
						new Date(a.creation_date).getTime()
				);

			case 2: // По имени (title)
				return [...apps].sort((a, b) => a.title.localeCompare(b.title));

			case 3: // По автору
				return [...apps].sort((a, b) =>
					a.author_short_name.localeCompare(b.author_short_name)
				);

			case 4: // По номеру заявки (id)
				return [...apps].sort((a, b) => a.id - b.id);

			default:
				return apps;
		}
	};

	const sortedApps = useMemo(() => {
		if (!currentSortOption) {
			return filteredApps;
		}
		return sortApps(filteredApps, currentSortOption);
	}, [filteredApps, currentSortOption]);

	useEffect(() => {
		let result = apps;

		// фильтр компании
		if (currentCompany) {
			const selected = companyOptions.find(
				(opt) => opt.id === currentCompany.id
			);
			if (selected) {
				result = result.filter((app) => app.company === selected.name);
			}
		}

		// фильтр поиска
		if (searchQuery.trim() !== '') {
			result = result.filter((app) =>
				app.title.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		setFilteredApps(result);
	}, [apps, currentCompany, searchQuery, companyOptions]);

	if (apps.length < 1) {
		return <Text text='Заявки не найдены.' color='grey' withMarginTop />;
	}

	return (
		<>
			<p className={styles.description}>{description || ''}</p>

			<div className={styles.header}>
				<Filter
					placeholder='Поиск по названию заявки...'
					onFilter={setSearchQuery}
				/>
				<SelectWithSearch
					placeholder='Выберите компанию..'
					currentOption={currentCompany}
					options={companyOptions}
					onChooseOption={(opt) => setCurrentCompany(opt)}
					width='medium'
				/>
				<Select
					placeholder='Выберите компанию..'
					currentOption={currentSortOption}
					options={sortOptions}
					onChooseOption={setCurrentSortOption}
					width='default'
					withClear={false}
				/>

				<ViewSwitcher
					defaultView={activeView}
					storageKey='coordinationView'
					onChange={(view) => setActiveView(view)}
				/>
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
