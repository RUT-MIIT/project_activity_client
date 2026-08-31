import type { FC } from 'react';
import type { ITab } from '../../../shared/components/Tabs/types/types';

import { useEffect } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../store/store';

import { Section } from '../../../shared/components/Section';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Text } from '../../../shared/components/Typography';

import { getMyGroupDetailAction } from '../../../store/mentor/actions';

import { MyGroupHeader } from './my-group-header';
import { MyGroupStudents } from './my-group-students';
import { MyGroupTeams } from './my-group-teams';
import { MyGroupShowcase } from './my-group-showcase';

export const MyGroupDetail: FC = () => {
	const { groupId } = useParams<{ groupId: string }>();
	const dispatch = useDispatch();

	const { currentGroup, isLoadingGroupDetail } = useSelector(
		(state) => state.mentor
	);

	useEffect(() => {
		if (!groupId) {
			return;
		}

		dispatch(getMyGroupDetailAction(Number(groupId)));
	}, [dispatch, groupId]);

	if (isLoadingGroupDetail) {
		return <Preloader />;
	}

	if (!currentGroup) {
		return (
			<Section sectionWidth='full' sectionTitle={{ text: 'Группа' }}>
				<Text text='Не удалось загрузить информацию о группе.' color='grey' />
			</Section>
		);
	}

	const tabs: ITab[] = [
		{
			label: 'Студенты',
			path: 'students',
		},
		{
			label: 'Команды',
			path: 'teams',
		},
		{
			label: 'Витрина проектов',
			path: 'showcase',
		},
	];

	return (
		<Routes>
			<Route
				path='tabs'
				element={<MyGroupHeader group={currentGroup} tabs={tabs} />}>
				<Route path='students' element={<MyGroupStudents />} />

				<Route path='teams' element={<MyGroupTeams />} />

				<Route path='showcase' element={<MyGroupShowcase />} />

				<Route index element={<Navigate to='students' replace />} />
			</Route>

			<Route index element={<Navigate to='tabs/students' replace />} />
		</Routes>
	);
};
