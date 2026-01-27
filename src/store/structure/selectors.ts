import type { TRootState } from '../store';

import { createSelector } from 'reselect';

import {
	APPROVED_STATUSES,
	ACTIVE_STATUSES,
	RETURNED_STATUSES,
	REJECTED_STATUSES,
} from './lib';

const selectDivisionStats = (state: TRootState) =>
	state.structure.myDivisionStats;

const selectDivisionsNorms = (state: TRootState) =>
	state.structure.divisionsPlans;

const sumByStatuses = (
	source: Record<string, number | undefined> | undefined,
	statuses: string[]
): number => statuses.reduce((sum, status) => sum + (source?.[status] ?? 0), 0);

export const selectApplicationsSummary = createSelector(
	[selectDivisionStats],
	(divisionStats) => {
		const statuses = divisionStats?.applications_by_status;

		if (!statuses) {
			return {
				total: 0,
				approved: 0,
				active: 0,
				returned: 0,
				rejected: 0,
			};
		}

		const total = Object.values(statuses).reduce(
			(sum, value) => sum + (value ?? 0),
			0
		);

		return {
			total,
			approved: sumByStatuses(statuses, APPROVED_STATUSES),
			active: sumByStatuses(statuses, ACTIVE_STATUSES),
			returned: sumByStatuses(statuses, RETURNED_STATUSES),
			rejected: sumByStatuses(statuses, REJECTED_STATUSES),
		};
	}
);

export const getApprovedCount = (
	statuses?: Record<string, number | undefined>
): number =>
	APPROVED_STATUSES.reduce((sum, status) => sum + (statuses?.[status] ?? 0), 0);

export const selectDivisionsNormsSummary = createSelector(
	[selectDivisionsNorms],
	(divisions) => {
		let totalPlan = 0;
		let totalFact = 0;

		divisions.forEach((division) => {
			totalPlan += division.plan ?? 0;
			totalFact += getApprovedCount(division.applications_by_status);
		});

		const percent =
			totalPlan > 0 ? Math.round((totalFact / totalPlan) * 100) : 0;

		return {
			totalPlan,
			totalFact,
			percent,
		};
	}
);
