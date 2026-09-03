import type { FC } from 'react';

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Notice } from '../../../shared/components/Notice/ui/notice';
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

const hasValue = (value: string | number | null | undefined) => {
	return value !== null && value !== undefined && String(value).trim() !== '';
};

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
									{showcaseDetail.is_competitive_selection && (
										<Notice
											type='warning'
											title='Конкурсный отбор'
											text='Заказчик будет проводить отбор команд. Команды, которые не пройдут отбор, смогут выбрать другой доступный проект.'
											style={{ margin: ' 0 0 12px 0' }}
										/>
									)}
									{showcaseDetail.is_continuing && (
										<Notice
											type='warning'
											title='Пролонгация проекта'
											text='С проектом продолжат работать предыдущие команды.'
											style={{ margin: '0 0 12px 0' }}
										/>
									)}
									{hasValue(showcaseDetail.title) && (
										<FormField title='Наименование проекта'>
											<FormInputStub value={showcaseDetail.title} />
										</FormField>
									)}

									{hasValue(showcaseDetail.company) && (
										<FormField title='Организация-заказчик'>
											<FormInputStub value={showcaseDetail.company} />
										</FormField>
									)}

									{hasValue(showcaseDetail.recommended_teams_count) && (
										<FormField title='Рекомендованное количество команд'>
											<FormInputStub
												value={showcaseDetail.recommended_teams_count.toString()}
											/>
										</FormField>
									)}

									{hasValue(showcaseDetail.min_team_members) &&
										hasValue(showcaseDetail.max_team_members) && (
											<FormField title='Рекомендуемый состав команды'>
												<FormInputStub
													value={`${showcaseDetail.min_team_members}–${showcaseDetail.max_team_members} участников`}
												/>
											</FormField>
										)}
								</>
							)}

							{activeTab === 'description' && (
								<>
									{hasValue(showcaseDetail.stakeholders) && (
										<FormField title='Носитель проблемы'>
											<FormInputStub value={showcaseDetail.stakeholders} />
										</FormField>
									)}

									{hasValue(showcaseDetail.goal) && (
										<FormField title='Цель'>
											<FormInputStub value={showcaseDetail.goal} />
										</FormField>
									)}

									{hasValue(showcaseDetail.barrier) && (
										<FormField title='Барьер'>
											<FormInputStub value={showcaseDetail.barrier} />
										</FormField>
									)}

									{hasValue(showcaseDetail.existing_solutions) && (
										<FormField title='Существующие решения'>
											<FormInputStub
												value={showcaseDetail.existing_solutions}
											/>
										</FormField>
									)}

									{hasValue(showcaseDetail.context) && (
										<FormField title='Контекст проекта'>
											<FormInputStub value={showcaseDetail.context} />
										</FormField>
									)}
								</>
							)}
						</>
					)}
				</>
			)}
		</Modal>
	);
};
