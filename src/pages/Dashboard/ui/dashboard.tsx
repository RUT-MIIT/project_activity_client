import type { FC } from 'react';

import { useEffect, useMemo } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { Section } from '../../../shared/components/Section';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Select } from '../../../shared/components/Select/ui/select';

import { Students } from '../components/Students/ui/students';
import { Mentors } from '../components/Mentors/ui/mentors';
import { Projects } from '../components/Projects/ui/projects';
import { Groups } from '../components/Groups/ui/groups';

import { tabs, courseOptions } from '../lib/helpers';

import { setCourse, setInstitute } from '../../../store/dashboard/reducer';
import { getInstitutesAction } from '../../../store/catalog/actions';

import styles from '../styles/dashboard.module.scss';

export const Dashboard: FC = () => {
	const dispatch = useDispatch();

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const selectedCourse = useSelector((state) => state.dashboard.selectedCourse);

	const institutes = useSelector((state) => state.catalog.institutes);

	useEffect(() => {
		dispatch(getInstitutesAction());
	}, [dispatch]);

	const instituteOptions = useMemo(() => {
		return institutes
			.filter((institute) => institute.code !== 'all')
			.map((institute) => ({
				id: institute.code,
				name: institute.name,
			}));
	}, [institutes]);

	const currentInstitute =
		instituteOptions.find((option) => option.id === selectedInstitute) ?? null;

	const currentCourse =
		courseOptions.find((option) => option.id === selectedCourse) ?? null;

	const handleInstituteChange = (
		option: { id: string; name: string } | null
	) => {
		dispatch(setInstitute(option?.id ?? null));
	};

	const handleCourseChange = (option: { id: number; name: string } | null) => {
		dispatch(setCourse(option?.id ?? null));
	};

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Аналитика проектной деятельности' }}
			withHeaderMargin>
			<div className={styles.header}>
				<Tabs tabs={tabs} />

				<div className={styles.filters}>
					<Select
						placeholder='Выберите институт..'
						currentOption={currentInstitute}
						options={instituteOptions}
						onChooseOption={handleInstituteChange}
						width='default'
					/>

					<Select
						placeholder='Выберите курс..'
						currentOption={currentCourse}
						options={courseOptions}
						onChooseOption={handleCourseChange}
						width='default'
					/>
				</div>
			</div>

			<div className={styles.content}>
				<Routes>
					<Route path='students' element={<Students />} />
					<Route path='mentors' element={<Mentors />} />
					<Route path='projects' element={<Projects />} />
					<Route path='groups' element={<Groups />} />

					<Route path='' element={<Navigate to='students' replace />} />
				</Routes>
			</div>
		</Section>
	);
};
