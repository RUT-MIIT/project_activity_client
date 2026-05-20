import type { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Section } from '../../../shared/components/Section';

import { tabs } from '../lib/lib';

export const TrackContainer: FC = () => {
	return (
		<Section
			sectionWidth='full'
			sectionTitle={{
				text: 'Проектные треки',
			}}
			sectionDescription='Создавайте и управляйте проектными треками для своего подразделения'
			withHeaderMargin>
			<Tabs tabs={tabs} />
			<Outlet />
		</Section>
	);
};
