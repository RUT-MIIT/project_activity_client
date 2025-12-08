export const getStatusColor = (statusCode: string) => {
	if (statusCode.startsWith('rejected')) return 'red';
	if (statusCode === 'created') return 'blue';
	if (statusCode.startsWith('returned')) return 'grey';
	if (statusCode.startsWith('approved')) return 'green';
	if (statusCode.startsWith('require')) return 'purple';
	return 'yellow';
};

export const getStatusText = (statusCode: string) => {
	if (statusCode === 'created') return 'Создана';

	if (statusCode === 'returned_author') return 'Отозвана автором';
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

	if (statusCode === 'require_assignment') return 'Требует распределения';

	return statusCode;
};

export const getStatusComment = (statusCode: string): string => {
	switch (statusCode) {
		case 'created':
			return 'Заявка создана и ожидает дальнейших действий.';

		case 'returned_author':
			return 'Заявка была отозвана автором и требует повторной отправки при необходимости.';
		case 'returned_department':
			return 'Кафедра вернула заявку на доработку. Проверьте комментарии и внесите изменения.';
		case 'returned_institute':
			return 'Институт вернул заявку на доработку. Необходимо уточнить данные или исправить ошибки.';
		case 'returned_cpds':
			return 'ЦПДС вернул заявку. Требуется внести правки и отправить повторно.';

		case 'approved_department':
			return 'Заявка успешно согласована на уровне подразделения.';
		case 'approved_institute':
			return 'Заявка успешно согласована на уровне института.';
		case 'approved_cpds':
			return 'Заявка успешно согласована на уровне ЦПДС.';

		case 'rejected_department':
			return 'Кафедра отклонила заявку. Ознакомьтесь с причиной отказа.';
		case 'rejected_institute':
			return 'Институт отклонил заявку. Ознакомьтесь с причиной отказа.';
		case 'rejected_cpds':
			return 'ЦПДС отклонил заявку. Ознакомьтесь с причиной отказа.';

		case 'await_department':
			return 'Заявка передана на рассмотрение кафедры.';
		case 'await_institute':
			return 'Заявка передана в институт для согласования.';
		case 'await_cpds':
			return 'Заявка передана в ЦПДС и находится в очереди на обработку.';

		case 'approved':
			return 'Заявка полностью согласована. Процесс успешно завершён.';
		case 'rejected':
			return 'Заявка отклонена. Дальнейшая работа по ней прекращена.';

		case 'require_assignment':
			return 'Заявка ожидает назначения ответственного лица.';

		default:
			return 'Статус изменён.';
	}
};
