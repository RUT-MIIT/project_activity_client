import type { FC } from 'react';

import { useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from '../../../../../store/store';

import { CardStats } from '../../../../../shared/components/Card/ui';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { GroupsChart } from './groups-chart';
import { GroupsFillRateChart } from './groups-fill-rate-chart';
import { GroupsTable } from './groups-table';

import { getGroupsStatsAction } from '../../../../../store/dashboard/actions';
import { getGroupsStats } from '../lib/helpers';

import styles from '../styles/groups.module.scss';

export const Groups: FC = () => {
	const dispatch = useDispatch();

	const { groups, selectedInstitute, selectedCourse, isLoadingGroups } =
		useSelector((state) => state.dashboard);

	useEffect(() => {
		dispatch(getGroupsStatsAction());
	}, [dispatch]);

	const filteredGroups = useMemo(() => {
		return groups.filter((group) => {
			const matchesInstitute =
				!selectedInstitute || group.institute.id === selectedInstitute;

			const matchesCourse = !selectedCourse || group.course === selectedCourse;

			return matchesInstitute && matchesCourse;
		});
	}, [groups, selectedInstitute, selectedCourse]);

	const groupsStats = useMemo(
		() => getGroupsStats(filteredGroups),
		[filteredGroups]
	);

	if (isLoadingGroups) {
		return <Preloader />;
	}

	return (
		<div className={styles.groups}>
			<ul className={styles.cards}>
				{groupsStats.map((item) => (
					<CardStats
						key={item.id}
						label={item.label}
						value={item.value}
						subtext={item.subtext}
						color={item.color}
					/>
				))}
			</ul>

			<div className={styles.row}>
				<GroupsChart groups={groups} />
				<GroupsFillRateChart groups={groups} />
			</div>

			<GroupsTable groups={filteredGroups} />
		</div>
	);
};
