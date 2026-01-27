import type { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Section } from '../../../shared/components/Section';

import { tabs } from '../lib/lib';

export const StructureHeader: FC = () => {
	return (
		<Section
			sectionWidth='full'
			sectionTitle={{
				text: 'Управление настройками структурных поразделений',
			}}
			sectionDescription='Задавайте настройки и нормативы для подразделений РУТ (МИИТ)'
			withHeaderMargin>
			<Tabs tabs={tabs} />
			<Outlet />
		</Section>
	);
};
