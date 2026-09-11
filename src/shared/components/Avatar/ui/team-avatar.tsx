import type { FC } from 'react';

import styles from '../styles/team-avatar.module.scss';

interface ITeamAvatarProps {
	firstName: string;
	lastName: string;
	memberRole: 'leader' | 'mentor' | 'member';
}

export const TeamAvatar: FC<ITeamAvatarProps> = ({
	firstName,
	lastName,
	memberRole,
}) => {
	if (memberRole === 'leader') {
		return <div className={`${styles.img} ${styles.img_captain}`} />;
	}

	if (memberRole === 'mentor') {
		return <div className={`${styles.img} ${styles.img_mentor}`} />;
	}

	return (
		<div className={styles.img}>
			{firstName.slice(0, 1)}
			{lastName.slice(0, 1)}
		</div>
	);
};
