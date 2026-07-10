import type { FC } from 'react';
import type { ITrackProject } from '../../../store/track/types';

import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Button } from '../../../shared/components/Button/ui/button';
import { FormField } from '../../../shared/components/Form/components';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { TrackNorms } from './track-norms';
import { TrackProjectDetailModal } from './track-project-detail-modal';
import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../shared/components/Table/ui';

import {
	getTrackProjectsListAction,
	getTrackStatsAction,
} from '../../../store/track/actions';

import styles from '../styles/track.module.scss';

export const TrackProjectList: FC = () => {
	const dispatch = useDispatch();

	const { trackProjects, isLoadingTrackProjects } = useSelector(
		(state) => state.track
	);

	const { user } = useSelector((state) => state.user);

	const [currentProject, setCurrentProject] = useState<ITrackProject | null>(
		null
	);
	const [currentAuthor, setCurrentAuthor] = useState<string | null>(null);

	const [filteredProjects, setFilteredProjects] =
		useState<ITrackProject[]>(trackProjects);

	const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);

	const [isShowProjectDetail, setIsShowProjectDetail] = useState(false);

	const handleChangeProject = (opt: ITrackProject | null) => {
		setCurrentProject(opt);
		setCurrentAuthor(null);
	};

	const handleChangeAuthor = (opt: { id: string; name: string } | null) => {
		setCurrentAuthor(opt?.id ?? null);
		setCurrentProject(null);
	};

	const handleClearFilters = () => {
		setCurrentAuthor(null);
		setCurrentProject(null);
	};

	const handleShowDetail = (id: number) => {
		setCurrentProjectId(id);
		setIsShowProjectDetail(true);
	};

	const handleCloseDetail = () => {
		setCurrentProjectId(null);
		setIsShowProjectDetail(false);
	};

	const authors = useMemo(
		() =>
			Array.from(
				new Set(trackProjects.map((project) => project.author_name))
			).map((author) => ({
				id: author,
				name: author,
			})),
		[trackProjects]
	);

	useEffect(() => {
		let result = trackProjects;

		if (currentAuthor) {
			result = result.filter(
				(project) => project.author_name === currentAuthor
			);
		} else if (currentProject) {
			result = result.filter((project) => project.id === currentProject.id);
		}

		setFilteredProjects(result);
	}, [trackProjects, currentAuthor, currentProject]);

	useEffect(() => {
		if (user?.institute_code) {
			dispatch(getTrackStatsAction(user.institute_code));
			dispatch(getTrackProjectsListAction(user.institute_code));
		}
	}, [dispatch, user]);

	if (isLoadingTrackProjects) {
		return <Preloader />;
	}

	return (
		<>
			<TrackNorms />

			<div className={styles.container}>
				<div className={styles.column}>
					<div className={styles.table}>
						<Table>
							<TableHeader>
								<TableColumn
									text='Проект'
									columnSize='full'
									textWeight='bold'
								/>

								<TableColumn text='Автор' columnSize='full' textWeight='bold' />

								<TableColumn
									text='Групп'
									columnSize='progress'
									textWeight='bold'
								/>
							</TableHeader>

							<TableMain>
								{filteredProjects.map((project) => (
									<TableRow key={project.id}>
										<TableColumn
											text={project.title}
											columnSize='full'
											textWeight='bold'
											active
											id={project.id}
											onClick={handleShowDetail}
										/>

										<TableColumn text={project.author_name} columnSize='full' />

										<TableColumn withChildren columnSize='progress'>
											<ProgressBar
												value={project.assigned_groups_count}
												max={15}
												withInfo
												caption={`Количество: ${project.assigned_groups_count}`}
											/>
										</TableColumn>
									</TableRow>
								))}
							</TableMain>
						</Table>
					</div>
				</div>

				<div className={styles.column}>
					<Card title='Поиск проектов' subtitle='Выберите проект для просмотра'>
						<FormField title='Автор'>
							<SelectWithSearch
								placeholder='Выберите автора...'
								currentOption={
									currentAuthor
										? { id: currentAuthor, name: currentAuthor }
										: null
								}
								options={authors}
								labelKey='name'
								valueKey='id'
								onChooseOption={handleChangeAuthor}
							/>
						</FormField>
						<FormField title='Проект'>
							<SelectWithSearch
								placeholder='Выберите проект...'
								currentOption={currentProject}
								options={trackProjects}
								labelKey='title'
								onChooseOption={handleChangeProject}
							/>
						</FormField>
						<CardControl>
							<Button
								text='Очистить'
								color='red'
								style={{ margin: '0 auto 0 0' }}
								onClick={handleClearFilters}
								isBlock={currentProject === null && currentAuthor === null}
							/>
						</CardControl>
					</Card>
				</div>
			</div>

			{isShowProjectDetail && (
				<TrackProjectDetailModal
					id={currentProjectId}
					isOpen={isShowProjectDetail}
					onClose={handleCloseDetail}
				/>
			)}
		</>
	);
};
