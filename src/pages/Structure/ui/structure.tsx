import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { StructureHeader } from './structure-header';
import { StructureNormsList } from './structure-norms-list';
import { StructureHashtags } from './structure-hashtags';
import { StructureUsers } from './structure-users';

export const Structure: FC = () => {
	return (
		<Routes>
			<Route path='tabs' element={<StructureHeader />}>
				<Route path='norm' element={<StructureNormsList />} />
				<Route path='hashtag' element={<StructureHashtags />} />
				<Route path='users' element={<StructureUsers />} />
				<Route index element={<Navigate to='norm' replace />} />
			</Route>
			<Route index element={<Navigate to='tabs' replace />} />
		</Routes>
	);
};
