import type { FC } from 'react';
import type { ITab } from '../../../shared/components/Tabs/types/types';
import type { IMentorGroupDetail } from '../../../store/mentor/types';

import { Outlet, useNavigate } from 'react-router-dom';

import { Section } from '../../../shared/components/Section';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Button } from '../../../shared/components/Button/ui/button';

import styles from '../styles/my-group-detail.module.scss';

interface IMyGroupHeaderProps {
	group: IMentorGroupDetail;
	tabs: ITab[];
}

export const MyGroupHeader: FC<IMyGroupHeaderProps> = ({ group, tabs }) => {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate('/my-groups');
	};

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: group.name }}
			sectionDescription='Управление учебной группой'>
			<div className={styles.header}>
				<Tabs tabs={tabs} />
				<Button
					type='button'
					text='К списку групп'
					color='cancel'
					onClick={handleBack}
					withIcon={{ type: 'prev', color: 'black', position: 'left' }}
				/>
			</div>

			<Outlet />
		</Section>
	);
};
