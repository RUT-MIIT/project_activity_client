import type { FC } from 'react';
import type { Editor, Snapshot } from '@quickdrawjs/react';

import { useCallback, useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useQuickdrawStore } from '@quickdrawjs/react';
import { useDispatch, useSelector } from '../../../store/store';
import { useBoardSync } from '../lib/use-board-sync';

import { Section } from '../../../shared/components/Section';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';

import { getMyGroupAction } from '../../../store/student/actions';
import { putTeamBoard } from '../../../shared/api/board';

import { workflowTabs } from '../lib/helpers';

import { WorkflowBoard } from './workflow-board';
import { WorkflowPlaceholder } from './workflow-placeholder';

import styles from '../styles/workflow.module.scss';
import '@quickdrawjs/core/quickdraw.css';

const SAVE_DELAY_MS = 1000;

export const Workflow: FC = () => {
	const dispatch = useDispatch();
	const { group } = useSelector((state) => state.student);
	const store = useQuickdrawStore();
	const saveTimerRef = useRef<number | null>(null);
	const latestSnapshotRef = useRef<Snapshot | null>(null);
	const pendingSnapshotRef = useRef<Snapshot | null>(null);
	const isSavingRef = useRef(false);
	const canSaveRef = useRef(false);

	const teamId = group?.my_team?.id ?? null;
	const { isSynced } = useBoardSync(store, teamId);

	canSaveRef.current = teamId !== null && isSynced;

	useEffect(() => {
		dispatch(getMyGroupAction());
	}, [dispatch]);

	const saveSnapshot = useCallback(async (snapshot: Snapshot) => {
		if (!canSaveRef.current) {
			return;
		}

		if (isSavingRef.current) {
			pendingSnapshotRef.current = snapshot;
			return;
		}

		isSavingRef.current = true;
		pendingSnapshotRef.current = null;

		try {
			await putTeamBoard(snapshot);
		} catch {
			pendingSnapshotRef.current = snapshot;
		} finally {
			isSavingRef.current = false;

			if (pendingSnapshotRef.current && canSaveRef.current) {
				const pendingSnapshot = pendingSnapshotRef.current;
				pendingSnapshotRef.current = null;
				void saveSnapshot(pendingSnapshot);
			}
		}
	}, []);

	const scheduleSave = useCallback(
		(snapshot: Snapshot) => {
			latestSnapshotRef.current = snapshot;

			if (!canSaveRef.current) {
				return;
			}

			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
			}

			saveTimerRef.current = window.setTimeout(() => {
				saveTimerRef.current = null;

				if (latestSnapshotRef.current) {
					void saveSnapshot(latestSnapshotRef.current);
				}
			}, SAVE_DELAY_MS);
		},
		[saveSnapshot]
	);

	const handleBoardChange = useCallback(
		(_diff: unknown, _source: unknown, editor: Editor) => {
			scheduleSave(editor.store.getSnapshot());
		},
		[scheduleSave]
	);

	useEffect(() => {
		return () => {
			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
			}

			if (latestSnapshotRef.current && canSaveRef.current) {
				void saveSnapshot(latestSnapshotRef.current);
			}
		};
	}, [saveSnapshot]);

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Работа с проектом' }}
			sectionDescription='Этапы и материалы работы над выбранным проектом'
			withHeaderMargin>
			<div className={styles.header}>
				<Tabs tabs={workflowTabs} />
			</div>

			<div className={styles.content}>
				<Routes>
					<Route
						path='board'
						element={
							<WorkflowBoard store={store} onChange={handleBoardChange} />
						}
					/>
					<Route
						path='stages'
						element={
							<WorkflowPlaceholder
								title='Этапы проекта'
								text='Раздел появится позже. Здесь команда будет видеть этапы работы над проектом.'
							/>
						}
					/>
					<Route
						path='materials'
						element={
							<WorkflowPlaceholder
								title='Материалы проекта'
								text='Раздел появится позже. Здесь команда будет хранить материалы и файлы проекта.'
							/>
						}
					/>
					<Route path='' element={<Navigate to='board' replace />} />
					<Route path='*' element={<Navigate to='board' replace />} />
				</Routes>
			</div>
		</Section>
	);
};
