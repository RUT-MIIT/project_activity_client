import type { FC } from 'react';
import type { ITrack, ITrackProjectToAdd } from '../../../store/track/types';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { FormField } from '../../../shared/components/Form/components';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Button } from '../../../shared/components/Button/ui/button';
import { TrackCard } from './track-card';
import { Text } from '../../../shared/components/Typography';
import { EditTrackModal } from './edit-track-modal';
import { AddGroupModal } from './add-group-modal';
import { AddProjectModal } from './add-project-modal';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';

import { getGroupsAction } from '../../../store/catalog/actions';
import {
	getTrackProjectsAction,
	getTrackListAction,
	updateTrackAction,
	addGroupsToTrackAction,
	addProjectsToTrackAction,
	removeTrackAction,
	removeGroupFromTrackAction,
	removeProjectFromTrackAction,
} from '../../../store/track/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/track-list.module.scss';

export const TrackList: FC = () => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { isLoadingCatalog } = useSelector((state) => state.catalog);
	const { trackList, selectedInstitute, isLoading } = useSelector(
		(state) => state.track
	);
	const { user } = useSelector((state) => state.user);

	const [selectedTrack, setSelectedTrack] = useState<ITrack | null>(null);

	const [currentGroup, setCurrentGroup] = useState<{
		id: number;
		name: string;
	} | null>(null);

	const [currentProject, setCurrentProject] = useState<{
		id: number;
		title: string;
	} | null>(null);

	const [filteredTracks, setFilteredTracks] = useState(trackList);
	const [deleteTrackId, setDeleteTrackId] = useState<number | null>(null);
	const [deleteGroup, setDeleteGroup] = useState<{
		trackId: number;
		groupId: number;
	} | null>(null);

	const [deleteProject, setDeleteProject] = useState<{
		trackId: number;
		applicationId: number;
	} | null>(null);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
	const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

	const handleChangeGroup = (opt: { id: number; name: string } | null) => {
		setCurrentGroup(opt);
		setCurrentProject(null);
	};

	const handleChangeProject = (opt: { id: number; title: string } | null) => {
		setCurrentProject(opt);
		setCurrentGroup(null);
	};

	const handleConfirmRemoveTrack = (trackId: number) => {
		setDeleteTrackId(trackId);
	};

	const handleEditTrack = async (data: {
		name: string;
		minTeamMembers: number;
		maxTeamMembers: number;
	}) => {
		if (!selectedTrack) return;

		try {
			await dispatch(
				updateTrackAction({
					id: selectedTrack.id,
					name: data.name,
					minTeamMembers: data.minTeamMembers,
					maxTeamMembers: data.maxTeamMembers,
				})
			).unwrap();

			showToast({
				title: 'Трек обновлен',
				text: 'Параметры проектного трека успешно изменены.',
				type: 'success',
			});

			setIsEditModalOpen(false);
			setSelectedTrack(null);
		} catch (err) {
			showToast({
				title: 'Не удалось изменить трек',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleRemoveTrack = async (trackId: number) => {
		try {
			await dispatch(removeTrackAction(trackId)).unwrap();

			showToast({
				title: 'Проектный трек удален!',
				text: 'Проектный трек был успешно удален.',
				type: 'success',
			});

			setDeleteTrackId(null);
		} catch (err) {
			showToast({
				title: 'Не удалось удалить проектный трек',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleAddGroup = async (groupIds: number[]) => {
		if (!selectedTrack) return;

		try {
			await dispatch(
				addGroupsToTrackAction({
					trackId: selectedTrack.id,
					group_ids: groupIds,
				})
			).unwrap();

			showToast({
				title: 'Группа добавлена',
				text: 'Группа успешно добавлена в проектный трек.',
				type: 'success',
			});

			setIsAddGroupModalOpen(false);
			setSelectedTrack(null);
		} catch (err) {
			showToast({
				title: 'Не удалось добавить группу',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleConfirmRemoveGroup = (trackId: number, groupId: number) => {
		setDeleteGroup({
			trackId,
			groupId,
		});
	};

	const handleRemoveGroup = async (trackId: number, groupId: number) => {
		try {
			await dispatch(
				removeGroupFromTrackAction({
					trackId,
					groupId,
				})
			).unwrap();

			showToast({
				title: 'Группа удалена',
				text: 'Группа была удалена из трека.',
				type: 'success',
			});

			setDeleteGroup(null);
		} catch (err) {
			showToast({
				title: 'Не удалось удалить группу',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleAddProject = async (projects: ITrackProjectToAdd[]) => {
		if (!selectedTrack) return;

		try {
			await dispatch(
				addProjectsToTrackAction({
					trackId: selectedTrack.id,
					projects,
				})
			).unwrap();

			showToast({
				title: 'Проект добавлен',
				text: 'Проект успешно добавлен в проектный трек.',
				type: 'success',
			});

			setIsAddProjectModalOpen(false);
			setSelectedTrack(null);
		} catch (err) {
			showToast({
				title: 'Не удалось добавить проект',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleConfirmRemoveProject = (
		trackId: number,
		applicationId: number
	) => {
		setDeleteProject({
			trackId,
			applicationId,
		});
	};

	const handleRemoveProject = async (trackId: number, projectId: number) => {
		try {
			await dispatch(
				removeProjectFromTrackAction({
					trackId,
					projectId,
				})
			).unwrap();

			showToast({
				title: 'Проект удален',
				text: 'Проект был удален из трека.',
				type: 'success',
			});

			setDeleteProject(null);
		} catch (err) {
			showToast({
				title: 'Не удалось удалить проект',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleClearFilters = () => {
		setCurrentGroup(null);
		setCurrentProject(null);
	};

	const groups = useMemo(
		() =>
			Array.from(
				new Map(
					trackList
						.flatMap((track) => track.groups)
						.map((group) => [
							group.id,
							{
								id: group.id,
								name: group.name,
							},
						])
				).values()
			),
		[trackList]
	);

	const projects = useMemo(
		() =>
			Array.from(
				new Map(
					trackList
						.flatMap((track) => track.applications)
						.map((project) => [
							project.id,
							{
								id: project.id,
								title: project.title,
							},
						])
				).values()
			),
		[trackList]
	);

	useEffect(() => {
		let result = trackList;

		if (currentGroup) {
			result = result.filter((track) =>
				track.groups.some((group) => group.id === currentGroup.id)
			);
		}

		if (currentProject) {
			result = result.filter((track) =>
				track.applications.some((project) => project.id === currentProject.id)
			);
		}

		setFilteredTracks(result);
	}, [trackList, currentGroup, currentProject]);

	useEffect(() => {
		dispatch(getGroupsAction());
		dispatch(getTrackProjectsAction());
		if (user) {
			if (user.role === 'cpds') {
				if (selectedInstitute) {
					dispatch(getTrackListAction(selectedInstitute));
				}
			} else {
				if (user?.institute_code) {
					dispatch(getTrackListAction(user.institute_code));
				}
			}
		}
	}, [dispatch, selectedInstitute, user]);

	if (isLoading || isLoadingCatalog) {
		return <Preloader />;
	}

	if (trackList.length < 1) {
		return <Text text='Проектные треки не найдены.' color='grey' />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{filteredTracks.map((track) => (
					<TrackCard
						key={track.id}
						track={track}
						onEdit={(track) => {
							setSelectedTrack(track);
							setIsEditModalOpen(true);
						}}
						onAddGroup={(track) => {
							setSelectedTrack(track);
							setIsAddGroupModalOpen(true);
						}}
						onAddProject={(track) => {
							setSelectedTrack(track);
							setIsAddProjectModalOpen(true);
						}}
						onDelete={handleConfirmRemoveTrack}
						onRemoveGroup={handleConfirmRemoveGroup}
						onRemoveProject={handleConfirmRemoveProject}
					/>
				))}
			</div>
			<Card title='Поиск треков' subtitle='Выберите группу или проект'>
				<FormField title='Группа'>
					<SelectWithSearch
						placeholder='Выберите группу...'
						currentOption={currentGroup}
						options={groups}
						labelKey='name'
						valueKey='id'
						onChooseOption={handleChangeGroup}
					/>
				</FormField>

				<FormField title='Проект'>
					<SelectWithSearch
						placeholder='Выберите проект...'
						currentOption={currentProject}
						options={projects}
						labelKey='title'
						valueKey='id'
						onChooseOption={handleChangeProject}
					/>
				</FormField>

				<CardControl>
					<Button
						text='Очистить'
						color='red'
						onClick={handleClearFilters}
						isBlock={currentGroup === null && currentProject === null}
					/>
				</CardControl>
			</Card>
			{deleteTrackId && (
				<ConfirmDelete
					isOpen={deleteTrackId !== null}
					id={deleteTrackId}
					onClose={() => setDeleteTrackId(null)}
					onSubmit={handleRemoveTrack}
				/>
			)}
			{deleteGroup && (
				<ConfirmDelete
					isOpen
					id={deleteGroup.groupId}
					onClose={() => setDeleteGroup(null)}
					onSubmit={() =>
						handleRemoveGroup(deleteGroup.trackId, deleteGroup.groupId)
					}
				/>
			)}
			{deleteProject && (
				<ConfirmDelete
					isOpen
					id={deleteProject.applicationId}
					onClose={() => setDeleteProject(null)}
					onSubmit={() =>
						handleRemoveProject(
							deleteProject.trackId,
							deleteProject.applicationId
						)
					}
				/>
			)}
			{selectedTrack && (
				<>
					<EditTrackModal
						isOpen={isEditModalOpen}
						track={selectedTrack}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedTrack(null);
						}}
						onSubmit={handleEditTrack}
					/>
					<AddGroupModal
						isOpen={isAddGroupModalOpen}
						track={selectedTrack}
						onClose={() => {
							setIsAddGroupModalOpen(false);
							setSelectedTrack(null);
						}}
						onSubmit={handleAddGroup}
					/>
					<AddProjectModal
						isOpen={isAddProjectModalOpen}
						track={selectedTrack}
						onClose={() => {
							setIsAddProjectModalOpen(false);
							setSelectedTrack(null);
						}}
						onSubmit={handleAddProject}
					/>
				</>
			)}
		</div>
	);
};
