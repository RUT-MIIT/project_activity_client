import type { FC } from 'react';
import type { Editor, Store } from '@quickdrawjs/react';

import { Quickdraw } from '@quickdrawjs/react';
import { useSelector } from '../../../store/store';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import styles from '../styles/workflow.module.scss';

interface IWorkflowBoardProps {
	store: Store;
	onChange: (diff: unknown, source: unknown, editor: Editor) => void;
}

export const WorkflowBoard: FC<IWorkflowBoardProps> = ({ store, onChange }) => {
	const { group } = useSelector((state) => state.student);
	const teamName = group?.my_team?.name;

	return (
		<div className={styles.board__page}>
			<div className={styles.board__heading}>
				<h2 className={styles.board__title}>Рабочая доска</h2>
				<p className={styles.board__subtitle}>
					Здесь ваша команда может оставлять заметки по проекту и планировать
					работу
				</p>
			</div>

			{!teamName && (
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
					onChange={onChange}
				/>
			</div>
		</div>
	);
};
