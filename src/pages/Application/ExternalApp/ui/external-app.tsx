import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { ExternalAppList } from './external-app-list';
import { ExternalAppDetail } from './external-app-detail';

export const ExternalApp: FC = () => {
	return (
		<Routes>
			<Route path='list' element={<ExternalAppList />} />
			<Route path='app/:appId' element={<ExternalAppDetail />} />
			<Route index element={<Navigate to='list' replace />} />
		</Routes>
	);
};
