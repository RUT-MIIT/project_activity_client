import type { FC } from 'react';

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import {
	FormField,
	FormInputStub,
} from '../../../shared/components/Form/components';

import { getMyGroupShowcaseDetailAction } from '../../../store/mentor/actions';

interface IMyGroupShowcaseDetailProps {
	id: number | null;
	isOpen: boolean;
	onClose: () => void;
}

const tabs = [
	{
		path: 'main',
		label: 'Главное',
	},
	{
		path: 'description',
		label: 'Описание',
	},
];

export const MyGroupShowcaseDetail: FC<IMyGroupShowcaseDetailProps> = ({
	id,
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();

	const { showcaseDetail, isLoadingShowcaseDetail } = useSelector(
		(state) => state.mentor
	);

	const [activeTab, setActiveTab] = useState('main');

	useEffect(() => {
		if (isOpen && id) {
			setActiveTab('main');

			dispatch(getMyGroupShowcaseDetailAction(id));
		}
	}, [dispatch, id, isOpen]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Информация о проекте'
			description='Информация доступна только для просмотра'>
			{isLoadingShowcaseDetail ? (
				<Preloader />
			) : (
				<>
					{showcaseDetail && (
						<>
							<Tabs
								tabs={tabs}
								activeTab={activeTab}
								onTabChange={setActiveTab}
							/>

							{activeTab === 'main' && (
								<>
									<FormField title='Наименование проекта'>
										<FormInputStub value={showcaseDetail.title} />
									</FormField>

									<FormField title='Организация-заказчик'>
										<FormInputStub value={showcaseDetail.company} />
									</FormField>

									<FormField title='Уровень проекта'>
										<FormInputStub value={showcaseDetail.projectLevel} />
									</FormField>

									<FormField title='Команд зарегистрировано'>
										<FormInputStub
											value={`${showcaseDetail.enrolledTeamsCount} / ${showcaseDetail.maxTeams}`}
										/>
									</FormField>

									<FormField title='Рекомендуемый состав команды'>
										<FormInputStub
											value={`${showcaseDetail.minTeamMembers}–${showcaseDetail.maxTeamMembers} участников`}
										/>
									</FormField>
								</>
							)}

							{activeTab === 'description' && (
								<>
									<FormField title='Цель'>
										<FormInputStub value={showcaseDetail.goal} />
									</FormField>

									<FormField title='Барьер'>
										<FormInputStub value={showcaseDetail.barrier} />
									</FormField>

									<FormField title='Существующие решения'>
										<FormInputStub value={showcaseDetail.existingSolutions} />
									</FormField>

									<FormField title='Контекст проекта'>
										<FormInputStub value={showcaseDetail.context} />
									</FormField>
								</>
							)}
						</>
					)}
				</>
			)}
		</Modal>
	);
};
