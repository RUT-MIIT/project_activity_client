import type { FC } from 'react';

import { useDispatch, useSelector } from '../../../../store/store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Section } from '../../../../shared/components/Section';
import { Preloader } from '../../../../shared/components/Preloader/ui/preloader';
import { HistoryApplication } from '../../../../widgets/HistoryApplication/ui/history-application';

import { getAppHistoryAction } from '../../../../store/history/actions';
import { markApplicationAsSeen } from '../../../../store/application/reducer';

export const MyAppHistory: FC = () => {
	const dispatch = useDispatch();
	const { isLoadingLogs } = useSelector((state) => state.history);

	const { appId } = useParams<{ appId: string }>();

	useEffect(() => {
		if (appId) {
			dispatch(getAppHistoryAction(appId));
			dispatch(markApplicationAsSeen(Number(appId)));
		}
	}, [dispatch, appId]);

	if (isLoadingLogs) return <Preloader />;

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{
				text: 'История заявки',
			}}
			sectionDescription='Просматривайте статусы и действия по заявке во времени'
			withHeaderMargin>
			<HistoryApplication />
		</Section>
	);
};
