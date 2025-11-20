export const getStatusColor = (statusCode: string) => {
	if (statusCode.startsWith('rejected')) return 'red';
	if (statusCode === 'created') return 'blue';
	if (statusCode.startsWith('returned')) return 'grey';
	if (statusCode.startsWith('approved')) return 'green';
	return 'yellow';
};

export const getStatusText = (statusCode: string) => {
	if (statusCode === 'created') return 'Создана';

	if (statusCode === 'returned_department')
		return 'Возвращена на доработку кафедрой';
	if (statusCode === 'returned_institute')
		return 'Возвращена на доработку институтом';
	if (statusCode === 'returned_cpds') return 'Возвращена на доработку ЦПДС';

	if (statusCode === 'approved_department') return 'Согласована подразделением';
	if (statusCode === 'approved_institute') return 'Согласована институтом';
	if (statusCode === 'approved_cpds') return 'Согласована ЦПДС';

	if (statusCode === 'rejected_department') return 'Отклонена кафедрой';
	if (statusCode === 'rejected_institute') return 'Отклонена институтом';
	if (statusCode === 'rejected_cpds') return 'Отклонена ЦПДС';

	if (statusCode === 'await_department') return 'Передана на кафедру';
	if (statusCode === 'await_institute') return 'Передана в институт';
	if (statusCode === 'await_cpds') return 'Передана в ЦПДС';

	if (statusCode === 'approved') return 'Согласована (итог)';
	if (statusCode === 'rejected') return 'Отклонена';
	return statusCode;
};
