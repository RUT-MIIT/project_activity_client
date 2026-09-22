import type { FC } from 'react';

import { useMemo } from 'react';

import { useSelector } from '../../../../../store/store';

import { CardStats } from '../../../../../shared/components/Card/ui';
import { GroupsChart } from './groups-chart';
import { GroupsFillRateChart } from './groups-fill-rate-chart';
import { GroupsTable } from './groups-table';

import { groupsMock } from '../lib/mock';
import { getGroupsStats } from '../lib/helpers';

import styles from '../styles/groups.module.scss';

export const Groups: FC = () => {
	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const filteredGroups = useMemo(() => {
		if (!selectedInstitute) {
			return groupsMock;
		}

		return groupsMock.filter(
			(group) => group.institute.id === selectedInstitute
		);
	}, [selectedInstitute]);

	const groupsStats = useMemo(
		() => getGroupsStats(filteredGroups),
		[filteredGroups]
	);

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
				<GroupsChart />
				<GroupsFillRateChart />
			</div>

			<GroupsTable groups={filteredGroups} />
		</div>
	);
};
