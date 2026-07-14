import type { FC } from 'react';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { FormField } from '../../../shared/components/Form/components';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Button } from '../../../shared/components/Button/ui/button';
import { TrackCard } from './track-card';

import { getTrackListAction } from '../../../store/track/actions';

import styles from '../styles/track-list.module.scss';

export const TrackList: FC = () => {
	const dispatch = useDispatch();

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

	const handleChangeGroup = (opt: { id: number; name: string } | null) => {
		setCurrentGroup(opt);
		setCurrentProject(null);
	};

	const handleChangeProject = (opt: { id: number; title: string } | null) => {
		setCurrentProject(opt);
		setCurrentGroup(null);
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
					<TrackCard key={track.id} track={track} />
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
		</div>
	);
};
