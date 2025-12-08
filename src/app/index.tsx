import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useDispatch } from '../store/store';
import {
	OnlyUnAuth,
	OnlyAuth,
} from '../shared/components/ProtectedRoute/protected-route';

import { Login } from '../pages/Login/ui/login';
import { Registration } from '../pages/Registration/ui/registration';
import { ForgotPassword } from '../pages/ForgotPassword/ui/forgot-password';
import { Apply } from '../pages/Apply/ui/apply';
import { NotFound } from '../pages/NotFound/ui/not-found';
import { Home } from '../pages/Home/ui/home';
import { NewApp } from '../pages/Application/NewApp/ui/new-app';
import { MyApp } from '../pages/Application/MyApp/ui/my-app';
import { ExternalApp } from '../pages/Application/ExternalApp/ui/external-app';
import { Coordination } from '../pages/Coordination/ui/coordination';
import { Structure } from '../pages/Structure/ui/structure';
import { Stats } from '../pages/Stats/ui/stats';
import { Control } from '../pages/Control/ui/control';
import { MainLayout } from '../shared/components/Layout/MainLayout/ui/main-layout';
import { Privacy } from '../pages/Privacy/ui/privacy';

import { checkUserAuth } from '../store/user/actions';
import { ToastProvider } from '../shared/components/ToastProvider/ui/ToastProvider';
import { EPAGESROUTES } from '../shared/utils/routes';

import styles from './app.module.scss';

export const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(checkUserAuth());
	}, [dispatch]);

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
						path={EPAGESROUTES.REGISTRATION}
						element={<OnlyUnAuth component={<Registration />} />}
					/>
					<Route
						path={EPAGESROUTES.FORGOT_PASSWORD}
						element={<OnlyUnAuth component={<ForgotPassword />} />}
					/>
					<Route
						path={EPAGESROUTES.APPLY}
						element={<OnlyUnAuth component={<Apply />} />}
					/>
					<Route path={EPAGESROUTES.PRIVACY} element={<Privacy />} />

					{/* ---------- Авторизованный редирект для / ---------- */}
					<Route
						path='/'
						element={<OnlyAuth component={<Navigate to='/home' replace />} />}
					/>

					{/* ---------- Авторизованные страницы в MainLayout ---------- */}
					<Route element={<OnlyAuth component={<MainLayout />} />}>
						<Route path='/home' element={<Home />} />
						<Route path='/new-application' element={<NewApp />} />
						<Route path='/my-applications/*' element={<MyApp />} />
						<Route path='/external-applications/*' element={<ExternalApp />} />
						<Route path='/coordination/*' element={<Coordination />} />
						<Route path='/structure' element={<Structure />} />
						<Route path='/stats' element={<Stats />} />
						<Route path='/control/*' element={<Control />} />
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
