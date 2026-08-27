import type { FC } from 'react';
import type { ITeamSentInvitation } from '../../../store/student/types';

import { Card } from '../../../shared/components/Card/ui';
import { Text } from '../../../shared/components/Typography';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import styles from '../styles/team-lobby-invitations.module.scss';

interface ITeamLobbyInvitationsProps {
	invitations: ITeamSentInvitation[];
}

const getRoleName = (role: ITeamSentInvitation['role']) => {
	switch (role) {
		case 'leader':
			return 'Капитан команды';

		case 'member':
			return 'Участник';

		default:
			return role;
	}
};

const formatDate = (date: string) => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(date));
};

export const TeamLobbyInvitations: FC<ITeamLobbyInvitationsProps> = ({
	invitations,
}) => {
	return invitations ? (
		<Card
			title='Отправленные приглашения'
			subtitle='Приглашения, отправленные участникам'>
			<div className={styles.container}>
				{invitations.length > 0 ? (
					invitations.map((invitation, index) => (
						<div className={styles.item} key={invitation.id}>
							<span className={styles.count}>{index + 1}.</span>

							<div className={styles.info}>
								<p className={styles.name}>{invitation.user.full_name}</p>

								<div className={styles.row}>
									<span className={styles.text}>
										Роль: {getRoleName(invitation.role)}
									</span>

									<time className={styles.text}>
										{formatDate(invitation.created_at)}
									</time>
								</div>
							</div>
						</div>
					))
				) : (
					<Text text='Приглашений пока не отправлено' color='grey' />
				)}
			</div>
		</Card>
	) : (
		<Card
			title='Приглашение в команду'
			subtitle='Приглашения в команду отправляет капитан'>
			<Notice
				type='info'
				title='Хотите пригласить участника?'
				text='Если вы знаете студента, который хотел бы присоединиться к команде, предложите капитану отправить ему приглашение.'
			/>
		</Card>
	);
};
