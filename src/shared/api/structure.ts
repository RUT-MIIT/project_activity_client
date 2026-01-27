import { request } from './utils';

export const getSemesters = () => {
	return request('/accounts/semesters', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const getMyDivisionStats = (semesterId: number) => {
	return request(
		`/showcase/department-plans/my-department-plan?semester_id=${semesterId}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
			},
		}
	);
};

export const getMyDivisionPlans = (params: {
	divisionCode?: string;
	semesterId: number;
}) => {
	const searchParams = new URLSearchParams();

	searchParams.append('semester_id', String(params.semesterId));

	if (params.divisionCode) {
		searchParams.append('institute_code', params.divisionCode);
	}

	return request(`/showcase/department-plans/?${searchParams.toString()}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const setDivisionPlan = (
	department_id: number,
	semester_id: number,
	plan: number
) => {
	return request('/showcase/department-plans/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify({ department_id, semester_id, plan }),
	});
};

export const getMyDivisionTags = () => {
	return request('/showcase/tags/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
	});
};

export const createDivisionTag = (name: string, category: string) => {
	return request('/showcase/tags/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify({ name, category }),
	});
};

export const removeDivisionTag = (tag_id: number, department_id: number) => {
	return request(`/showcase/tags/${tag_id}/detach-department/`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
		},
		body: JSON.stringify({ department_id }),
	});
};
