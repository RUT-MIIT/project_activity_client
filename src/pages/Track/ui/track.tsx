import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { useSelector } from '../../../store/store';

import { TrackContainer } from './track-container';
import { CreateTrackForm } from './create-track-form';
import { TrackInfoList } from './track-info-list';
import { TrackGroupList } from './track-group-list';
import { TrackProjectList } from './track-project-list';

export const Track: FC = () => {
	const { user } = useSelector((state) => state.user);
	const { selectedInstitute } = useSelector((state) => state.track);

	const isCpds = user?.role === 'cpds';

	return (
		<Routes>
			{/* Страница выбора подразделения для CPDS */}
			<Route
				path='info'
				element={isCpds ? <TrackInfoList /> : <Navigate to='tabs' replace />}
			/>

			{/* Основные вкладки */}
			<Route
				path='tabs'
				element={
					isCpds && !selectedInstitute ? (
						<Navigate to='info' replace />
					) : (
						<TrackContainer />
					)
				}>
				{isCpds ? (
					<>
						<Route path='group' element={<TrackGroupList />} />

						<Route path='project' element={<TrackProjectList />} />

						<Route index element={<Navigate to='group' replace />} />
					</>
				) : (
					<>
						<Route path='create' element={<CreateTrackForm />} />

						<Route path='group' element={<TrackGroupList />} />

						<Route path='project' element={<TrackProjectList />} />

						<Route index element={<Navigate to='create' replace />} />
					</>
				)}
			</Route>

			{/* Корневой редирект */}
			<Route
				index
				element={
					isCpds ? (
						<Navigate to='info' replace />
					) : (
						<Navigate to='tabs' replace />
					)
				}
			/>

			{/* Защита неизвестных путей */}
			<Route
				path='*'
				element={
					isCpds ? (
						<Navigate to='info' replace />
					) : (
						<Navigate to='tabs' replace />
					)
				}
			/>
		</Routes>
	);
};
