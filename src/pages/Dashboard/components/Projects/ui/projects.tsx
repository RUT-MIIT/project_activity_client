import type { FC } from 'react';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import { CardStats } from '../../../../../shared/components/Card/ui';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { ProjectsInstituteChart } from './projects-institute-chart';
import { ProjectsAverageTeamsChart } from './projects-average-teams-chart';
import { ProjectsTable } from './projects-table';

import { getProjectsAction } from '../../../../../store/dashboard/actions';
import { getProjectsStats } from '../lib/helpers';

import styles from '../styles/projects.module.scss';

export const Projects: FC = () => {
	const dispatch = useDispatch();

	const { projects, selectedInstitute, isLoadingProjects } = useSelector(
		(state) => state.dashboard
	);

	useEffect(() => {
		dispatch(getProjectsAction());
	}, [dispatch]);

	const filteredProjects = useMemo(() => {
		if (!selectedInstitute) {
			return projects;
		}

		return projects.filter(
			(project) => project.institute.id === selectedInstitute
		);
	}, [projects, selectedInstitute]);

	const projectsStats = useMemo(
		() => getProjectsStats(filteredProjects),
		[filteredProjects]
	);

	if (isLoadingProjects) {
		return <Preloader />;
	}

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
				<ProjectsInstituteChart projects={projects} />
				<ProjectsAverageTeamsChart projects={projects} />
			</div>

			<ProjectsTable projects={filteredProjects} />
		</div>
	);
};
