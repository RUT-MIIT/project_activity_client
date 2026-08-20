import type { FC } from 'react';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../store/store';

import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Button } from '../../../shared/components/Button/ui/button';
import { HomePerson } from './home-person';
import { HomeStats } from './home-stats';
import { HomePlan } from './home-plan';

import { getUser } from '../../../store/user/reducer';
import { getMyDivisionStatsAction } from '../../../store/structure/actions';

import { EMAINROUTES } from '../../../shared/utils/routes';
import { EROLES } from '../../../shared/utils/roles';

import styles from '../styles/home.module.scss';

export const Home: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentSemester, isLoadingStats } = useSelector(
		(state) => state.structure
	);
	const user = useSelector(getUser);

	const createNewApp = () => {
		navigate(`/${EMAINROUTES.NEW_APP}`, {
			replace: true,
		});
	};

	const openShowCase = () => {
		navigate(`/${EMAINROUTES.SHOWCASE}`, {
			replace: true,
		});
	};

	useEffect(() => {
		if (user?.role) {
			if (currentSemester && user.role !== EROLES.STUDENT) {
				dispatch(getMyDivisionStatsAction(currentSemester.id));
			}
		}
	}, [dispatch, user, currentSemester]);

	if (isLoadingStats) {
		<Preloader />;
	}

	return (
		user && (
			<div className={styles.home}>
				<div className={styles.header}>
					<div className={styles.header__info}>
						<h1 className={styles.header__title}>
							Добро пожаловать, {user.last_name} {user.first_name}
						</h1>
						<p className={styles.header__subtitle}>
							Вот что актуально на сегодня
						</p>
					</div>
					{user.role === EROLES.STUDENT ? (
						<Button
							text='Витрина проектов'
							color='white'
							withIcon={{ type: 'showcase', position: 'left', color: 'blue' }}
							onClick={openShowCase}
						/>
					) : (
						<Button
							text='Новая заявка'
							color='white'
							withIcon={{ type: 'add', position: 'left', color: 'blue' }}
							onClick={createNewApp}
						/>
					)}
				</div>
				<div className={styles.container}>
					<div className={styles.row}>
						<HomePerson />
						<HomeStats />
						<HomePlan />
					</div>
				</div>
			</div>
		)
	);
};
