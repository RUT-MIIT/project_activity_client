export const required = (errorMessage = 'Поле обязательно для заполнения') => ({
	validate: (value: string) => value.length > 0,
	errorMessage,
});

export const minLength = (
	length: number,
	errorMessage = `Минимальная длина: ${length} символов`
) => ({
	validate: (value: string) => value.length >= length,
	errorMessage,
});

export const emailFormat = (
	errorMessage = 'Неверный формат электронной почты'
) => ({
	validate: (value: string) =>
		/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value),
	errorMessage,
});

export const phoneFormat = (
	errorMessage = 'Введите корректный мобильный номер РФ'
) => ({
	validate: (value: string) => {
		if (!value) return false;

		// Оставляем только цифры и +
		const cleaned = value.replace(/[^\d+]/g, '');

		// Проверяем количество "+"
		if ((cleaned.match(/\+/g) || []).length > 1) return false;

		// "+" только в начале
		if (cleaned.includes('+') && !cleaned.startsWith('+')) return false;

		// Убираем "+"
		const digits = cleaned.replace(/\+/g, '');

		// В РФ мобильные номера — строго 11 цифр
		if (digits.length !== 11) return false;

		// Нормализуем номер: +7, 7 или 8 — допустимо
		if (
			!(
				cleaned.startsWith('+7') ||
				cleaned.startsWith('7') ||
				cleaned.startsWith('8')
			)
		) {
			return false;
		}

		// Начало мобильных номеров РФ: 9XX
		const WITHOUT_COUNTRY = digits.replace(/^7|^8/, '');

		if (!WITHOUT_COUNTRY.startsWith('9')) return false;

		return true;
	},
	errorMessage,
});
