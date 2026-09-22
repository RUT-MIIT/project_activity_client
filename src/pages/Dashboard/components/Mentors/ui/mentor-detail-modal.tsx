import type { FC } from 'react';
import type { IMentorDetailModal } from '../types/types';

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../../../store/store';

import { Modal } from '../../../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Tabs } from '../../../../../shared/components/Tabs/ui/tabs';
import {
	FormField,
	FormInputStub,
} from '../../../../../shared/components/Form/components';
import { Text } from '../../../../../shared/components/Typography';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { getMentorDetailAction } from '../../../../../store/dashboard/actions';

import styles from '../styles/mentor-detail-modal.module.scss';

const tabs = [
	{
		path: 'main',
		label: 'Общая информация',
	},
	{
		path: 'groups',
		label: 'Группы',
	},
	{
		path: 'teams',
		label: 'Команды',
	},
];

const getTeamsLabel = (count: number) => {
	if (count === 1) return 'команда';
	if (count >= 2 && count <= 4) return 'команды';

	return 'команд';
};

export const MentorDetailModal: FC<IMentorDetailModal> = ({
	id,
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();

	const mentorDetail = useSelector((state) => state.dashboard.mentorDetail);

	const [activeTab, setActiveTab] = useState('main');

	useEffect(() => {
		if (isOpen && id) {
			dispatch(getMentorDetailAction(id));
			setActiveTab('main');
		}
	}, [dispatch, id, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Информация о наставнике'
			description='Информация доступна только для просмотра'>
			{!mentorDetail ? (
				<Preloader />
			) : (
				<>
					<Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

					{activeTab === 'main' && (
						<>
							<FormField title='ФИО наставника'>
								<FormInputStub value={mentorDetail.fullName} />
							</FormField>

							<FormField title='Институт'>
								<FormInputStub value={mentorDetail.institute.name} />
							</FormField>

							<FormField title='Количество групп'>
								<FormInputStub value={String(mentorDetail.groups.length)} />
							</FormField>

							<FormField title='Количество команд'>
								<FormInputStub value={String(mentorDetail.teamsCount)} />
							</FormField>
						</>
					)}

					{activeTab === 'groups' && (
						<div className={styles.list}>
							{mentorDetail.groups.map((group) => {
								const totalStudents = group.students.length;

								const registeredStudents = group.students.filter(
									(student) => student.isRegistered
								).length;

								const studentsInTeams = group.students.filter(
									(student) => student.team !== null
								).length;

								const studentsWithProjects = group.students.filter(
									(student) => student.project !== null
								).length;

								const teamsCount = group.teams.length;

								return (
									<div className={styles.card} key={group.id}>
										<div className={styles.cardHeader}>
											<div className={styles.cardTitle}>{group.name}</div>

											<Badge
												text={`${teamsCount} ${getTeamsLabel(teamsCount)}`}
												color={teamsCount > 0 ? 'green' : 'grey'}
											/>
										</div>

										<div className={styles.stats}>
											<div className={styles.stat}>
												<span className={styles.statValue}>
													{totalStudents}
												</span>

												<span className={styles.statLabel}>студентов</span>
											</div>

											<div className={styles.stat}>
												<span className={styles.statValue}>
													{registeredStudents}
												</span>

												<span className={styles.statLabel}>
													зарегистрировано
												</span>
											</div>

											<div className={styles.stat}>
												<span className={styles.statValue}>
													{studentsInTeams}
												</span>

												<span className={styles.statLabel}>в командах</span>
											</div>

											<div className={styles.stat}>
												<span className={styles.statValue}>
													{studentsWithProjects}
												</span>

												<span className={styles.statLabel}>с проектом</span>
											</div>
										</div>
									</div>
								);
							})}

							{mentorDetail.groups.length === 0 && (
								<Text text='У наставника нет закреплённых групп' color='grey' />
							)}
						</div>
					)}

					{activeTab === 'teams' && (
						<div className={styles.list}>
							{mentorDetail.groups.flatMap((group) =>
								group.teams.map((team) => {
									const status =
										team.status === 'forming'
											? {
													text: 'Состав формируется',
													color: 'yellow' as const,
											  }
											: team.status === 'assembled'
											? {
													text: 'Состав сформирован',
													color: 'green' as const,
											  }
											: {
													text: team.status,
													color: 'grey' as const,
											  };

									return (
										<div className={styles.card} key={team.id}>
											<div className={styles.cardHeader}>
												<div className={styles.cardTitle}>{team.name}</div>

												<Badge text={status.text} color={status.color} />
											</div>

											<div className={styles.teamInfo}>
												<div className={styles.teamInfoItem}>
													<span className={styles.teamInfoLabel}>Группа</span>

													<span className={styles.teamInfoValue}>
														{group.name}
													</span>
												</div>

												<div className={styles.teamInfoItem}>
													<span className={styles.teamInfoLabel}>
														Участников
													</span>
													<span className={styles.teamInfoValue}>
														{team.membersCount}
													</span>
												</div>

												<div className={styles.teamInfoItem}>
													<span className={styles.teamInfoLabel}>Проект</span>

													<span
														className={
															team.project
																? styles.teamInfoValue
																: styles.teamInfoMuted
														}>
														{team.project?.name || 'Не выбран'}
													</span>
												</div>
											</div>
										</div>
									);
								})
							)}

							{mentorDetail.teamsCount === 0 && (
								<Text text='У наставника нет команд' color='grey' />
							)}
						</div>
					)}
				</>
			)}
		</Modal>
	);
};
