import type { FC } from 'react';
import type { IProjectDetailModal } from '../types/types';

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../../../store/store';

import { Modal } from '../../../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';
import { Text } from '../../../../../shared/components/Typography';
import {
	FormField,
	FormInputStub,
} from '../../../../../shared/components/Form/components';

import { getProjectDetailAction } from '../../../../../store/dashboard/actions';

import styles from '../styles/project-detail-modal.module.scss';

const getProjectTypeLabel = (type: string) => {
	return type === 'external' ? 'Внешний проект' : 'Внутренний проект';
};

const getTeamStatusLabel = (status: string) => {
	switch (status) {
		case 'assembled':
			return 'Состав сформирован';

		case 'forming':
			return 'Состав формируется';

		default:
			return status;
	}
};

export const ProjectDetailModal: FC<IProjectDetailModal> = ({
	id,
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();

	const { projectDetail, isLoadingProjectDetail } = useSelector(
		(state) => state.dashboard
	);

	const [expandedTeams, setExpandedTeams] = useState<number[]>([]);

	const toggleTeam = (teamId: number) => {
		setExpandedTeams((prev) =>
			prev.includes(teamId)
				? prev.filter((id) => id !== teamId)
				: [...prev, teamId]
		);
	};

	useEffect(() => {
		if (isOpen && id) {
			dispatch(getProjectDetailAction(id));
		}
	}, [dispatch, id, isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} title='Информация о проекте'>
			{isLoadingProjectDetail || !projectDetail ? (
				<Preloader />
			) : (
				<div className={styles.content}>
					{/* Основная информация */}
					<div className={styles.header}>
						<div className={styles.titleBlock}>
							<div className={styles.badges}>
								<Badge text={projectDetail.institute.name} color='blue' />

								<Badge
									text={getProjectTypeLabel(projectDetail.type)}
									color='purple'
								/>
							</div>
						</div>
					</div>

					<div className={styles.infoGrid}>
						<div className={styles.infoItem}>
							<span className={styles.label}>Проект</span>
							<span className={styles.value}>{projectDetail.name}</span>
						</div>

						<div className={styles.infoItem}>
							<span className={styles.label}>Заказчик</span>
							<span className={styles.value}>
								{projectDetail.customer || '—'}
							</span>
						</div>

						<div className={styles.infoItem}>
							<span className={styles.label}>Номер проекта</span>
							<span className={styles.value}>
								{projectDetail.print_number || '—'}
							</span>
						</div>

						<div className={styles.infoItem}>
							<span className={styles.label}>Автор</span>
							<span className={styles.value}>
								{projectDetail.author.fullName || '—'}
							</span>
						</div>
					</div>

					{/* Команды */}
					<section className={styles.section}>
						<div className={styles.sectionHeader}>
							<Text text='Команды' weight='bold' />
							<Text
								text={`${projectDetail.currentTeamsCount} из
								${projectDetail.maxTeamsCount}`}
								color='grey'
							/>
						</div>

						{projectDetail.teams.length === 0 ? (
							<div className={styles.empty}>Нет записавшихся команд</div>
						) : (
							<div className={styles.teams}>
								{projectDetail.teams.map((team) => (
									<div key={team.id} className={styles.team}>
										<div className={styles.teamHeader}>
											<div className={styles.teamInfo}>
												<div className={styles.teamName}>{team.name}</div>

												<div className={styles.teamGroup}>
													Группа: {team.studyGroup.name}
												</div>
											</div>

											<div className={styles.teamActions}>
												<Badge
													text={getTeamStatusLabel(team.status)}
													color='green'
												/>

												<button
													type='button'
													className={styles.detailsButton}
													onClick={() => toggleTeam(team.id)}>
													{expandedTeams.includes(team.id)
														? 'Скрыть'
														: 'Подробнее'}
												</button>
											</div>
										</div>

										{expandedTeams.includes(team.id) && (
											<>
												<div className={styles.teamSection}>
													<Text
														text={`Участники (${team.members.length})`}
														weight='bold'
													/>

													{team.members.length === 0 ? (
														<Text text='Нет участников' />
													) : (
														<div className={styles.members}>
															{team.members.map((member) => (
																<div key={member.id} className={styles.member}>
																	<div className={styles.memberInfo}>
																		<span className={styles.memberName}>
																			{member.fullName}
																		</span>

																		<span className={styles.memberMeta}>
																			{member.studyGroup.name}
																		</span>
																	</div>

																	<span className={styles.course}>
																		{member.course} курс
																	</span>
																</div>
															))}
														</div>
													)}
												</div>

												<div className={styles.teamSection}>
													<Text text='Наставники' weight='bold' />

													{team.mentors.length === 0 ? (
														<div className={styles.emptySmall}>
															Нет наставников
														</div>
													) : (
														<div className={styles.mentors}>
															{team.mentors.map((mentor) => (
																<div key={mentor.id} className={styles.mentor}>
																	{mentor.fullName}
																</div>
															))}
														</div>
													)}
												</div>
											</>
										)}
									</div>
								))}
							</div>
						)}
					</section>

					{/* Описание проекта */}
					<section className={styles.section}>
						<Text text='Описание проекта' weight='bold' />

						<FormField title='Носитель проблемы'>
							<FormInputStub value={projectDetail.problem_holder || '—'} />
						</FormField>

						<FormField title='Цель'>
							<FormInputStub value={projectDetail.goal || '—'} />
						</FormField>

						<FormField title='Барьер'>
							<FormInputStub value={projectDetail.barrier || '—'} />
						</FormField>

						<FormField title='Существующие решения'>
							<FormInputStub value={projectDetail.existing_solutions || '—'} />
						</FormField>
					</section>
				</div>
			)}
		</Modal>
	);
};
