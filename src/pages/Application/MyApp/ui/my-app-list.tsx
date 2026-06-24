import type { FC } from 'react';
import type { IApplicationItem } from '../../../../store/application/types';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../../store/store';

import { Section } from '../../../../shared/components/Section/ui/section';
import { Preloader } from '../../../../shared/components/Preloader/ui/preloader';
import { Select } from '../../../../shared/components/Select/ui/select';
import { Search } from '../../../../shared/components/Search/ui/search';
import { Button } from '../../../../shared/components/Button/ui/button';
import { Text } from '../../../../shared/components/Typography';
import { AppCard } from '../../components/AppCard/ui/app-card';

import { getAppsAction } from '../../../../store/application/actions';
import { EMAINROUTES } from '../../../../shared/utils/routes';
import { sortOptions, type ISortOption } from '../lib/lib';

import styles from '../styles/my-app.module.scss';

export const MyAppList: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { applications, isLoading } = useSelector((state) => state.application);
	const [filteredApps, setFilteredApps] = useState<IApplicationItem[]>([]);
	const [currentSortOption, setCurrentSortOption] =
		useState<ISortOption | null>(sortOptions[0]);

	const createNewApp = () => {
		navigate(`/${EMAINROUTES.NEW_APP}`, {
			replace: true,
		});
	};

	const showHistoryApp = (id: number) => {
		navigate(`/${EMAINROUTES.MY_APPS}/history/${id}`);
	};

	const showDetailApp = (id: number) => {
		navigate(`/${EMAINROUTES.MY_APPS}/app/${id}`);
	};

	const sortApps = (apps: IApplicationItem[], option: ISortOption) => {
		switch (option.id) {
			case 1:
				return [...apps].sort(
					(a, b) =>
						new Date(b.creation_date).getTime() -
						new Date(a.creation_date).getTime()
				);
			case 2:
				return [...apps].sort((a, b) =>
					a.status.name.localeCompare(b.status.name)
				);
			case 3:
				return [...apps].sort((a, b) => a.title.localeCompare(b.title));

			default:
				return apps;
		}
	};

	const handleChangeSort = (option: ISortOption | null) => {
		setCurrentSortOption(option);
	};

	useEffect(() => {
		dispatch(getAppsAction());
	}, [dispatch]);

	useEffect(() => {
		setFilteredApps(applications);
	}, [applications]);

	const sortedApps = useMemo(() => {
		if (!currentSortOption) {
			return filteredApps;
		}

		return sortApps(filteredApps, currentSortOption);
	}, [filteredApps, currentSortOption]);

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Мои заявки' }}
			sectionDescription='Следите за статусом и обновляйте ваши заявки'
			withHeaderMargin>
			{isLoading ? (
				<Preloader />
			) : (
				<>
					<div className={styles.header}>
						<Search<IApplicationItem>
							data={applications}
							searchKey='title'
							placeholder='Поиск по названию...'
							onFilter={setFilteredApps}
						/>
						<Select
							currentOption={currentSortOption}
							options={sortOptions}
							onChooseOption={handleChangeSort}
							width='default'
							withClear={false}
						/>
						<Button
							text='Новая заявка'
							color='blue'
							style={{ margin: '0 0 0 auto' }}
							withIcon={{
								type: 'add',
								position: 'left',
								color: 'white',
							}}
							onClick={createNewApp}
						/>
					</div>
					{sortedApps.length > 0 ? (
						<ul className={styles.list}>
							{sortedApps.map((item) => (
								<AppCard
									card={item}
									key={item.id}
									onShowHistory={showHistoryApp}
									onShowDetail={showDetailApp}
									isAuthor={true}
								/>
							))}
						</ul>
					) : (
						<Text
							text='По заданным параметрам ничего не найдено'
							color='grey'
							withMarginTop
						/>
					)}
				</>
			)}
		</Section>
	);
};
