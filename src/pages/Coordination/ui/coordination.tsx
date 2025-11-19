import type { FC } from 'react';
import type { ITab } from '../../../shared/components/Tabs/types/types';

import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../../store/store';

import { CoordinationTabs } from './coordination-tabs';
import { CoordinationAppDetail } from './coordination-app-detail';
import { CoordinationAppsList } from './coordination-apps-list';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';

import { getCoordinationAppsAction } from '../../../store/coordination/actions';
import { filterAppsByRole } from '../lib/helpers';

export const Coordination: FC = () => {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.user);
	const userRole = user?.role || 'user';
	const { applications } = useSelector((state) => state.coordination);
	const { isLoadingApps } = useSelector((state) => state.coordination);

	useEffect(() => {
		dispatch(getCoordinationAppsAction());
	}, [dispatch]);

	const { active, returned, rejected, completed } = useMemo(
		() => filterAppsByRole(applications, userRole),
		[applications, userRole]
	);

	const tabs: ITab[] = [
		{
			label: 'На рассмотрении',
			path: '/main/coordination/tabs/active',
			count: active.length,
		},
		{
			label: 'Согласованные',
			path: '/main/coordination/tabs/completed',
			count: completed.length,
		},
		{
			label: 'Отправлены на доработку',
			path: '/main/coordination/tabs/returned',
			count: returned.length,
		},
		{
			label: 'Отклоненные',
			path: '/main/coordination/tabs/rejected',
			count: rejected.length,
		},
	];

	if (isLoadingApps) return <Preloader />;

	return (
		<Routes>
			<Route path='tabs' element={<CoordinationTabs tabs={tabs} />}>
				<Route
					path='active'
					element={
						<CoordinationAppsList
							apps={active}
							description='Эти заявки находятся на этапе согласования. Проверьте данные, оставьте комментарии и примите решение'
						/>
					}
				/>
				<Route
					path='completed'
					element={
						<CoordinationAppsList
							apps={completed}
							description='Заявки, которые прошли согласование. Доступны для просмотра и анализа'
						/>
					}
				/>
				<Route
					path='returned'
					element={
						<CoordinationAppsList
							apps={returned}
							description='Заявки возвращены для внесения изменений и обновления данных'
						/>
					}
				/>
				<Route
					path='rejected'
					element={
						<CoordinationAppsList
							apps={rejected}
							description='По этим заявкам принято решение об отказе с причиной отклонения'
						/>
					}
				/>
				<Route index element={<Navigate to='active' replace />} />
			</Route>

			<Route path='app/:appId' element={<CoordinationAppDetail />} />
			<Route index element={<Navigate to='tabs' replace />} />
		</Routes>
	);
};
