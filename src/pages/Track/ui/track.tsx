import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { TrackContainer } from './track-container';
import { CreateTrackForm } from './create-track-form';

export const Track: FC = () => {
	return (
		<Routes>
			<Route path='tabs' element={<TrackContainer />}>
				<Route path='create' element={<CreateTrackForm />} />
				<Route path='view' element={<div></div>} />
				<Route index element={<Navigate to='create' replace />} />
			</Route>
			<Route index element={<Navigate to='tabs' replace />} />
		</Routes>
	);
};
