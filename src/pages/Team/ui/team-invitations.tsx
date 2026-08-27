import type { FC } from 'react';

import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Button } from '../../../shared/components/Button/ui/button';
import { Card } from '../../../shared/components/Card/ui';

import {
	acceptTeamInvitationAction,
	rejectTeamInvitationAction,
	getTeamLobbyAction,
} from '../../../store/student/actions';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import type { ILobbyInvitation } from '../../../store/student/types';

import styles from '../styles/team-invitations.module.scss';

interface ITeamInvitationsProps {
	invitations: ILobbyInvitation[];
}

const getRoleName = (role: ILobbyInvitation['role']) => {
	switch (role) {
		case 'leader':
			return 'Капитан команды';

		case 'member':
			return 'Участник';

		default:
			return role;
	}
};

export const TeamInvitations: FC<ITeamInvitationsProps> = ({ invitations }) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { isLoadingAction } = useSelector((state) => state.student);

	const handleAccept = async (invitationId: number) => {
		try {
			await dispatch(acceptTeamInvitationAction(invitationId)).unwrap();

			await dispatch(getTeamLobbyAction()).unwrap();

			showToast({
				title: 'Приглашение принято',
				text: 'Вы успешно вступили в команду.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось принять приглашение',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleReject = async (invitationId: number) => {
		try {
			await dispatch(rejectTeamInvitationAction(invitationId)).unwrap();

			showToast({
				title: 'Приглашение отклонено',
				text: 'Приглашение было отклонено.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось отклонить приглашение',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	if (!invitations.length) {
		return null;
	}

	return (
		<Card
			title={`Приглашения в команду (${invitations.length})`}
			subtitle='Команды отправили вам приглашение'>
			<div className={styles.container}>
				{invitations.map((invitation, i) => (
					<div key={invitation.id} className={styles.invitation}>
						<span className={styles.count}>{i + 1}.</span>

						<div className={styles.info}>
							<p className={styles.name}>Команда «{invitation.team.name}»</p>

							<div className={styles.row}>
								<p className={styles.text}>
									Капитан: {invitation.invitedBy.full_name}
								</p>

								<p className={styles.text}>
									Роль в команде: {getRoleName(invitation.role)}
								</p>
							</div>
						</div>

						<div className={styles.control}>
							<Button
								type='button'
								text='Отклонить'
								color='cancel'
								onClick={() => handleReject(invitation.id)}
								isBlock={isLoadingAction}
							/>

							<Button
								type='button'
								text='Принять'
								color='blue'
								onClick={() => handleAccept(invitation.id)}
								isBlock={isLoadingAction}
							/>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};
