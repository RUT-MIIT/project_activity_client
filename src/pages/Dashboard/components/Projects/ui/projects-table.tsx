import type { FC } from 'react';
import type { IProjectsTableProps } from '../types/types';

import { useMemo, useState } from 'react';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../../../shared/components/Table/ui';
import { Filter } from '../../../../../shared/components/Filter/ui/filter';
import { Text } from '../../../../../shared/components/Typography';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';
import { Button } from '../../../../../shared/components/Button/ui/button';
import { Select } from '../../../../../shared/components/Select/ui/select';
import { ProgressBar } from '../../../../../shared/components/ProgressBar/ui/progress-bar';
import { ProjectDetailModal } from './project-detail-modal';

import { exportProjectsToExcel } from '../lib/export';
import {
	getProjectStatus,
	projectStatusConfig,
	projectStatusOptions,
} from '../lib/helpers';

import styles from '../styles/projects-table.module.scss';

export const ProjectsTable: FC<IProjectsTableProps> = ({ projects }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const [currentStatus, setCurrentStatus] = useState<{
		id: string;
		name: string;
	} | null>(projectStatusOptions[0]);

	const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

	const [isShowProjectDetail, setIsShowProjectDetail] = useState(false);

	const handleProjectClick = (id: number) => {
		setCurrentProjectId(id);
		setIsShowProjectDetail(true);
	};

	const handleCloseDetail = () => {
		setIsShowProjectDetail(false);
		setCurrentProjectId(null);
	};

	const filteredProjects = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return projects.filter((project) => {
			const teamsCount = project.teams.length;

			const matchesSearch =
				!query ||
				project.name.toLowerCase().includes(query) ||
				project.institute.name.toLowerCase().includes(query) ||
				project.teams.some((team) => team.name.toLowerCase().includes(query));

			const status = getProjectStatus(teamsCount, project.maxTeamsCount);

			const matchesStatus =
				!currentStatus ||
				currentStatus.id === 'all' ||
				status === currentStatus.id;

			return matchesSearch && matchesStatus;
		});
	}, [projects, searchQuery, currentStatus]);

	return (
		<div className={styles.table}>
			<div className={styles.table__header}>
				<Filter
					placeholder='Поиск..'
					onFilter={setSearchQuery}
					width='default'
				/>

				<Select
					placeholder='Статус проекта..'
					currentOption={currentStatus}
					options={projectStatusOptions}
					onChooseOption={setCurrentStatus}
					width='default'
					withClear={false}
				/>

				<Button
					text='Экспорт в Excel'
					color='green'
					onClick={() => exportProjectsToExcel(filteredProjects)}
				/>
			</div>

			{filteredProjects.length === 0 ? (
				<Text text='Проекты не найдены.' color='grey' />
			) : (
				<div className={styles.table__container}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn text='Проект' textWeight='bold' columnSize='full' />

							<TableColumn text='Статус' textWeight='bold' columnSize='large' />

							<TableColumn
								text='Институт'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Заполненность'
								textWeight='bold'
								columnSize='progress'
							/>
						</TableHeader>

						<TableMain>
							{filteredProjects.map((project, index) => {
								const teamsCount = project.teams.length;

								const status =
									projectStatusConfig[
										getProjectStatus(teamsCount, project.maxTeamsCount)
									];

								return (
									<TableRow key={project.id}>
										<TableColumn text={String(index + 1)} columnSize='count' />

										<TableColumn
											text={project.name}
											columnSize='full'
											textWeight='bold'
											active
											id={project.id}
											onClick={handleProjectClick}
										/>

										<TableColumn withChildren columnSize='large'>
											<Badge text={status.text} color={status.color} />
										</TableColumn>

										<TableColumn
											text={project.institute.name}
											columnSize='medium'
										/>

										<TableColumn withChildren columnSize='progress'>
											<ProgressBar
												value={teamsCount}
												max={project.maxTeamsCount}
												withInfo
												caption={`${teamsCount} из ${project.maxTeamsCount}`}
											/>
										</TableColumn>
									</TableRow>
								);
							})}
						</TableMain>
					</Table>
				</div>
			)}

			{isShowProjectDetail && (
				<ProjectDetailModal
					id={currentProjectId}
					isOpen={isShowProjectDetail}
					onClose={handleCloseDetail}
				/>
			)}
		</div>
	);
};
