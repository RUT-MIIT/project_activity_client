export const getApiUrl = (): string => {
	const { hostname } = window.location;

	if (hostname === 'localhost') {
		/* return 'http://10.242.221.0:8000/api'; */
		return 'https://pd.rut-miit.ru/api';
	} else {
		return 'https://pd.rut-miit.ru/api';
	}
};

export const API_URL = getApiUrl();
