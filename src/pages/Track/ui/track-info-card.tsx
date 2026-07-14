import type { FC } from 'react';
import type { IInstituteTrackStats } from '../../../store/track/types';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../store/store';

import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { Badge } from '../../../shared/components/Badge/ui/badge';

import { setSelectedInstitute } from '../../../store/track/reducer';

import styles from '../styles/track-info-card.module.scss';

interface ITrackInfoCardProps {
	stats: IInstituteTrackStats;
}

export const TrackInfoCard: FC<ITrackInfoCardProps> = ({ stats }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSelectInstitute = (code: string) => {
		dispatch(setSelectedInstitute(code));

		navigate('/track/tabs/list');
	};

	return (
		<div
			className={styles.card}
			onClick={() => handleSelectInstitute(stats.institute_code)}>
			<h3 className={styles.title}>{stats.institute_name}</h3>

			<Badge text={stats.institute_code} />

			<ProgressBar
				value={stats.distributed_projects}
				max={stats.total_projects}
				withInfo
				caption={`Распределено ${stats.distributed_projects} из ${stats.total_projects}`}
			/>

			<div className={styles.grid}>
				<div className={styles.item}>
					<span>Всего проектов</span>
					<strong>{stats.total_projects}</strong>
				</div>

				<div className={styles.item}>
					<span>Среднее на группу</span>
					<strong>{stats.average_projects_per_group.toFixed(1)}</strong>
				</div>

				<div className={styles.item}>
					<span>Распределено</span>
					<strong>{stats.distributed_projects}</strong>
				</div>

				<div className={styles.item}>
					<span>Без проектов</span>
					<strong>{stats.groups_without_projects}</strong>
				</div>
			</div>
		</div>
	);
};
