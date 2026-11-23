import type { FC } from 'react';
import type { IOverviewMentor } from '../types/overview';
import type { ITaskMember } from '../types/tasks';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../../store/store';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { Modal } from '../../../shared/components/Modal/ui/modal';

import { EMAINROUTES } from '../../../shared/utils/routes';
import { getMemberRoleName } from '../lib/helpers';
import {
	formatEventLocation,
	formatEventSchedule,
	getEventStatus,
	getEventTypeColor,
	getEventTypeText,
	getOverviewEvents,
} from '../lib/events';
import {
	formatTaskDate,
	getCurrentStage,
	getMemberNameParts,
	getMemberTasks,
	getOverallTaskProgress,
	getPreviewTasks,
	getStageProgress,
	getTaskStatusColor,
	getTaskStatusText,
} from '../lib/tasks';
import { WorkflowEventStatus } from './workflow-event-status';
import { WorkflowMemberModal } from './workflow-member-modal';
import { WorkflowMentorModal } from './workflow-mentor-modal';
import {
	mockActivity,
	mockEvents,
	mockFiles,
	mockMentorProfile,
	mockProject,
	mockTasks,
	mockTeamMembers,
} from '../lib/mock';

import styles from '../styles/workflow.module.scss';

const openTab = (path: string) => `/${EMAINROUTES.WORKFLOW}/${path}`;

