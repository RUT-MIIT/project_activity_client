import type { FC } from 'react';

import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from '../../../store/store';

import { Section } from '../../../shared/components/Section';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';

import { getMyGroupAction } from '../../../store/student/actions';
import { workflowTabs } from '../lib/helpers';

import { WorkflowOverview } from './workflow-overview';
import { WorkflowProjectInfo } from './workflow-project-info';
import { WorkflowTasks } from './workflow-tasks';
import { WorkflowBoard } from './workflow-board';
import { WorkflowEvents } from './workflow-events';
import { WorkflowMaterials } from './workflow-materials';

import styles from '../styles/workflow.module.scss';

export const Workflow: FC = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getMyGroupAction());
	}, [dispatch]);

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Работа с проектом' }}
			sectionDescription='Пространство команды для работы над выбранным проектом'
			withHeaderMargin>
			<div className={styles.header}>
				<Tabs tabs={workflowTabs} />
			</div>

			<div className={styles.content}>
				<Routes>
					<Route path='overview' element={<WorkflowOverview />} />
					<Route path='info' element={<WorkflowProjectInfo />} />
					<Route path='tasks' element={<WorkflowTasks />} />
					<Route path='board' element={<WorkflowBoard />} />
					<Route path='events' element={<WorkflowEvents />} />
					<Route path='materials' element={<WorkflowMaterials />} />
					<Route path='' element={<Navigate to='overview' replace />} />
					<Route path='*' element={<Navigate to='overview' replace />} />
				</Routes>
			</div>
		</Section>
	);
};
