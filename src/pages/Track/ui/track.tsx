import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { TrackContainer } from './track-container';
import { CreateTrackForm } from './create-track-form';
import { TrackGroupList } from './track-group-list';
import { TrackProjectList } from './track-project-list';

export const Track: FC = () => {
	return (
		<Routes>
			<Route path='tabs' element={<TrackContainer />}>
				<Route path='create' element={<CreateTrackForm />} />
				<Route path='group' element={<TrackGroupList />} />
				<Route path='project' element={<TrackProjectList />} />
				<Route index element={<Navigate to='create' replace />} />
			</Route>
			<Route index element={<Navigate to='tabs' replace />} />
		</Routes>
	);
};
