export type TPlanFactColor = 'red' | 'yellow' | 'green';

export const getPlanFactColor = (
	fact: number,
	plan: number
): TPlanFactColor => {
	if (fact === 0) return 'red';
	if (fact < plan) return 'yellow';
	return 'green';
};
