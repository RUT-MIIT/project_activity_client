import type { FC } from 'react';
import type { IProjectDetailModal } from './types';

import { useDispatch, useSelector } from '../../../../store/store';
import { useState, useEffect } from 'react';

import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../../shared/components/Preloader/ui/preloader';
import { Tabs } from '../../../../shared/components/Tabs/ui/tabs';
import {
	FormField,
	FormInputStub,
} from '../../../../shared/components/Form/components';

import { getCoordinationAppDetailAction } from '../../../../store/coordination/actions';

const tabs = [
	{
		path: 'main',
		label: 'Главное',
	},
	{
		path: 'problem',
		label: 'Проблема',
	},
	{
		path: 'context',
		label: 'Контекст',
	},
	{
		path: 'additional',
		label: 'Дополнительно',
	},
];

export const ProjectDetailModal: FC<IProjectDetailModal> = ({
	id,
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();
	const { applicationDetail, isLoadingDetail } = useSelector(
		(state) => state.coordination
	);

	const [activeTab, setActiveTab] = useState('main');

	useEffect(() => {
		if (id) {
			dispatch(getCoordinationAppDetailAction(id.toString()));
		}
	}, [dispatch, id]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Информация о проекте'
			description='Информация доступна только для просмотра'>
			{isLoadingDetail ? (
				<Preloader />
			) : (
				<>
					<Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
					{applicationDetail && (
						<>
							{activeTab === 'main' && (
								<>
									<FormField title='Уровень проекта'>
										<FormInputStub value={applicationDetail.project_level} />
									</FormField>
									<FormField title='Организация заказчик'>
										<FormInputStub value={applicationDetail.company} />
									</FormField>
									<FormField title='Номер проектной заявки'>
										<FormInputStub value={applicationDetail.print_number} />
									</FormField>
									<FormField title='Автор заявки'>
										<FormInputStub
											value={`${applicationDetail.author_lastname} ${applicationDetail.author_firstname} ${applicationDetail.author_middlename}`}
										/>
									</FormField>
									<FormField title='Электронная почта'>
										<FormInputStub value={applicationDetail.author_email} />
									</FormField>
								</>
							)}
							{activeTab === 'problem' && (
								<>
									<FormField title='Носитель проблемы'>
										<FormInputStub value={applicationDetail.problem_holder} />
									</FormField>
									<FormField title='Цель'>
										<FormInputStub value={applicationDetail.goal} />
									</FormField>
									<FormField title='Барьер'>
										<FormInputStub value={applicationDetail.barrier} />
									</FormField>
									<FormField title='Существующие решения'>
										<FormInputStub
											value={applicationDetail.existing_solutions}
										/>
									</FormField>
								</>
							)}
							{activeTab === 'context' && (
								<>
									<FormField title='Контекст проекта'>
										<FormInputStub value={applicationDetail.context} />
									</FormField>
									<FormField title='Другие заинтересованные стороны'>
										<FormInputStub value={applicationDetail.stakeholders} />
									</FormField>
									<FormField title='Рекомендуемые инструменты / методы'>
										<FormInputStub
											value={applicationDetail.recommended_tools}
										/>
									</FormField>
									<FormField title='Эксперты'>
										<FormInputStub value={applicationDetail.experts} />
									</FormField>
								</>
							)}
							{activeTab === 'additional' && (
								<>
									<FormField title='Наименование проекта'>
										<FormInputStub value={applicationDetail.title} />
									</FormField>
									<FormField title='Комментарий для составителя трека'>
										<FormInputStub
											value={applicationDetail.track_composer_comment}
										/>
									</FormField>
									<FormField title='Рекомендуемое число команд на проект'>
										<FormInputStub
											value={applicationDetail.recommended_teams_count}
										/>
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
