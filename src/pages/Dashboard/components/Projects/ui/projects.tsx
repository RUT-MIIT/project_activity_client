import type { FC } from 'react';

import { useMemo } from 'react';
import { useSelector } from '../../../../../store/store';

import { CardStats } from '../../../../../shared/components/Card/ui';
import { ProjectsInstituteChart } from './projects-institute-chart';
import { ProjectsAverageTeamsChart } from './projects-average-teams-chart';
import { ProjectsTable } from './projects-table';

import { projectsMock } from '../lib/mock';
import { getProjectsStats } from '../lib/helpers';

import styles from '../styles/projects.module.scss';

export const Projects: FC = () => {
	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const filteredProjects = useMemo(() => {
		if (!selectedInstitute) {
			return projectsMock;
		}

		return projectsMock.filter(
			(project) => project.institute.id === selectedInstitute
		);
	}, [selectedInstitute]);

	const projectsStats = useMemo(
		() => getProjectsStats(filteredProjects),
		[filteredProjects]
	);

	return (
		<div className={styles.projects}>
			<ul className={styles.cards}>
				{projectsStats.map((item) => (
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
				<ProjectsInstituteChart />
				<ProjectsAverageTeamsChart />
			</div>

			<ProjectsTable projects={filteredProjects} />
		</div>
	);
};
