import type { FC } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { Section } from '../../../../../shared/components/Section';
import { Tabs } from '../../../../../shared/components/Tabs/ui/tabs';
import { ControlGroupMentors } from './control-group-mentors';

import { tabs } from '../lib/helpers';

export const ControlGroup: FC = () => {
	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Управление группами' }}
			sectionDescription=''
			withHeaderMargin>
			<Tabs tabs={tabs} />

			<Routes>
				<Route path='mentors' element={<ControlGroupMentors />} />
				<Route path='' element={<Navigate to='mentors' replace />} />
			</Routes>
		</Section>
	);
};
