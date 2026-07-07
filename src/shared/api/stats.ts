import { request } from './utils';

export const getStats = (params?: {
	semester_id?: string;
	institute_code?: string;
	department_id?: string;
}) => {
	const search = new URLSearchParams();

	search.append('semester_id', params?.semester_id ?? 'actual');

	if (params?.institute_code) {
		search.append('institute_code', params.institute_code);
	}

	if (params?.department_id) {
		search.append('department_id', params.department_id);
	}

	return request(
		`/showcase/project-applications/dashboard/?${search.toString()}`,
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
