import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../../store/store';

import { Section } from '../../../../shared/components/Section/ui/section';
import { Preloader } from '../../../../shared/components/Preloader/ui/preloader';
import { Text } from '../../../../shared/components/Typography';
import { AppCard } from '../../components/AppCard/ui/app-card';

import { getExternalAppsAction } from '../../../../store/application/actions';
import { EMAINROUTES } from '../../../../shared/utils/routes';

import styles from '../styles/external-app.module.scss';

export const ExternalAppList: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { externalApplications, isLoading } = useSelector(
		(state) => state.application
	);

	const showDetailApp = (id: number) => {
		navigate(`/${EMAINROUTES.EXTERNAL_APPS}/app/${id}`);
	};

	useEffect(() => {
		dispatch(getExternalAppsAction());
	}, [dispatch]);

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Внешние заявки' }}
			sectionDescription='Распределите заявки по институтам'
			withHeaderMargin>
			{isLoading ? (
				<Preloader />
			) : (
				<>
					<div className={styles.header}></div>
					{externalApplications.length > 0 ? (
						<ul className={styles.list}>
							{externalApplications.map((item) => (
								<AppCard
									card={item}
									key={item.id}
									onShowDetail={showDetailApp}
									withAuthor
								/>
							))}
						</ul>
					) : (
						<Text
							text='По заданным параметрам ничего не найдено'
							color='grey'
							withMarginTop
						/>
					)}
				</>
			)}
		</Section>
	);
};
