import type {
	ILoginRequest,
	IRegistrationRequest,
	IAuthResponse,
	IStudentRegistrationRequest,
	IPreRegistrationLookupRequest,
} from '../../store/user/types';

import { request } from './utils';

const setTokens = (accessToken: string) => {
	localStorage.setItem('accessToken', accessToken);
};

export const login = (data: ILoginRequest) => {
	return request('/auth/login/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then((res: IAuthResponse) => {
		if (res.access) {
			setTokens(res.access);
		}
		return res;
	});
};

export const registration = (data: IRegistrationRequest) => {
	return request('/accounts/registration-requests/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then((res: IAuthResponse) => {
		if (res.access) {
			setTokens(res.access);
		}
		return res;
	});
};

export const lookupPreRegisteredStudent = (
	data: IPreRegistrationLookupRequest
) => {
	return request('/accounts/pre-registered-students/lookup/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};

export const registerStudent = (data: IStudentRegistrationRequest) => {
	return request('/accounts/pre-registered-students/register/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};

export const reportStudentMismatch = (data: {
	id: number;
	comment: string;
}) => {
	return request('/accounts/pre-registered-students/report-mismatch/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};

export const getUser = () => {
	return request('/auth/user', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const changePassword = ({
	current_password,
	new_password,
}: {
	current_password: string;
	new_password: string;
}) => {
	return request('/accounts/password/change/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify({ current_password, new_password }),
	});
};

export const forgotPassword = ({ email }: { email: string }) => {
	return request('/auth/password/reset/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email }),
	});
};

export const resetPassword = ({
	uid,
	token,
	new_password,
}: {
	uid: string;
	token: string;
	new_password: string;
}) => {
	return request('/auth/password/reset/confirm/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ uid, token, new_password }),
	});
};
