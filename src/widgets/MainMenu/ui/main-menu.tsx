import type { FC } from 'react';

import { NavLink } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { getUser } from '../../../store/user/reducer';
import { logoutUser } from '../../../store/user/actions';

import { getLinksByRole } from '../lib/helpers';
import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/main-menu.module.scss';

interface IMainMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

export const MainMenu: FC<IMainMenuProps> = ({ isOpen, onClose }) => {
	const user = useSelector(getUser);
	const { unseenChangesCount } = useSelector((state) => state.application);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logoutUser());
	};

	const visibleLinks = getLinksByRole(user?.role);

	return (
		<>
			{isOpen && (
				<div
					className={`${styles.overlay} ${
						isOpen ? styles.overlay_visible : ''
					}`}
					onClick={onClose}
					aria-hidden='true'
				/>
			)}

			<section
				className={`${styles.container} ${
					isOpen ? styles.container_open : ''
				}`}>
				<div className={styles.header}>
					<span className={styles.logo}>ПроектРУТ</span>

					<span className={styles.logo__text}>
						Один портал для всех проектов
					</span>

					<button
						type='button'
						className={styles.close}
						onClick={onClose}
						aria-label='Закрыть меню'>
						<span />
						<span />
					</button>
				</div>

				<nav className={styles.nav}>
					{visibleLinks.map((elem, i) => (
						<NavLink
							to={`/${elem.url}`}
							key={i}
							onClick={onClose}
							className={({ isActive }) =>
								`${styles.link} ${isActive ? styles.link_active : ''}`
							}>
							<div
								className={`${styles.icon} ${styles[`icon_type_${elem.icon}`]}`}
							/>

							<p className={styles.icon__text}>{elem.name}</p>

							{elem.url === EMAINROUTES.MY_APPS && unseenChangesCount > 0 && (
								<div className={styles.icon__count}>{unseenChangesCount}</div>
							)}
						</NavLink>
					))}
				</nav>

				<div className={styles.footer}>
					<button
						onClick={handleLogout}
						className={`${styles.link} ${styles.link_type_logout}`}
						type='button'>
						<div className={`${styles.icon} ${styles.icon_type_logout}`} />

						<p className={styles.icon__text}>Выход</p>
					</button>
				</div>
			</section>
		</>
	);
};
