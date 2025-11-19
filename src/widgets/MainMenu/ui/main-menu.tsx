import type { FC } from 'react';

import { NavLink } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { getUser } from '../../../store/user/reducer';
import { logoutUser } from '../../../store/user/actions';

import { EPAGESROUTES } from '../../../shared/utils/routes';
import { links } from '../lib/helpers';

import styles from '../styles/main-menu.module.scss';

export const MainMenu: FC = () => {
	const user = useSelector(getUser);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logoutUser());
	};

	const visibleLinks =
		user?.role === 'admin' || user?.role === 'cpds'
			? links
			: user?.role === 'mentor'
			? links.slice(0, 3)
			: links.slice(0, 4);

	return (
		<section className={styles.container}>
			<div className={styles.header}>
				<span className={styles.logo}>ПроектРУТ</span>
				<span className={styles.logo__text}>Один портал для всех проектов</span>
			</div>
			<nav className={styles.nav}>
				{visibleLinks.map((elem, i) => (
					<NavLink
						to={`${EPAGESROUTES.MAIN}/${elem.url}`}
						key={i}
						className={({ isActive }) =>
							`${styles.link} ${isActive ? styles.link_active : ''}`
						}>
						<div
							className={`${styles.icon} ${styles[`icon_type_${elem.icon}`]}`}
						/>
						<p className={styles.icon__text}>{elem.name}</p>
					</NavLink>
				))}
			</nav>
			<div className={styles.footer}>
				<button
					onClick={handleLogout}
					className={`${styles.link} ${styles.link_type_logout}`}
					type='button'>
					<div className={`${styles.icon} ${styles.icon_type_logout}`}></div>
					<p className={styles.icon__text}>Выход</p>
				</button>
			</div>
		</section>
	);
};
