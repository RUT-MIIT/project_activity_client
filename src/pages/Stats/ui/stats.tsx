import type { FC } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Section } from '../../../shared/components/Section';
import { StatsCards } from './stats-cards';
import { RatingChart } from './rating-chart';
import { DistributionChart } from './distribution-chart';
import { ExternalChart } from './external-chart';
import { StatusChart } from './status-chart';

import { getStatsAction } from '../../../store/stats/actions';

import styles from '../styles/stats.module.scss';

export const Stats: FC = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const { stats, isLoading } = useSelector((state) => state.stats);

	useEffect(() => {
		if (!user) return;

		dispatch(
			getStatsAction(
				user.role === 'institute_validator'
					? { institute_code: String(user.institute_code) }
					: undefined
			)
		);
	}, [dispatch, user]);

	if (!stats) {
		return <Preloader />;
	}

	return (
		<Section sectionWidth='full'>
			<div className={styles.container}>
				<StatsCards />
				<RatingChart isLoading={isLoading} chart={stats.rating_chart} />
				<div className={styles.container__row}>
					<DistributionChart chart={stats.application_type_distribution} />
					<ExternalChart chart={stats.external_share_chart} />
				</div>
				<StatusChart chart={stats.status_distribution} />
			</div>
		</Section>
	);
};
