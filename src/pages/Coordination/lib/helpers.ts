import type { IApplicationItem } from '../../../store/application/types';

export const filterAppsByRole = (
	applications: IApplicationItem[],
	userRole: string
) => {
	let activeStatuses: string[] = [];
	let returnedStatuses: string[] = [];
	const rejectedStatuses: string[] = [
		'rejected',
		'rejected_cpds',
		'rejected_institute',
		'rejected_department',
	];

	switch (userRole) {
		case 'department_validator':
			activeStatuses = [
				'await_department',
				'work_department',
				'returned_institute',
				'returned_cpds',
			];
			returnedStatuses = ['returned_department'];
			break;

		case 'institute_validator':
			activeStatuses = ['work_institute', 'await_institute', 'returned_cpds'];
			returnedStatuses = [
				'returned_department',
				'returned_institute',
				'await_department',
				'work_department',
			];
			break;

		case 'cpds':
			activeStatuses = ['work_cpds', 'await_cpds'];
			returnedStatuses = [
				'returned_department',
				'returned_institute',
				'work_institute',
				'await_institute',
				'work_department',
				'await_department',
			];
			break;

		default:
			break;
	}

	const active = applications.filter((app) =>
		activeStatuses.includes(app.status.code)
	);
	const returned = applications.filter((app) =>
		returnedStatuses.includes(app.status.code)
	);
	const rejected = applications.filter((app) =>
		rejectedStatuses.includes(app.status.code)
	);
	const completed = applications.filter(
		(app) =>
			!activeStatuses.includes(app.status.code) &&
			!returnedStatuses.includes(app.status.code) &&
			!rejectedStatuses.includes(app.status.code)
	);

	return { active, returned, rejected, completed };
};
