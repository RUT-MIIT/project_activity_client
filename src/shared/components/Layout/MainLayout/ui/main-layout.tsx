import type { FC } from 'react';

import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../../../store/store';

import { MainMenu } from '../../../../../widgets/MainMenu/ui/main-menu';

import { getUser } from '../../../../../store/user/reducer';
import { logoutUser } from '../../../../../store/user/actions';
import { convertRole } from '../../../../lib/role';

import styles from '../styles/main-layout.module.scss';

export const MainLayout: FC = () => {
	const user = useSelector(getUser);
	const dispatch = useDispatch();

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLogout = () => {
		dispatch(logoutUser());
	};

	const handleCloseMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<div className={styles.container}>
			<MainMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />

			<div className={styles.main}>
				<div className={styles.header}>
					<button
						type='button'
						className={styles.menuButton}
						onClick={() => setIsMenuOpen(true)}
						aria-label='Открыть меню'>
						<span />
						<span />
						<span />
					</button>

					<div className={styles.user}>
						{user && (
							<>
								<p className={styles.role}>{convertRole(user.role)}</p>

								<p className={styles.name}>
									{user.last_name} {user.first_name}
								</p>
							</>
						)}

						<button
							onClick={handleLogout}
							className={styles.logout}
							type='button'>
							<div className={styles.logout__icon}></div>
							<p className={styles.logout__text}>Выход</p>
						</button>
					</div>
				</div>

				<Outlet />
			</div>
		</div>
	);
};
