import type { FC } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import { Section } from '../../../shared/components/Section';
import { MyTeamCard } from './my-team-card';
import { TeamLimits } from './team-limits';
import { TeamList } from '../ui/team-list';
import { TeamInvitations } from '../ui/team-invitations';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';

import { getTeamLobbyAction } from '../../../store/student/actions';

import styles from '../styles/team.module.scss';

export const Team: FC = () => {
	const dispatch = useDispatch();
	const { lobby, isLoadingLobby } = useSelector((state) => state.student);
	const isTeamMember = false;

	useEffect(() => {
		dispatch(getTeamLobbyAction());
	}, [dispatch]);

	if (isLoadingLobby) {
		return <Preloader />;
	}

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Формирование команд' }}
			sectionDescription='Объединитесь с одногруппниками, сформируйте команду и работайте над проектом вместе'>
			{lobby && (
				<div className={styles.container}>
					<div className={styles.top}>
						<MyTeamCard />

						<TeamLimits
							totalSlots={lobby.tracks[0].recommendedTeamsCount}
							usedSlots={lobby.tracks[0].teamsCount}
						/>
					</div>
					{!isTeamMember && (
						<>
							<TeamInvitations invitations={lobby.invitations} />
						</>
					)}
					<TeamList teams={lobby.teams} />
				</div>
			)}
		</Section>
	);
};
