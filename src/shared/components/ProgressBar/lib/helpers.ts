export const getPercent = (value: number, max: number): number => {
	if (max <= 0) return 0;

	const percent = Math.round((value / max) * 100);
	return Math.min(percent, 100);
};
