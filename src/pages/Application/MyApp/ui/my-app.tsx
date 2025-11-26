import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { MyAppList } from './my-app-list';
import { MyAppDetail } from './my-app-detail';
import { MyAppHistory } from './my-app-history';

export const MyApp: FC = () => {
	return (
		<Routes>
			<Route path='list' element={<MyAppList />} />
			<Route path='app/:appId' element={<MyAppDetail />} />
			<Route path='history/:appId' element={<MyAppHistory />} />
			<Route index element={<Navigate to='list' replace />} />
		</Routes>
	);
};
