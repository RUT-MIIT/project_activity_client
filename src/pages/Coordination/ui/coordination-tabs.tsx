import type { FC } from 'react';
import type { ICoordinationAppTabsProps } from '../types/types';

import { Outlet } from 'react-router-dom';

import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Section } from '../../../shared/components/Section';

export const CoordinationTabs: FC<ICoordinationAppTabsProps> = ({ tabs }) => {
	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Согласование проектных заявок' }}
			sectionDescription='Проверяйте содержание, оставляйте комментарии и утверждайте заявки'
			withHeaderMargin>
			<Tabs tabs={tabs} />
			<Outlet />
		</Section>
	);
};
