import type { FC } from 'react';
import type { IUserDataProps } from '../types/types';
import type { IApproveUser } from '../../../../../store/control-approve/types';

import { Badge } from '../../../../../shared/components/Badge/ui/badge';

import { convertDate } from '../../../../../shared/lib/date';

import styles from '../styles/control-approve.module.scss';

export const UserData: FC<IUserDataProps> = ({ user }) => {
	const renderStatus = (user: IApproveUser) => {
		if (user.status === 'approved') {
			return <Badge text='Заявка одобрена' color='green' />;
		}
		if (user.status === 'rejected') {
			return <Badge text='Заявка отклонена' color='red' />;
		}
		return <Badge text='Ожидает решения' color='yellow' />;
	};

	return (
		<div className={styles.data} key={user.id}>
			<div className={styles.top}>
				<div className={`${styles.field} ${styles.field_direction_column}`}>
					<h4 className={styles.name}>
						{user.last_name} {user.first_name} {user.middle_name}
					</h4>
					<span className={styles.field__caption}>
						{convertDate(user.created_at)}
					</span>
				</div>
				<div className={styles.field}>{renderStatus(user)}</div>
			</div>
			<div className={styles.bottom}>
				<div className={`${styles.field} ${styles.field_direction_column}`}>
					<span className={styles.field__caption}>Почта</span>
					<p className={styles.field__text}>{user.email}</p>
				</div>
				<div className={`${styles.field} ${styles.field_direction_column}`}>
					<span className={styles.field__caption}>Телефон</span>
					<p className={styles.field__text}>{user.phone}</p>
				</div>
				<div
					className={`${styles.field} ${styles.field_direction_column} ${styles.field_width_full}`}>
					<span className={styles.field__caption}>Комментарий</span>
					<p className={styles.field__text}>{user.comment}</p>
				</div>
			</div>
		</div>
	);
};
