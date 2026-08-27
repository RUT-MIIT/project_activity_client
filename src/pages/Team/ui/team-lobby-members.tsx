import type { FC } from 'react';
import type { IMyTeam, ITeamMember } from '../../../store/student/types';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import styles from '../styles/team-lobby-members.module.scss';

interface ITeamLobbyMembersProps {
	team: IMyTeam;
	onInvite: () => void;
	onRemove: (memberId: number) => void;
}

const getMemberName = (fullName: string) => {
	const parts = fullName.trim().split(/\s+/);

	return {
		lastName: parts[0] ?? '',
		firstName: parts[1] ?? '',
	};
};

export const TeamLobbyMembers: FC<ITeamLobbyMembersProps> = ({
	team,
	onInvite,
	onRemove,
}) => {
	return (
		<Card title='Участники команды' subtitle='Состав вашей команды'>
			<div className={styles.container}>
				{team.members.map((member: ITeamMember) => {
					const { firstName, lastName } = getMemberName(member.full_name);

					const isLeader = member.role === 'leader';

					return (
						<div className={styles.info} key={member.id}>
							<TeamAvatar
								firstName={firstName}
								lastName={lastName}
								role={isLeader ? 'Капитан команды' : 'Участник'}
							/>

							<div className={styles.user}>
								<p className={styles.name}>{member.full_name}</p>

								<p className={styles.role}>
									{isLeader ? 'Капитан команды' : 'Участник'}
								</p>
							</div>

							{team.isCaptain && !isLeader && (
								<button
									className={styles.remove}
									type='button'
									onClick={() => onRemove(member.id)}
									aria-label={`Удалить ${member.full_name} из команды`}
									title='Удалить участника'>
									×
								</button>
							)}
						</div>
					);
				})}
			</div>
			{team.isCaptain && (
				<CardControl withMarginAuto>
					<Button
						type='button'
						text='Пригласить участника'
						color='green'
						isBlock={team.members.length >= team.maxTeamMembers}
						onClick={onInvite}
					/>
				</CardControl>
			)}
		</Card>
	);
};
