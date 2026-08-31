import type { FC } from 'react';

import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import type { ILobbyTeam } from '../../../store/student/types';

import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';

import {
	createTeamJoinRequestAction,
	getTeamLobbyAction,
} from '../../../store/student/actions';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { getTeamStatusText, getTeamStatusColor } from '../lib/helpers';

import styles from '../styles/team-card.module.scss';

interface ITeamCardProps {
	team: ILobbyTeam;
}

export const TeamCard: FC<ITeamCardProps> = ({ team }) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { lobby, isLoadingAction } = useSelector((state) => state.student);

	const isMyTeam = lobby?.myTeam?.id === team.id;
	const isAlreadyInTeam = lobby?.myTeam != null;
	const isTeamFull = team.membersCount >= team.maxTeamMembers;
	const isRequestPending = team.myPendingJoinRequestId !== null;
	const isTeamAssembled = team.status === 'assembled';

	const isJoinDisabled =
		isAlreadyInTeam ||
		isTeamFull ||
		isRequestPending ||
		isTeamAssembled ||
		isLoadingAction;

	const getJoinButtonText = () => {
		if (isMyTeam) {
			return 'Ваша команда';
		}

		if (isRequestPending) {
			return 'Заявка подана';
		}

		if (isTeamAssembled) {
			return 'Состав сформирован';
		}

		if (isTeamFull) {
			return 'Команда заполнена';
		}

		if (isAlreadyInTeam) {
			return 'Вы уже в команде';
		}

		return 'Подать заявку';
	};

	const handleJoinTeam = async () => {
		if (isJoinDisabled) {
			return;
		}

		try {
			await dispatch(createTeamJoinRequestAction(team.id)).unwrap();

			showToast({
				title: 'Заявка отправлена',
				text: `Заявка на вступление в команду «${team.name}» успешно отправлена.`,
				type: 'success',
			});

			await dispatch(getTeamLobbyAction()).unwrap();
		} catch (err) {
			showToast({
				title: 'Не удалось подать заявку',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<Badge
					text={getTeamStatusText(team.status)}
					color={getTeamStatusColor(team.status)}
				/>

				<h3 className={styles.name}>{team.name}</h3>
			</div>

			<div className={styles.info}>
				<div className={styles.row}>
					<span className={styles.caption}>Капитан</span>

					<p className={styles.value}>{team.captain.full_name}</p>
				</div>

				<div className={styles.members}>
					<div className={styles.membersInfo}>
						<span>Состав команды</span>

						<strong>
							{team.membersCount} / {team.maxTeamMembers}
						</strong>
					</div>

					<ProgressBar value={team.membersCount} max={team.maxTeamMembers} />
				</div>
			</div>

			<div className={styles.actions}>
				<Button
					text={getJoinButtonText()}
					color='blue'
					isBlock={isJoinDisabled}
					onClick={handleJoinTeam}
				/>
			</div>
		</div>
	);
};
