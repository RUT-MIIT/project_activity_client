import type { FC } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../../store/store';

import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Section } from '../../../shared/components/Section';
import { Button } from '../../../shared/components/Button/ui/button';

import { getTrackTabs } from '../lib/lib';
import { clearSelectedInstitute } from '../../../store/track/reducer';

import styles from '../styles/track-conteiner.module.scss';

export const TrackContainer: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);

	const tabs = getTrackTabs(user?.role);

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{
				text: 'Проектные треки',
			}}
			sectionDescription='Создавайте и управляйте проектными треками для своего подразделения'
			withHeaderMargin>
			<div className={styles.header}>
				<Tabs tabs={tabs} />
				{user?.role === 'cpds' && (
					<Button
						text='Вернуться'
						withIcon={{ type: 'prev', color: 'black' }}
						onClick={() => {
							dispatch(clearSelectedInstitute());
							navigate('/track/info');
						}}
					/>
				)}
			</div>

			<Outlet />
		</Section>
	);
};