export const WorkflowOverview: FC = () => {
	const navigate = useNavigate();
	const { group } = useSelector((state) => state.student);
	const team = group?.my_team ?? null;
	const mentors = group?.mentors ?? [];
	const [selectedMember, setSelectedMember] = useState<ITaskMember | null>(
		null
	);
	const [selectedMentor, setSelectedMentor] = useState<IOverviewMentor | null>(
		null
	);

	const currentStage = getCurrentStage(mockTasks);
	const stageProgress = getStageProgress(mockTasks, currentStage.id);
	const overall = getOverallTaskProgress(mockTasks);
	const upcomingEvents = getOverviewEvents(mockEvents, 4);
	const myMemberId = team?.is_captain === false ? 2 : 1;
	const teamTasks = getPreviewTasks(mockTasks);
	const myTasks = getPreviewTasks(getMemberTasks(mockTasks, myMemberId));
	const mockStudents = mockTeamMembers.filter(
		(member) => member.role !== 'mentor'
	);
	const mockMentor = mockTeamMembers.find((member) => member.role === 'mentor');

	const teamMembers: ITaskMember[] = team?.members?.length
		? team.members.map((member, index) => ({
				id: mockStudents[index]?.id ?? mockStudents[0].id,
				fullName: member.full_name,
				role: member.role,
		  }))
		: mockStudents;

	return (
		<div className={styles.page}>
			<div className={styles.overview}>
				<div className={styles.overview__main}>
					<div className={styles.hero}>
						<div className={styles.hero__head}>
							<div>
								<h2 className={styles.hero__title}>{mockProject.title}</h2>
								<p className={styles.hero__meta}>{mockProject.company}</p>
							</div>
							<Badge
								text={`Текущий этап: ${currentStage.shortTitle}`}
								color='blue'
							/>
						</div>
						<div className={styles.hero__progress}>
							<ProgressBar
								value={stageProgress.done}
								max={stageProgress.total || 1}
								withInfo
								caption={`Прогресс этапа: ${stageProgress.done} из ${stageProgress.total}`}
							/>
							<ProgressBar
								value={overall.done}
								max={overall.total || 1}
								withInfo
								caption={`Общий прогресс: ${overall.done} из ${overall.total} задач`}
							/>
						</div>
						<CardControl>
							<Button
								text='Подробнее о проекте'
								color='blue'
								onClick={() => navigate(openTab('info'))}
							/>
						</CardControl>
					</div>

					<div className={styles.overview__split}>
						<Card
							title='Задачи команды'
							subtitle='Сейчас в работе на доске проекта'>
							<ul className={styles.member__tasks}>
								{teamTasks.map((task) => (
									<li className={styles.member__task} key={task.id}>
										<div className={styles.member__taskmain}>
											<p className={styles.member__tasktitle}>{task.title}</p>
											<p className={styles.member__taskmeta}>
												до {formatTaskDate(task.dueAt)}
											</p>
										</div>
										<Badge
											text={getTaskStatusText(task.status)}
											color={getTaskStatusColor(task.status)}
										/>
									</li>
								))}
							</ul>
							<CardControl>
								<Button
									text='Все задачи'
									color='blue'
									onClick={() => navigate(openTab('tasks'))}
								/>
							</CardControl>
						</Card>

						<Card title='Мои задачи' subtitle='Задачи, назначенные вам'>
							{myTasks.length > 0 ? (
								<ul className={styles.member__tasks}>
									{myTasks.map((task) => (
										<li className={styles.member__task} key={task.id}>
											<div className={styles.member__taskmain}>
												<p className={styles.member__tasktitle}>{task.title}</p>
												<p className={styles.member__taskmeta}>
													до {formatTaskDate(task.dueAt)}
												</p>
											</div>
											<Badge
												text={getTaskStatusText(task.status)}
												color={getTaskStatusColor(task.status)}
											/>
										</li>
									))}
								</ul>
							) : (
								<Notice
									type='info'
									title='Нет назначенных задач'
									text='Когда вам назначат задачи, они появятся в этом блоке.'
								/>
							)}
							<CardControl>
								<Button
									text='К доске задач'
									color='blue'
									onClick={() => navigate(openTab('tasks'))}
								/>
							</CardControl>
						</Card>
					</div>

					<Card
						title='Календарь мероприятий'
						subtitle='Ближайшие события команды'>
						<ul className={styles.feed}>
							{upcomingEvents.map((event) => (
								<li key={event.id}>
									<button
										className={styles.event}
										type='button'
										onClick={() => navigate(openTab('events'))}>
										<span
											className={`${styles.event__mark} ${
												styles[
													`event__mark_color_${getEventTypeColor(event.type)}`
												]
											}`}
										/>
										<div className={styles.event__main}>
											<p className={styles.event__title}>{event.title}</p>
											<p className={styles.event__meta}>
												{formatEventSchedule(event)} ·{' '}
												{formatEventLocation(event)}
											</p>
										</div>
										<div className={styles.event__aside}>
											<Badge
												text={getEventTypeText(event.type)}
												color={getEventTypeColor(event.type)}
											/>
											<WorkflowEventStatus status={getEventStatus(event)} />
										</div>
									</button>
								</li>
							))}
						</ul>
						<CardControl>
							<Button
								text='Все мероприятия'
								color='blue'
								onClick={() => navigate(openTab('events'))}
							/>
						</CardControl>
					</Card>

					<Card
						title='Последние загруженные файлы'
						subtitle='Материалы, которые команда недавно добавила'>
						<ul className={styles.templates}>
							{mockFiles.map((file) => {
								const extension =
									file.name.split('.').pop()?.toUpperCase() || 'FILE';

								return (
									<li className={styles.template} key={file.id}>
										<span className={styles.template__icon}>{extension}</span>
										<div className={styles.template__main}>
											<p className={styles.template__name}>{file.name}</p>
											<p className={styles.template__meta}>
												{file.size} · {file.uploadedAt}
											</p>
										</div>
									</li>
								);
							})}
						</ul>
						<CardControl>
							<Button
								text='Все материалы'
								color='blue'
								onClick={() => navigate(openTab('materials'))}
							/>
						</CardControl>
					</Card>

					<Card
						title='Активность команды'
						subtitle='Последние действия участников'>
						<ul className={styles.activity}>
							{mockActivity.map((item) => {
								const { firstName, lastName } = getMemberNameParts(item.author);

								return (
									<li className={styles.activity__item} key={item.id}>
										<TeamAvatar
											firstName={firstName}
											lastName={lastName}
											memberRole={item.role}
										/>
										<div className={styles.activity__body}>
											<p className={styles.activity__text}>
												<span>{item.author}</span> {item.text}
											</p>
											<p className={styles.activity__time}>{item.time}</p>
										</div>
									</li>
								);
							})}
						</ul>
					</Card>
				</div>

				<aside className={styles.overview__aside}>
					<Card
						title='Команда проекта'
						subtitle='Нажмите на участника, чтобы увидеть его задачи'>
						{teamMembers.length > 0 ? (
							<ul className={styles.people}>
								{teamMembers.map((member) => {
									const { firstName, lastName } = getMemberNameParts(
										member.fullName
									);

									return (
										<li key={`${member.id}-${member.fullName}`}>
											<button
												className={`${styles.person} ${styles.person_button}`}
												type='button'
												onClick={() => setSelectedMember(member)}>
												<TeamAvatar
													firstName={firstName}
													lastName={lastName}
													memberRole={member.role}
												/>
												<div>
													<p className={styles.person__name}>
														{member.fullName}
													</p>
													<p className={styles.person__role}>
														{getMemberRoleName(member.role)}
													</p>
												</div>
											</button>
										</li>
									);
								})}
							</ul>
						) : (
							<Notice
								type='warning'
								title='Команда ещё не сформирована'
								text='Когда состав появится, участники отобразятся в этом блоке.'
							/>
						)}
					</Card>

					<Card title='Наставник' subtitle='Нажмите, чтобы открыть контакты'>
						{mentors.length > 0 ? (
							<ul className={styles.people}>
								{mentors.map((mentor) => (
									<li key={mentor.id}>
										<button
											className={`${styles.person} ${styles.person_button}`}
											type='button'
											onClick={() =>
												setSelectedMentor({
													id: mentor.id,
													firstName: mentor.first_name,
													lastName: mentor.last_name,
													middleName: mentor.middle_name,
													position: mentor.position,
													email: mentor.email,
													academicDegree: mentor.academic_degree,
													academicTitle: mentor.academic_title,
												})
											}>
											<TeamAvatar
												firstName={mentor.first_name}
												lastName={mentor.last_name}
												memberRole='mentor'
											/>
											<div>
												<p className={styles.person__name}>
													{mentor.last_name} {mentor.first_name}{' '}
													{mentor.middle_name}
												</p>
												<p className={styles.person__role}>
													{mentor.position || 'Наставник команды'}
												</p>
											</div>
										</button>
									</li>
								))}
							</ul>
						) : mockMentor ? (
							<button
								className={`${styles.person} ${styles.person_button}`}
								type='button'
								onClick={() => setSelectedMentor(mockMentorProfile)}>
								<TeamAvatar
									firstName={mockMentorProfile.firstName}
									lastName={mockMentorProfile.lastName}
									memberRole='mentor'
								/>
								<div>
									<p className={styles.person__name}>
										{mockMentorProfile.lastName} {mockMentorProfile.firstName}{' '}
										{mockMentorProfile.middleName}
									</p>
									<p className={styles.person__role}>
										{mockMentorProfile.position}
									</p>
								</div>
							</button>
						) : (
							<Notice
								type='info'
								title='Наставник не назначен'
								text='После назначения наставник появится в этом блоке.'
							/>
						)}
					</Card>
				</aside>
			</div>

			<Modal
				isOpen={Boolean(selectedMember)}
				onClose={() => setSelectedMember(null)}
				title='Задачи участника'
				description='Назначенные задачи и прогресс выполнения'
				modalWidth='large'>
				{selectedMember && (
					<WorkflowMemberModal member={selectedMember} tasks={mockTasks} />
				)}
			</Modal>

			<Modal
				isOpen={Boolean(selectedMentor)}
				onClose={() => setSelectedMentor(null)}
				title='Наставник команды'
				description='Контактные данные и сведения о наставнике'>
				{selectedMentor && <WorkflowMentorModal mentor={selectedMentor} />}
			</Modal>
		</div>
	);
};
