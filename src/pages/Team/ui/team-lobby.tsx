import type { FC } from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Button } from '../../../shared/components/Button/ui/button';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Section } from '../../../shared/components/Section';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { ConfirmDelete } from '../../../features/ConfirmDelete/ui/confirm-delete';
import { ConfirmAction } from '../../../features/ConfirmAction/ui/confirm-action';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { TeamLobbyMembers } from './team-lobby-members';
import { TeamLobbyInvitations } from './team-lobby-invitations';
import { TeamLobbyJoinRequests } from './team-lobby-join-requests';
import { InviteTeamMemberForm } from './invite-team-member-form';

import {
	getMyTeamAction,
	getMyTeamEventLogAction,
	deleteMyTeamAction,
	createTeamInvitationAction,
	deleteTeamMemberAction,
	leaveMyTeamAction,
	approveTeamJoinRequestAction,
	rejectTeamJoinRequestAction,
	confirmTeamCompositionAction,
} from '../../../store/student/actions';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { getTeamStatusText, getTeamStatusColor } from '../lib/helpers';
import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/team-lobby.module.scss';

export const TeamLobby: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { showToast } = useToast();

	const {
		myTeam,
		eventLog,
		isLoadingMyTeam,
		isLoadingEventLog,
		isLoadingAction,
		isMyTeamLoaded,
	} = useSelector((state) => state.student);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
	const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
	const [isLeaveTeamModalOpen, setIsLeaveTeamModalOpen] = useState(false);
	const [isApproveRequestModalOpen, setIsApproveRequestModalOpen] =
		useState(false);
	const [isRejectRequestModalOpen, setIsRejectRequestModalOpen] =
		useState(false);
	const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
		null
	);
	const [isConfirmCompositionModalOpen, setIsConfirmCompositionModalOpen] =
		useState(false);

	useEffect(() => {
		dispatch(getMyTeamAction());
		dispatch(getMyTeamEventLogAction());
	}, [dispatch]);

	const isMemberOfTeam = myTeam !== null;

	useEffect(() => {
		if (!isMyTeamLoaded) {
			return;
		}

		if (!isMemberOfTeam) {
			navigate(`/${EMAINROUTES.TEAM}`, { replace: true });
		}
	}, [isMyTeamLoaded, isMemberOfTeam, navigate]);

	const handleOpenDeleteModal = () => {
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		if (!isLoadingAction) {
			setIsDeleteModalOpen(false);
		}
	};

	const handleOpenRemoveMemberModal = (memberId: number) => {
		setSelectedMemberId(memberId);
		setIsRemoveMemberModalOpen(true);
	};

	const handleCloseRemoveMemberModal = () => {
		if (!isLoadingAction) {
			setIsRemoveMemberModalOpen(false);
			setSelectedMemberId(null);
		}
	};

	const handleOpenLeaveTeamModal = () => {
		setIsLeaveTeamModalOpen(true);
	};

	const handleCloseLeaveTeamModal = () => {
		if (!isLoadingAction) {
			setIsLeaveTeamModalOpen(false);
		}
	};

	const handleOpenInviteModal = () => {
		setIsInviteModalOpen(true);
	};

	const handleCloseInviteModal = () => {
		if (!isLoadingAction) {
			setIsInviteModalOpen(false);
		}
	};

	const handleOpenApproveRequestModal = (requestId: number) => {
		setSelectedRequestId(requestId);
		setIsApproveRequestModalOpen(true);
	};

	const handleCloseApproveRequestModal = () => {
		if (!isLoadingAction) {
			setIsApproveRequestModalOpen(false);
			setSelectedRequestId(null);
		}
	};

	const handleOpenRejectRequestModal = (requestId: number) => {
		setSelectedRequestId(requestId);
		setIsRejectRequestModalOpen(true);
	};

	const handleCloseRejectRequestModal = () => {
		if (!isLoadingAction) {
			setIsRejectRequestModalOpen(false);
			setSelectedRequestId(null);
		}
	};

	const handleOpenConfirmCompositionModal = () => {
		setIsConfirmCompositionModalOpen(true);
	};

	const handleCloseConfirmCompositionModal = () => {
		if (!isLoadingAction) {
			setIsConfirmCompositionModalOpen(false);
		}
	};

	const handleDeleteTeam = async () => {
		try {
			await dispatch(deleteMyTeamAction()).unwrap();

			setIsDeleteModalOpen(false);

			showToast({
				title: 'Команда удалена',
				text: 'Команда была успешно удалена.',
				type: 'success',
			});

			navigate(`/${EMAINROUTES.TEAM}`);
		} catch (err) {
			showToast({
				title: 'Не удалось удалить команду',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleLeaveTeam = async () => {
		try {
			await dispatch(leaveMyTeamAction()).unwrap();

			setIsLeaveTeamModalOpen(false);

			showToast({
				title: 'Вы покинули команду',
				text: 'Вы успешно вышли из команды.',
				type: 'success',
			});

			navigate(`/${EMAINROUTES.TEAM}`, { replace: true });
		} catch (err) {
			showToast({
				title: 'Не удалось покинуть команду',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleInviteMember = async (userId: number) => {
		try {
			await dispatch(
				createTeamInvitationAction({
					user_id: userId,
					role: 'member',
				})
			).unwrap();

			showToast({
				title: 'Приглашение отправлено',
				text: 'Приглашение участнику успешно отправлено.',
				type: 'success',
			});

			setIsInviteModalOpen(false);

			await dispatch(getMyTeamAction()).unwrap();
			await dispatch(getMyTeamEventLogAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось отправить приглашение',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleRemoveMember = async () => {
		if (!selectedMemberId) {
			return;
		}

		try {
			await dispatch(deleteTeamMemberAction(selectedMemberId)).unwrap();

			showToast({
				title: 'Участник удалён',
				text: 'Участник был исключён из команды.',
				type: 'success',
			});

			setIsRemoveMemberModalOpen(false);
			setSelectedMemberId(null);

			await dispatch(getMyTeamAction()).unwrap();
			await dispatch(getMyTeamEventLogAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось удалить участника',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleApproveRequest = async () => {
		if (selectedRequestId === null) {
			return;
		}

		try {
			await dispatch(approveTeamJoinRequestAction(selectedRequestId)).unwrap();

			setIsApproveRequestModalOpen(false);
			setSelectedRequestId(null);

			showToast({
				title: 'Заявка одобрена',
				text: 'Участник добавлен в команду.',
				type: 'success',
			});

			await dispatch(getMyTeamAction()).unwrap();
			await dispatch(getMyTeamEventLogAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось одобрить заявку',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleRejectRequest = async () => {
		if (selectedRequestId === null) {
			return;
		}

		try {
			await dispatch(rejectTeamJoinRequestAction(selectedRequestId)).unwrap();

			setIsRejectRequestModalOpen(false);
			setSelectedRequestId(null);

			showToast({
				title: 'Заявка отклонена',
				text: 'Заявка на вступление отклонена.',
				type: 'success',
			});

			await dispatch(getMyTeamAction()).unwrap();
			await dispatch(getMyTeamEventLogAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось отклонить заявку',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleConfirmComposition = async () => {
		try {
			await dispatch(confirmTeamCompositionAction()).unwrap();

			setIsConfirmCompositionModalOpen(false);

			showToast({
				title: 'Состав подтверждён',
				text: 'Команда сформирована и заняла слот.',
				type: 'success',
			});

			await dispatch(getMyTeamAction()).unwrap();
			await dispatch(getMyTeamEventLogAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось подтвердить состав',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	if (!isMyTeamLoaded || isLoadingMyTeam) {
		return <Preloader />;
	}

	if (!myTeam || !isMemberOfTeam) {
		return null;
	}

	return (
		<>
			<Section
				sectionWidth='full'
				sectionTitle={{ text: 'Управление командой' }}
				sectionDescription='Сформируйте состав вашей команды'>
				<div className={styles.container}>
					<div className={styles.row_top}>
						<Card title='Команда' subtitle='Информация о вашей команде'>
							<div className={styles.team}>
								<div className={styles.team__header}>
									<div className={styles.team__main}>
										<h3 className={styles.team__name}>{myTeam.name}</h3>

										<Badge
											text={getTeamStatusText(myTeam.status)}
											color={getTeamStatusColor(myTeam.status)}
										/>
									</div>
								</div>

								<div className={styles.team__members}>
									<div className={styles.team__membersInfo}>
										<span>Состав команды</span>

										<strong>
											{myTeam.members.length} / {myTeam.maxTeamMembers}
										</strong>
									</div>

									<ProgressBar
										value={Math.min(
											myTeam.members.length,
											myTeam.minTeamMembers
										)}
										max={myTeam.minTeamMembers}
									/>

									<p className={styles.team__hint}>
										Минимальный состав — {myTeam.minTeamMembers} чел.
									</p>

									{myTeam.status === 'forming' ? (
										<Notice
											type='warning'
											title='Состав не подтверждён'
											text='Капитан может подтвердить состав только после того, как в команде будет набрано минимальное количество участников.'
										/>
									) : myTeam.status === 'assembled' ? (
										<Notice
											type='info'
											title='Состав команды подтверждён'
											text='Команда сформирована. Теперь вы можете перейти к выбору проекта вместе с командой.'
										/>
									) : null}
								</div>
							</div>

							<CardControl withMarginAuto>
								<Button
									style={{ margin: '0 auto 0 0' }}
									type='button'
									text='Назад'
									color='cancel'
									onClick={() => navigate(`/${EMAINROUTES.TEAM}`)}
								/>

								{myTeam.isCaptain && myTeam.status === 'forming' && (
									<>
										<Button
											type='button'
											text='Удалить команду'
											color='red'
											onClick={handleOpenDeleteModal}
											isBlock={isLoadingAction || !myTeam.canDeleteTeam}
										/>

										<Button
											type='button'
											text='Подтвердить состав'
											color='green'
											onClick={handleOpenConfirmCompositionModal}
											isBlock={isLoadingAction || !myTeam.canConfirmComposition}
										/>
									</>
								)}

								{!myTeam.isCaptain && myTeam.canLeave && (
									<Button
										type='button'
										text='Покинуть команду'
										color='red'
										onClick={handleOpenLeaveTeamModal}
										isBlock={isLoadingAction}
									/>
								)}
							</CardControl>
						</Card>
						<Card title='История команды' subtitle='Последние события'>
							<div className={styles.eventLog}>
								{isLoadingEventLog ? (
									<div className={styles.eventLog__empty}>
										Загрузка истории...
									</div>
								) : eventLog?.results.length ? (
									<div className={styles.eventLog__list}>
										{eventLog.results.map((event) => (
											<div
												className={styles.eventLog__item}
												key={`${event.created_at}-${event.user_id}`}>
												<div className={styles.eventLog__dot} />

												<div className={styles.eventLog__content}>
													<p className={styles.eventLog__text}>{event.text}</p>

													<time className={styles.eventLog__date}>
														{new Date(event.created_at).toLocaleString(
															'ru-RU',
															{
																day: '2-digit',
																month: '2-digit',
																year: 'numeric',
																hour: '2-digit',
																minute: '2-digit',
															}
														)}
													</time>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className={styles.eventLog__empty}>
										История команды пока пуста
									</div>
								)}
							</div>
						</Card>
					</div>
					<div className={styles.row_bottom}>
						<TeamLobbyMembers
							team={myTeam}
							onRemove={handleOpenRemoveMemberModal}
							onInvite={handleOpenInviteModal}
						/>
						<TeamLobbyInvitations invitations={myTeam.sentInvitations} />
						<TeamLobbyJoinRequests
							team={myTeam}
							onAccept={handleOpenApproveRequestModal}
							onReject={handleOpenRejectRequestModal}
						/>
					</div>
				</div>
			</Section>

			{/* Приглашение участника */}
			{isInviteModalOpen && (
				<Modal
					isOpen={isInviteModalOpen}
					onClose={handleCloseInviteModal}
					title='Пригласить участника'
					description='Выберите одногруппника, которого хотите пригласить в команду'>
					<InviteTeamMemberForm
						onSubmit={handleInviteMember}
						onCancel={handleCloseInviteModal}
						isLoading={isLoadingAction}
					/>
				</Modal>
			)}

			{/* Удаление команды */}
			{isDeleteModalOpen && (
				<ConfirmDelete
					isOpen={isDeleteModalOpen}
					onClose={handleCloseDeleteModal}
					id={myTeam.id}
					onSubmit={handleDeleteTeam}
				/>
			)}

			{/* Покинуть команду */}
			{isLeaveTeamModalOpen && (
				<ConfirmDelete
					isOpen={isLeaveTeamModalOpen}
					onClose={handleCloseLeaveTeamModal}
					id={myTeam.id}
					onSubmit={handleLeaveTeam}
				/>
			)}

			{/* Удаление участника */}
			{isRemoveMemberModalOpen && selectedMemberId !== null && (
				<ConfirmDelete
					isOpen={isRemoveMemberModalOpen}
					onClose={handleCloseRemoveMemberModal}
					id={selectedMemberId}
					onSubmit={handleRemoveMember}
				/>
			)}

			{/* Принять участника */}
			{isApproveRequestModalOpen && selectedRequestId !== null && (
				<ConfirmAction
					isOpen={isApproveRequestModalOpen}
					onClose={handleCloseApproveRequestModal}
					id={selectedRequestId}
					onSubmit={handleApproveRequest}
					title='Принять заявку?'
					subtitle='Студент будет добавлен в вашу команду.'
					buttonText='Принять'
					buttonColor='green'
				/>
			)}

			{/* Отклонить участника */}
			{isRejectRequestModalOpen && selectedRequestId !== null && (
				<ConfirmAction
					isOpen={isRejectRequestModalOpen}
					onClose={handleCloseRejectRequestModal}
					id={selectedRequestId}
					onSubmit={handleRejectRequest}
					title='Отклонить заявку?'
					subtitle='Заявка студента будет отклонена.'
					buttonText='Отклонить'
					buttonColor='red'
				/>
			)}

			{/* Подтверждение состава */}
			{isConfirmCompositionModalOpen && (
				<ConfirmAction
					isOpen={isConfirmCompositionModalOpen}
					onClose={handleCloseConfirmCompositionModal}
					id={myTeam.id}
					onSubmit={handleConfirmComposition}
					title='Подтвердить состав?'
					subtitle='После подтверждения команда будет сформирована. В дальнейшем изменять состав команды сможет только наставник.'
					buttonText='Подтвердить'
					buttonColor='green'
				/>
			)}
		</>
	);
};
