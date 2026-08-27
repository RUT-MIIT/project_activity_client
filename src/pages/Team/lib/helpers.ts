export type TeamStatus = 'forming' | 'assembled';

export const getTeamStatusText = (status: TeamStatus): string => {
	switch (status) {
		case 'forming':
			return 'Состав формируется';

		case 'assembled':
			return 'Команда сформирована';

		default:
			return status;
	}
};

export const getTeamStatusColor = (
	status: string
): 'yellow' | 'green' | 'blue' => {
	switch (status) {
		case 'forming':
			return 'yellow';

		case 'assembled':
			return 'green';

		default:
			return 'blue';
	}
};
