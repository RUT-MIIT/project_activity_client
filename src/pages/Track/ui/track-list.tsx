import type { FC } from 'react';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { FormField } from '../../../shared/components/Form/components';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Button } from '../../../shared/components/Button/ui/button';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';
import { TrackCard } from './track-card';

import {
	getTrackListAction,
	removeTrackAction,
	removeGroupFromTrackAction,
	removeProjectFromTrackAction,
} from '../../../store/track/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/track-list.module.scss';

export const TrackList: FC = () => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { trackList, isLoading } = useSelector((state) => state.track);
	const { user } = useSelector((state) => state.user);

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
		if (user?.institute_code) {
			dispatch(getTrackListAction(user.institute_code));
		}
	}, [dispatch, user]);

	if (isLoading) {
		return <Preloader />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				{filteredTracks.map((track) => (
					<TrackCard
						key={track.id}
						track={track}
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
		</div>
	);
};
