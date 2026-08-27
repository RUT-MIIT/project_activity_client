import type { FC } from 'react';

import type { ILobbyTeam } from '../../../store/student/types';

import { Card } from '../../../shared/components/Card/ui';
import { TeamCard } from './team-card';

import styles from '../styles/team-list.module.scss';

interface ITeamListProps {
	teams: ILobbyTeam[];
}

export const TeamList: FC<ITeamListProps> = ({ teams }) => {
	return (
		<Card
			title={`Созданные команды (${teams.length})`}
			subtitle='Выберите команду, в которую хотите вступить'>
			<div className={styles.list}>
				{teams.map((team) => (
					<TeamCard key={team.id} team={team} />
				))}
			</div>
		</Card>
	);
};
