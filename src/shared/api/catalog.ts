import { request } from './utils';

export const getInstitutesCatalog = () => {
	return request('/showcase/institutes/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const getDepartmentsCatalog = () => {
	return request('/accounts/departments/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const getDirectionsCatalog = () => {
	return request('/teams/directions/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getGroupsCatalog = () => {
	return request('/teams/study-groups/?is_end=false', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getRolesCatalog = () => {
	return request('/accounts/roles/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getTagsCatalog = () => {
	return request('/showcase/tags/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getExternalTagsCatalog = () => {
	return request('/showcase/tags/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};
