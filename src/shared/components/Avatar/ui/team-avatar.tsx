import type { FC } from 'react';

import styles from '../styles/team-avatar.module.scss';

interface ITeamAvatarProps {
	firstName: string;
	lastName: string;
	role: string;
}

export const TeamAvatar: FC<ITeamAvatarProps> = ({
	firstName,
	lastName,
	role,
}) => {
	if (role === 'Капитан команды') {
		return <div className={`${styles.img} ${styles.img_captain}`} />;
	}

	if (role === 'Наставник команды') {
		return <div className={`${styles.img} ${styles.img_mentor}`} />;
	}

	return (
		<div className={styles.img}>
			{firstName.slice(0, 1)}
			{lastName.slice(0, 1)}
		</div>
	);
};
