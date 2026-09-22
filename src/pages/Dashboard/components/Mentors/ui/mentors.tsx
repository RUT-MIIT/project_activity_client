import type { FC } from 'react';

import { useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from '../../../../../store/store';

import { CardStats } from '../../../../../shared/components/Card/ui';

import { MentorsLoadChart } from './mentors-load-chart';
import { MentorsInstituteChart } from './mentors-institute-chart';
import { MentorsTable } from './mentors-table';

import { getMentorsStats } from '../lib/helpers';
import { getMentorsAction } from '../../../../../store/dashboard/actions';

import styles from '../styles/mentors.module.scss';

export const Mentors: FC = () => {
	const dispatch = useDispatch();

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const mentors = useSelector((state) => state.dashboard.mentors);

	useEffect(() => {
		dispatch(getMentorsAction());
	}, [dispatch]);

	const filteredMentors = useMemo(() => {
		return mentors.filter((mentor) => {
			return !selectedInstitute || mentor.institute.id === selectedInstitute;
		});
	}, [mentors, selectedInstitute]);

	const mentorsStats = useMemo(
		() => getMentorsStats(filteredMentors),
		[filteredMentors]
	);

	return (
		<div className={styles.mentors}>
			<ul className={styles.cards}>
				{mentorsStats.map((item) => (
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
				<MentorsInstituteChart mentors={mentors} />

				<MentorsLoadChart mentors={filteredMentors} />
			</div>

			<MentorsTable mentors={filteredMentors} />
		</div>
	);
};
