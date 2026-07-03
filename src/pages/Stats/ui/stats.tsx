import type { FC } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Section } from '../../../shared/components/Section';
import { StatsCards } from './stats-cards';
import { RatingChart } from './rating-chart';
import { DistributionChart } from './distribution-chart';
import { StatusChart } from './status-chart';
import { Card } from '../../../shared/components/Card/ui';

import { getStatsAction } from '../../../store/stats/actions';
import { setInstitute } from '../../../store/stats/reducer';

import styles from '../styles/stats.module.scss';

export const Stats: FC = () => {
	const dispatch = useDispatch();
	const { stats } = useSelector((state) => state.stats);

	useEffect(() => {
		dispatch(getStatsAction());
	}, [dispatch]);

	const handleInstituteClick = (code: string) => {
		dispatch(setInstitute(code));
		dispatch(getStatsAction({ institute_code: code }));
	};

	if (!stats) {
		return <Preloader />;
	}

	return (
		<Section sectionWidth='full'>
			<div className={styles.container}>
				<Card>Фильтры</Card>
				<StatsCards />
				<RatingChart
					chart={stats.rating_chart}
					onInstituteClick={handleInstituteClick}
				/>
				<div className={styles.container__row}>
					<DistributionChart chart={stats.application_type_distribution} />
				</div>
				<StatusChart chart={stats.status_distribution} />
			</div>
		</Section>
	);
};
