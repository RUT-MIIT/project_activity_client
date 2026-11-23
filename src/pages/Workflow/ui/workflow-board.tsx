import type { FC } from 'react';

import { useCallback, useEffect, useRef } from 'react';
import { Quickdraw, useQuickdrawStore } from '@quickdrawjs/react';
import '@quickdrawjs/core/quickdraw.css';

import { useSelector } from '../../../store/store';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { putTeamBoard } from '../../../shared/api/board';
import { useBoardSync } from '../lib/use-board-sync';

import styles from '../styles/workflow.module.scss';

const SAVE_DELAY_MS = 1000;

export const WorkflowBoard: FC = () => {
	const { group } = useSelector((state) => state.student);
	const userId = useSelector((state) => state.user.user?.id);
	const store = useQuickdrawStore();
	const saveTimerRef = useRef<number | null>(null);
	const hasPendingChangesRef = useRef(false);
	const isSavingRef = useRef(false);
	const canSaveRef = useRef(false);

	const team = group?.my_team ?? null;
	const teamId = team?.id ?? null;
	const { isSynced, serverPersists, saveFailed } = useBoardSync(
		store,
		teamId,
		userId
	);

	canSaveRef.current = teamId !== null && isSynced && !serverPersists;

	const savePendingChanges = useCallback(async () => {
		if (isSavingRef.current) {
			return;
		}

		isSavingRef.current = true;

		try {
			while (
				canSaveRef.current &&
				hasPendingChangesRef.current &&
				saveTimerRef.current === null
			) {
				hasPendingChangesRef.current = false;

				try {
					await putTeamBoard(store.getSnapshot());
				} catch {
					if (!hasPendingChangesRef.current) {
						hasPendingChangesRef.current = true;
						break;
					}
				}
			}
		} finally {
			isSavingRef.current = false;
		}
	}, [store]);

	const handleBoardChange = useCallback(() => {
		hasPendingChangesRef.current = true;

		if (!canSaveRef.current) {
			return;
		}

		if (saveTimerRef.current !== null) {
			window.clearTimeout(saveTimerRef.current);
		}

		saveTimerRef.current = window.setTimeout(() => {
			saveTimerRef.current = null;
			void savePendingChanges();
		}, SAVE_DELAY_MS);
	}, [savePendingChanges]);

	useEffect(() => {
		return () => {
			if (saveTimerRef.current !== null) {
				window.clearTimeout(saveTimerRef.current);
				saveTimerRef.current = null;
			}

			void savePendingChanges();
		};
	}, [savePendingChanges]);

	return (
		<div className={styles.board__page}>
			<div className={styles.board__shell}>
				<div className={styles.board__heading}>
					<h2 className={styles.board__title}>Рабочая доска</h2>
					<p className={styles.board__subtitle}>
						Здесь ваша команда может оставлять заметки по проекту и планировать
						работу
					</p>
				</div>

				{saveFailed && (
					<Notice
						type='info'
						title='Не удалось сохранить правки'
						text='Попробуйте внести небольшое изменение, чтобы повторить сохранение.'
					/>
				)}

				{!team && (
					<Notice
						type='info'
						title='Общая доска пока локальная'
						text='Сначала сформируйте команду. Пока доска доступна только в этой вкладке и не сохраняется.'
					/>
				)}

				<div className={styles.board}>
					<Quickdraw
						store={store}
						theme='light'
						grid='lines'
						onChange={handleBoardChange}
					/>
				</div>
			</div>
		</div>
	);
};
