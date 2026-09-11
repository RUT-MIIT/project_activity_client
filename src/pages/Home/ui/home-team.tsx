import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSelector } from '../../../store/store';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';
import { Badge } from '../../../shared/components/Badge/ui/badge';

import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/home-team.module.scss';

export const HomeTeam: FC = () => {
	const navigate = useNavigate();

	const { group } = useSelector((state) => state.student);

	const myTeam = group?.my_team;

	const getRole = (role: string) => {
		switch (role) {
			case 'leader':
				return 'Капитан команды';

			case 'member':
				return 'Участник';

			default:
				return role;
		}
	};

	const getTeamStatus = (status: string) => {
		switch (status) {
			case 'forming':
				return 'Состав формируется';

			case 'assembled':
				return 'Команда сформирована';

			default:
				return status;
		}
	};

	return (
		<Card title='Моя команда' subtitle='Информация о вашей команде'>
			{!group ? (
				<Notice
					type='warning'
					title='Группа не определена'
					text='Информация о вашей группе пока недоступна.'
				/>
			) : !myTeam ? (
				<Notice
					type='warning'
					title='Сначала сформируйте команду'
					text='Для выбора проекта необходимо сформировать команду и подтвердить её состав. После подтверждения состава вы сможете перейти к выбору проекта.'
				/>
			) : (
				<>
					<div className={styles.teamHeader}>
						<h3 className={styles.teamName}>{myTeam.name}</h3>
						<Badge
							text={getTeamStatus(myTeam.status)}
							color={myTeam.status === 'assembled' ? 'green' : 'yellow'}
						/>
					</div>
					<div className={styles.container}>
						{myTeam.members.map((member) => (
							<div className={styles.info} key={`member-${member.id}`}>
								<TeamAvatar
									firstName={member.full_name.split(' ')[1] || ''}
									lastName={member.full_name.split(' ')[0] || ''}
									memberRole={member.role}
								/>

								<div className={styles.user}>
									<p className={styles.name}>{member.full_name}</p>

									<p className={styles.role}>{getRole(member.role)}</p>
								</div>
							</div>
						))}

						{group.mentors.map((mentor) => (
							<div className={styles.info} key={`mentor-${mentor.id}`}>
								<TeamAvatar
									firstName={mentor.first_name}
									lastName={mentor.last_name}
									memberRole='mentor'
								/>

								<div className={styles.user}>
									<p className={styles.name}>
										{mentor.last_name} {mentor.first_name} {mentor.middle_name}
									</p>

									<p className={styles.role}>
										{mentor.position || 'Наставник команды'}
									</p>
								</div>
							</div>
						))}
					</div>
				</>
			)}
			<CardControl>
				<Button
					text='К моей команде'
					onClick={() => navigate(`/${EMAINROUTES.TEAM}`)}
					color='blue'
					withIcon={{
						type: 'next',
						color: 'white',
						position: 'right',
					}}
				/>
			</CardControl>
		</Card>
	);
};
