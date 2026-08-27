import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../store/store';
import {
	OnlyUnAuth,
	OnlyAuth,
} from '../shared/components/ProtectedRoute/protected-route';

import { Login } from '../pages/Login/ui/login';
import { Registration } from '../pages/Registration/ui/registration';
import { RegistrationStudent } from '../pages/Registration/ui/registration-student';
import { ForgotPassword } from '../pages/ForgotPassword/ui/forgot-password';
import { ResetPassword } from '../pages/ResetPassword/reset-password';
import { Apply } from '../pages/Apply/ui/apply';
import { NotFound } from '../pages/NotFound/ui/not-found';
import { Home } from '../pages/Home/ui/home';
import { NewApp } from '../pages/Application/NewApp/ui/new-app';
import { MyApp } from '../pages/Application/MyApp/ui/my-app';
import { ExternalApp } from '../pages/Application/ExternalApp/ui/external-app';
import { Coordination } from '../pages/Coordination/ui/coordination';
import { Structure } from '../pages/Structure/ui/structure';
import { Track } from '../pages/Track/ui/track';
import { Stats } from '../pages/Stats/ui/stats';
import { Control } from '../pages/Control/ui/control';
import { Group } from '../pages/Group/ui/group';
import { Team } from '../pages/Team/ui/team';
import { TeamLobby } from '../pages/Team/ui/team-lobby';
import { Showcase } from '../pages/Showcase/ui/showcase';
import { MainLayout } from '../shared/components/Layout/MainLayout/ui/main-layout';
import { Privacy } from '../pages/Privacy/ui/privacy';
import { Preloader } from '../shared/components/Preloader/ui/preloader';

import { checkUserAuth } from '../store/user/actions';
import { getSemestersAction } from '../store/structure/actions';
import { getAppsAction } from '../store/application/actions';
import { getMyGroupAction } from '../store/student/actions';
import { ToastProvider } from '../shared/components/ToastProvider/ui/ToastProvider';
import { EPAGESROUTES, EMAINROUTES } from '../shared/utils/routes';
import { EROLES } from '../shared/utils/roles';

import styles from './app.module.scss';

export const App = () => {
	const dispatch = useDispatch();
	const { user, isAuthChecked } = useSelector((state) => state.user);
	const { isLoadingGroup } = useSelector((state) => state.student);
	const { isLoading } = useSelector((state) => state.application);

	useEffect(() => {
		dispatch(checkUserAuth());
	}, [dispatch]);

	useEffect(() => {
		if (isAuthChecked && user) {
			if (user.role !== EROLES.STUDENT) {
				dispatch(getSemestersAction());
				dispatch(getAppsAction());
			}
			if (user.role === EROLES.STUDENT) {
				dispatch(getMyGroupAction());
			}
		}
	}, [dispatch, isAuthChecked, user]);

	if (isLoading || isLoadingGroup) {
		<Preloader />;
	}

	return (
		<ToastProvider>
			<div className={styles.page}>
				<Routes>
					{/* ---------- Неавторизованные ---------- */}
					<Route
						path={EPAGESROUTES.LOGIN}
						element={<OnlyUnAuth component={<Login />} />}
					/>
					<Route
						path={EPAGESROUTES.REGISTRATION_STUDENT}
						element={<OnlyUnAuth component={<RegistrationStudent />} />}
					/>
					<Route
						path={EPAGESROUTES.REGISTRATION}
						element={<OnlyUnAuth component={<Registration />} />}
					/>
					<Route
						path={EPAGESROUTES.FORGOT_PASSWORD}
						element={<OnlyUnAuth component={<ForgotPassword />} />}
					/>
					<Route
						path={`${EPAGESROUTES.RESET_PASSWORD}/:uid/:token`}
						element={<OnlyUnAuth component={<ResetPassword />} />}
					/>
					<Route
						path={EPAGESROUTES.APPLY}
						element={<OnlyUnAuth component={<Apply />} />}
					/>
					<Route path={EPAGESROUTES.PRIVACY} element={<Privacy />} />

					{/* ---------- Авторизованный редирект для / ---------- */}
					<Route
						path='/'
						element={
							<OnlyAuth
								component={<Navigate to={`/${EMAINROUTES.HOME}`} replace />}
							/>
						}
					/>

					{/* ---------- Авторизованные страницы в MainLayout ---------- */}
					<Route element={<OnlyAuth component={<MainLayout />} />}>
						<Route path={`/${EMAINROUTES.HOME}`} element={<Home />} />
						<Route path={`/${EMAINROUTES.NEW_APP}`} element={<NewApp />} />
						<Route path={`/${EMAINROUTES.MY_APPS}/*`} element={<MyApp />} />
						<Route
							path={`/${EMAINROUTES.EXTERNAL_APPS}/*`}
							element={<ExternalApp />}
						/>
						<Route
							path={`/${EMAINROUTES.COORDINATION}/*`}
							element={<Coordination />}
						/>
						<Route
							path={`/${EMAINROUTES.STRUCTURE}/*`}
							element={<Structure />}
						/>
						<Route path={`/${EMAINROUTES.STATS}`} element={<Stats />} />
						<Route path={`/${EMAINROUTES.TRACK}/*`} element={<Track />} />
						<Route path={`/${EMAINROUTES.GROUP}/*`} element={<Group />} />
						<Route path={`/${EMAINROUTES.TEAM}`}>
							<Route index element={<Team />} />
							<Route path=':teamId/lobby' element={<TeamLobby />} />
						</Route>
						<Route path={`/${EMAINROUTES.SHOWCASE}/*`} element={<Showcase />} />
						<Route
							path={`/${EMAINROUTES.CONTROL}/*`}
							element={
								user?.role === EROLES.ADMIN || user?.role === EROLES.CPDS ? (
									<Control />
								) : (
									<Navigate to={`/${EMAINROUTES.HOME}`} replace />
								)
							}
						/>
					</Route>

					{/* ---------- 404 ---------- */}
					<Route path='*' element={<NotFound />} />
				</Routes>

				<div id='modal-root'></div>
				<div id='toast-root'></div>
				<div id='tooltip-root'></div>
			</div>
		</ToastProvider>
	);
};
