import type { IApplicationItem } from './types';

export const countUnseenChanges = (apps: IApplicationItem[]) => {
	return apps.filter((app) => app.has_unseen_changes).length;
};
