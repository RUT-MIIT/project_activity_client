import type { ITab } from '../../../shared/components/Tabs/types/types';
import type { IStatusOption } from '../components/ControlApprove/types/types';

export const tabs: ITab[] = [
	{ label: 'Подтверждение', path: '/control/approve' },
	{ label: 'Пользователи', path: '/control/users' },
	{ label: 'Заявки', path: '/control/apps' },
];

export const statusOptions: IStatusOption[] = [
	{ id: 'submitted', name: 'На рассмотрении' },
	{ id: 'approved', name: 'Одобрены' },
	{ id: 'rejected', name: 'Отклонены' },
];
