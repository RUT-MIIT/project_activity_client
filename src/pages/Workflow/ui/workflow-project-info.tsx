import type { FC } from 'react';

import { Card } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import {
	FormField,
	FormInputStub,
} from '../../../shared/components/Form/components';

import { formFieldMainData } from '../../../widgets/CreateApplication/lib/helpers';
import { mockProject, mockProjectTemplates } from '../lib/mock';

import styles from '../styles/workflow.module.scss';

const fieldTitle = (title: string) => title.replace('*', '').trim();

export const WorkflowProjectInfo: FC = () => {
	return (
		<div className={styles.page}>
			<div className={styles.info}>
				<Card
					title={mockProject.title}
					subtitle='Описание проекта и исходные данные заявки'>
					<FormField title={fieldTitle(formFieldMainData.company.title)}>
						<FormInputStub value={mockProject.company} />
					</FormField>
					<FormField title={fieldTitle(formFieldMainData.project_level.title)}>
						<FormInputStub value={mockProject.project_level} />
					</FormField>
					<FormField title={fieldTitle(formFieldMainData.problem_holder.title)}>
						<FormInputStub value={mockProject.problem_holder} />
					</FormField>
					<FormField title={fieldTitle(formFieldMainData.goal.title)}>
						<FormInputStub value={mockProject.goal} />
					</FormField>
					<FormField title={fieldTitle(formFieldMainData.barrier.title)}>
						<FormInputStub value={mockProject.barrier} />
					</FormField>
					<FormField
						title={fieldTitle(formFieldMainData.existing_solutions.title)}>
						<FormInputStub value={mockProject.existing_solutions} />
					</FormField>
					<FormField title={fieldTitle(formFieldMainData.context.title)}>
						<FormInputStub value={mockProject.context} />
					</FormField>
					<FormField title={formFieldMainData.stakeholders.title}>
						<FormInputStub value={mockProject.stakeholders} />
					</FormField>
					<FormField title={formFieldMainData.recommended_tools.title}>
						<FormInputStub value={mockProject.recommended_tools} />
					</FormField>
					<FormField title={formFieldMainData.experts.title}>
						<FormInputStub value={mockProject.experts} />
					</FormField>
				</Card>

				<Card
					title='Материалы для работы'
					subtitle='Шаблоны и файлы, которые доступны команде с начала проекта'>
					<ul className={styles.templates}>
						{mockProjectTemplates.map((file) => {
							const extension =
								file.name.split('.').pop()?.toUpperCase() || 'FILE';

							return (
								<li className={styles.template} key={file.id}>
									<span className={styles.template__icon}>{extension}</span>
									<div className={styles.template__main}>
										<p className={styles.template__name}>{file.name}</p>
										<p className={styles.template__meta}>
											{file.kind} · {file.size}
										</p>
									</div>
									<Button text='Скачать' color='blue' isBlock />
								</li>
							);
						})}
					</ul>
				</Card>
			</div>
		</div>
	);
};
