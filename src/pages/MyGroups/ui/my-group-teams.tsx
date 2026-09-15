import type { FC } from 'react';

import { useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Button } from '../../../shared/components/Button/ui/button';
import { Text } from '../../../shared/components/Typography';
import { MyGroupTeamDetail } from './my-group-team-detail';

import {
	getMentorTeamAction,
	getMyGroupShowcaseAction,
} from '../../../store/mentor/actions';
import { getTeamStatusColor, getTeamStatusText } from '../../Team/lib/helpers';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/my-group-teams.module.scss';

export const MyGroupTeams: FC = () => {
	const dispatch = useDispatch();
	const { currentGroup, currentTeam } = useSelector((state) => state.mentor);
	const { showToast } = useToast();

	const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
	const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

	if (!currentGroup) {
		return null;
	}

	const selectedTeam = currentTeam?.id === selectedTeamId ? currentTeam : null;

	const handleOpenTeam = async (teamId: number) => {
		setSelectedTeamId(teamId);
		setIsTeamModalOpen(true);

		try {
			await dispatch(
				getMentorTeamAction({
					groupId: currentGroup.id,
					teamId,
				})
			).unwrap();

			await dispatch(
				getMyGroupShowcaseAction(Number(currentGroup.id))
			).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось открыть команду',
				text: getErrorMessage(err),
				type: 'error',
			});

			setSelectedTeamId(null);
			setIsTeamModalOpen(false);
		}
	};

	const handleCloseTeam = () => {
		setIsTeamModalOpen(false);
		setSelectedTeamId(null);
	};

	if (currentGroup.teams.length === 0) {
		return (
			<Text
				text='В группе пока нет сформированных команд.'
				color='grey'
				withMarginTop
			/>
		);
	}

	return (
		<>
			<div className={styles.container}>
				{currentGroup.teams.map((team) => (
					<Card key={team.id}>
						<div className={styles.header}>
							<Badge
								text={getTeamStatusText(team.status)}
								color={getTeamStatusColor(team.status)}
							/>

							<h3 className={styles.title}>{team.name}</h3>
						</div>

						<div className={styles.info}>
							<div className={styles.item}>
								<span className={styles.label}>Участники</span>

								<strong className={styles.value}>{team.membersCount}</strong>
							</div>
						</div>

						<CardControl withMarginAuto>
							<Button
								type='button'
								text='Управление'
								color='blue'
								onClick={() => handleOpenTeam(team.id)}
							/>
						</CardControl>
					</Card>
				))}
			</div>

			{isTeamModalOpen && (
				<MyGroupTeamDetail
					groupId={currentGroup.id}
					team={selectedTeam}
					isOpen={isTeamModalOpen}
					onClose={handleCloseTeam}
				/>
			)}
		</>
	);
};
