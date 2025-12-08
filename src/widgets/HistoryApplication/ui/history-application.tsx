import type { FC } from 'react';
import type { ILog } from '../../../store/history/types';

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../../store/store';

import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';

import { convertDate } from '../../../shared/lib/date';
import {
	getStatusColor,
	getStatusText,
	getStatusComment,
} from '../lib/helpers';

import styles from '../styles/history-application.module.scss';

export const HistoryApplication: FC = () => {
	const navigate = useNavigate();

	const { logs } = useSelector((state) => state.history);

	const reversedLogs = useMemo(() => [...logs].reverse(), [logs]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Button
					text='Вернуться'
					withIcon={{ type: 'back', color: 'black' }}
					onClick={() => navigate(-1)}
				/>
			</div>
			<div className={styles.main}>
				<ul className={styles.list}>
					{reversedLogs.map((elem: ILog) => (
						<li
							className={`${styles.item} ${
								styles[`item_${getStatusColor(elem.to_status)}`]
							}`}
							key={elem.id}>
							<div className={styles.item__header}>
								<Badge
									text={getStatusText(elem.to_status)}
									color={getStatusColor(elem.to_status)}
								/>
								<span>{}</span>
								<span className={styles.item__time}>
									{convertDate(elem.changed_at)}
								</span>
							</div>
							<p className={styles.item__name}>Инициатор: {elem.actor}</p>
							<p className={styles.item__caption}>
								{getStatusComment(elem.to_status)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
