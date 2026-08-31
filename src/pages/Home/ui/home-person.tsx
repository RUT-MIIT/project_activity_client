import type { FC } from 'react';

import { useState } from 'react';
import { useSelector } from '../../../store/store';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Button } from '../../../shared/components/Button/ui/button';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { UserEditForm } from '../../../entities/user/ui/user-edit-form';
import { ChangePasswordForm } from '../../../features/ChangePassword/ui/change-password-form';

import { getUser } from '../../../store/user/reducer';
import { convertRole } from '../../../shared/lib/role';
import { EROLES } from '../../../shared/utils/roles';

import styles from '../styles/home-person.module.scss';

export const HomePerson: FC = () => {
	const user = useSelector(getUser);
	const { group } = useSelector((state) => state.student);

	const [isShowPersonModal, setIsShowPersonModal] = useState<boolean>(false);
	const [isShowPasswordModal, setIsShowPasswordModal] =
		useState<boolean>(false);

	const openPersonModal = () => {
		setIsShowPersonModal(true);
	};

	const openPasswordModal = () => {
		setIsShowPasswordModal(true);
	};

	const closeModals = () => {
		setIsShowPersonModal(false);
		setIsShowPasswordModal(false);
	};

	return (
		user && (
			<>
				<Card title='Информация профиля'>
					<div className={styles.container}>
						<div className={styles.info}>
							<div className={styles.img}>
								{user.first_name.slice(0, 1)}
								{user.last_name.slice(0, 1)}
							</div>

							<h4 className={styles.name}>
								{user.last_name} {user.first_name} {user.middle_name}
							</h4>

							<div className={styles.badge}>
								<Badge text='Активен' color='green' />
							</div>
						</div>

						<div className={styles.role}>
							<span className={styles.role__caption}>Роль</span>

							<p className={styles.role__title}>{convertRole(user.role)}</p>
						</div>

						{group && user.role === EROLES.STUDENT && (
							<div className={styles.education}>
								<div className={styles.education__item}>
									<span className={styles.education__caption}>
										Учебная группа
									</span>

									<p className={styles.education__title}>{group.name}</p>
								</div>
								<div className={styles.education__item}>
									<span className={styles.education__caption}>Институт</span>

									<p className={styles.education__title}>
										{group.institute.name}
									</p>
								</div>
								<div className={styles.education__item}>
									<span className={styles.education__caption}>Профиль</span>

									<p className={styles.education__title}>{group.profile}</p>
								</div>
								<div className={styles.education__item}>
									<span className={styles.education__caption}>Направление</span>

									<p className={styles.education__title}>
										{group.direction.name}
									</p>
								</div>
							</div>
						)}
					</div>

					<CardControl withMarginAuto>
						<Button text='Просмотр' color='cancel' onClick={openPersonModal} />

						<Button text='Изменить пароль' onClick={openPasswordModal} />
					</CardControl>
				</Card>

				{isShowPersonModal && (
					<Modal
						isOpen={isShowPersonModal}
						onClose={closeModals}
						title='Данные пользователя'>
						<UserEditForm />
					</Modal>
				)}

				{isShowPasswordModal && (
					<Modal
						isOpen={isShowPasswordModal}
						onClose={closeModals}
						title='Изменение пароля'>
						<ChangePasswordForm
							onSuccess={() => setIsShowPasswordModal(false)}
						/>
					</Modal>
				)}
			</>
		)
	);
};
