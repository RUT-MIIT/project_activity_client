export const getApiUrl = (): string => {
	const { hostname } = window.location;

	if (hostname === 'localhost') {
		return 'https://pd.rut-miit.ru/api';
	} else {
		return 'https://pd.rut-miit.ru/api';
	}
};

export const API_URL = getApiUrl();
