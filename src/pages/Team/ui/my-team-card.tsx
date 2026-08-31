import type { FC } from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../shared/components/Button/ui/button';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { TeamCreateForm } from './team-create-form';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';

import {
	createTeamAction,
	getTeamLobbyAction,
} from '../../../store/student/actions';
import { getTeamStatusText, getTeamStatusColor } from '../lib/helpers';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/my-team-card.module.scss';

export const MyTeamCard: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { lobby, isLoadingAction } = useSelector((state) => state.student);

	const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

	const handleCreateTeam = async (data: { name: string }) => {
		try {
			await dispatch(createTeamAction(data)).unwrap();

			showToast({
				title: 'Команда успешно создана!',
				text: 'Теперь вы можете приглашать одногруппников в свою команду.',
				type: 'success',
			});

			setIsOpenCreateModal(false);
			await dispatch(getTeamLobbyAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось создать команду',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	return (
		<Card title='Моя команда' subtitle='Вступите в команду или создайте свою'>
			{lobby?.myTeam ? (
				<>
					<div className={styles.team}>
						<div className={styles.team__header}>
							<div className={styles.team__main}>
								<h3 className={styles.team__name}>{lobby.myTeam.name}</h3>
								<Badge
									text={getTeamStatusText(lobby.myTeam.status)}
									color={getTeamStatusColor(lobby.myTeam.status)}
								/>
							</div>
						</div>

						<div className={styles.team__members}>
							<div className={styles.team__membersInfo}>
								<span>Состав команды</span>

								<strong>
									{lobby.myTeam.members.length} /{' '}
									{lobby.tracks[0].maxTeamMembers}
								</strong>
							</div>

							<ProgressBar
								value={lobby.myTeam.members.length}
								max={lobby.myTeam.maxTeamMembers}
							/>

							<p className={styles.team__hint}>
								Минимальный состав — {lobby.tracks[0].minTeamMembers} чел.
							</p>
						</div>
					</div>

					<CardControl withMarginAuto>
						<Button
							text='Подробнее'
							color='blue'
							onClick={() => navigate(`/team/${lobby.myTeam?.id}/lobby`)}
							withIcon={{ type: 'next', color: 'white', position: 'right' }}
						/>
					</CardControl>
				</>
			) : (
				<>
					<Notice
						type='warning'
						title='Вы не состоите в команде'
						text='Создайте свою команду или вступите в одну из уже созданных команд.'
					/>

					<CardControl withMarginAuto>
						<Button
							text='Создать команду'
							color='blue'
							onClick={() => setIsOpenCreateModal(true)}
						/>
					</CardControl>
				</>
			)}

			{isOpenCreateModal && (
				<Modal
					title='Новая команда'
					isOpen={isOpenCreateModal}
					onClose={() => setIsOpenCreateModal(false)}>
					<TeamCreateForm
						onSubmit={handleCreateTeam}
						isLoading={isLoadingAction}
					/>
				</Modal>
			)}
		</Card>
	);
};
