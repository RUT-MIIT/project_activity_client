import type { FC } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { TrackNorms } from './track-norms';
import { TrackInfoCard } from './track-info-card';

import { getSubdivisionStatsAction } from '../../../store/track/actions';

import styles from '../styles/track-info-list.module.scss';

export const TrackInfoList: FC = () => {
	const dispatch = useDispatch();
	const { subdivisionStats, isLoadingStats } = useSelector(
		(state) => state.track
	);
	const { user } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(getSubdivisionStatsAction());
	}, [dispatch, user]);

	if (isLoadingStats) return <Preloader />;

	return (
		subdivisionStats && (
			<>
				<TrackNorms stats={subdivisionStats.overall} />
				<div className={styles.grid}>
					{subdivisionStats.by_institute.map((item) => (
						<TrackInfoCard key={item.institute_code} stats={item} />
					))}
				</div>
			</>
		)
	);
};
