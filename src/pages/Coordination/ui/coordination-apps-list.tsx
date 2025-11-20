import type { FC } from 'react';
import type { ICoordinationAppsListProps } from '../types/types';

import { useNavigate } from 'react-router-dom';

import { AppCard } from '../../Application/components/AppCard/ui/app-card';
import { Text } from '../../../shared/components/Typography';

import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/coordination.module.scss';

export const CoordinationAppsList: FC<ICoordinationAppsListProps> = ({
	apps,
	description,
}) => {
	const navigate = useNavigate();

	const showHistoryApp = (id: number) => {
		navigate(`/${EMAINROUTES.COORDINATION}/history/${id}`);
	};

	const showDetailApp = (id: number) => {
		navigate(`/${EMAINROUTES.COORDINATION}/app/${id}`);
	};

	return (
		<>
			<p className={styles.description}>{description || ''}</p>
			{apps.length > 0 ? (
				<ul className={styles.list}>
					{apps.map((app) => (
						<AppCard
							card={app}
							key={app.id}
							withAuthor
							onShowHistory={showHistoryApp}
							onShowDetail={showDetailApp}
						/>
					))}
				</ul>
			) : (
				<Text text='Заявки не найдены.' color='grey' withMarginTop />
			)}
		</>
	);
};
