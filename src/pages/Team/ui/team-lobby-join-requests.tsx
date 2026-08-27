import type { FC } from 'react';

import type { IMyTeam } from '../../../store/student/types';

import { Card } from '../../../shared/components/Card/ui';
import { Text } from '../../../shared/components/Typography';

import styles from '../styles/team-lobby-join-requests.module.scss';

interface ITeamLobbyJoinRequestsProps {
	team: IMyTeam;
	onAccept: (requestId: number) => void;
	onReject: (requestId: number) => void;
}

const formatDate = (date: string) => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(date));
};

export const TeamLobbyJoinRequests: FC<ITeamLobbyJoinRequestsProps> = ({
	team,
	onAccept,
	onReject,
}) => {
	if (!team.isCaptain) {
		return null;
	}

	return (
		<Card
			title={`Заявки на вступление (${team.joinRequests.length})`}
			subtitle='Студенты хотят присоединиться к вашей команде'>
			<div className={styles.container}>
				{team.joinRequests.length ? (
					<div className={styles.list}>
						{team.joinRequests.map((request, index) => (
							<div className={styles.item} key={request.id}>
								<span className={styles.count}>{index + 1}.</span>

								<div className={styles.info}>
									<p className={styles.name}>{request.user.full_name}</p>

									<time className={styles.text}>
										{formatDate(request.created_at)}
									</time>
								</div>

								<div className={styles.actions}>
									<button
										className={styles.accept}
										type='button'
										onClick={() => onAccept(request.id)}
										aria-label={`Принять заявку ${request.user.full_name}`}
										title='Принять заявку'>
										✓
									</button>

									<button
										className={styles.reject}
										type='button'
										onClick={() => onReject(request.id)}
										aria-label={`Отклонить заявку ${request.user.full_name}`}
										title='Отклонить заявку'>
										×
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<Text text='Заявок пока нет' color='grey' />
				)}
			</div>
		</Card>
	);
};
