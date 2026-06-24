import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { Section } from '../../../shared/components/Section';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { ControlApprove } from '../components/ControlApprove/ui/control-approve';
import { ControlUsers } from '../components/ControlUsers/ui/control-users';
import { ControlApps } from '../components/ControlApps/ui/control-apps';

import { tabs } from '../lib/helpers';

export const Control: FC = () => {
	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Управление пользователями и заявками' }}
			sectionDescription='Проверьте данные и подтвердите или отклоните доступ'
			withHeaderMargin>
			<Tabs tabs={tabs} />

			<Routes>
				<Route path='approve' element={<ControlApprove />} />
				<Route path='users' element={<ControlUsers />} />
				<Route path='apps' element={<ControlApps />} />

				<Route path='' element={<Navigate to='approve' replace />} />
			</Routes>
		</Section>
	);
};
