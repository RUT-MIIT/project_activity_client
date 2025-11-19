import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { MyAppList } from './my-app-list';
import { MyAppDetail } from './my-app-detail';

export const MyApp: FC = () => {
	return (
		<Routes>
			<Route path='list' element={<MyAppList />} />
			<Route path='app/:appId' element={<MyAppDetail />} />
			<Route index element={<Navigate to='list' replace />} />
		</Routes>
	);
};
