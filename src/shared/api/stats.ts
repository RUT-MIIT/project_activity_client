import { request } from './utils';

export const getStats = (params?: {
	semester_id?: string;
	institute_code?: string;
}) => {
	const search = new URLSearchParams();

	search.append('semester_id', params?.semester_id ?? 'actual');

	if (params?.institute_code) {
		search.append('institute_code', params.institute_code);
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
