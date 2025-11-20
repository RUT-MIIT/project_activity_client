import type { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../../store/store';
import { getIsAuthChecked, getUser } from '../../../store/user/reducer';
import { Preloader } from '../Preloader/ui/preloader';

interface IProtectedProps {
	onlyUnAuth?: boolean;
	component: ReactElement;
}

const Protected: FC<IProtectedProps> = ({ onlyUnAuth = false, component }) => {
	const isAuthChecked = useSelector(getIsAuthChecked);
	const user = useSelector(getUser);

	if (!isAuthChecked) return <Preloader />;

	// Неавторизован → пускаем только на страницы onlyUnAuth
	if (!user && !onlyUnAuth) {
		return <Navigate to='/login' replace />;
	}

	// Авторизован → не пускать на login/registration
	if (onlyUnAuth && user) {
		return <Navigate to='/home' replace />;
	}

	return component;
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({ component }: { component: ReactElement }) => (
	<Protected onlyUnAuth component={component} />
);
