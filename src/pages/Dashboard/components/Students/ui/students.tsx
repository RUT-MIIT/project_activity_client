import type { FC } from 'react';

import { useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from '../../../../../store/store';

import { CardStats } from '../../../../../shared/components/Card/ui';
import { StudentsChart } from './students-chart';
import { StudentsCourseChart } from './students-course-chart';
import { StudentsTable } from './students-table';

import { getStudentsStats } from '../lib/helpers';
import { getStudentsStatsAction } from '../../../../../store/dashboard/actions';

import styles from '../styles/students.module.scss';

export const Students: FC = () => {
	const dispatch = useDispatch();

	const selectedInstitute = useSelector(
		(state) => state.dashboard.selectedInstitute
	);

	const selectedCourse = useSelector((state) => state.dashboard.selectedCourse);

	const students = useSelector((state) => state.dashboard.students);

	useEffect(() => {
		dispatch(getStudentsStatsAction());
	}, [dispatch]);

	const filteredStudents = useMemo(() => {
		return students.filter((student) => {
			const matchesInstitute =
				!selectedInstitute || student.institute.id === selectedInstitute;

			const matchesCourse =
				!selectedCourse || student.course === selectedCourse;

			return matchesInstitute && matchesCourse;
		});
	}, [students, selectedInstitute, selectedCourse]);

	const studentsStats = useMemo(
		() => getStudentsStats(filteredStudents),
		[filteredStudents]
	);

	return (
		<div className={styles.students}>
			<ul className={styles.cards}>
				{studentsStats.map((item) => (
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
				<StudentsChart />

				<StudentsCourseChart />
			</div>

			<StudentsTable students={filteredStudents} />
		</div>
	);
};
