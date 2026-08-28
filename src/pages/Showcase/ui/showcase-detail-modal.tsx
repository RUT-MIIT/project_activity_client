import type { FC } from 'react';

import type { IProjectDetailModal } from '../../Project/components/ProjectDetailModal/types';

import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import {
	FormField,
	FormInputStub,
} from '../../../shared/components/Form/components';

import { getStudentShowcaseDetailAction } from '../../../store/student/actions';

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

export const ShowCaseDetailModal: FC<IProjectDetailModal> = ({
	id,
	isOpen,
	onClose,
}) => {
	const dispatch = useDispatch();

	const { projectDetail, isLoadingShowcaseDetail } = useSelector(
		(state) => state.student
	);

	const [activeTab, setActiveTab] = useState('main');

	useEffect(() => {
		if (isOpen && id) {
			setActiveTab('main');

			dispatch(getStudentShowcaseDetailAction(id));
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
					{projectDetail && (
						<>
							<Tabs
								tabs={tabs}
								activeTab={activeTab}
								onTabChange={setActiveTab}
							/>

							{activeTab === 'main' && (
								<>
									<FormField title='Наименование проекта'>
										<FormInputStub value={projectDetail.title} />
									</FormField>

									<FormField title='Организация-заказчик'>
										<FormInputStub value={projectDetail.company} />
									</FormField>

									<FormField title='Уровень проекта'>
										<FormInputStub value={projectDetail.projectLevel} />
									</FormField>

									<FormField title='Команд зарегистрировано'>
										<FormInputStub
											value={`${projectDetail.enrolledTeamsCount} / ${projectDetail.maxTeams}`}
										/>
									</FormField>

									<FormField title='Рекомендуемый состав команды'>
										<FormInputStub
											value={`${projectDetail.minTeamMembers}–${projectDetail.maxTeamMembers} участников`}
										/>
									</FormField>
								</>
							)}

							{activeTab === 'description' && (
								<>
									<FormField title='Цель'>
										<FormInputStub value={projectDetail.goal} />
									</FormField>

									<FormField title='Барьер'>
										<FormInputStub value={projectDetail.barrier} />
									</FormField>

									<FormField title='Существующие решения'>
										<FormInputStub value={projectDetail.existingSolutions} />
									</FormField>

									<FormField title='Контекст проекта'>
										<FormInputStub value={projectDetail.context} />
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
