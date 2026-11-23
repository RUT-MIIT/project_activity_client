import type { FC } from 'react';
import type { IWorkflowEvent } from '../types/events';

import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Button } from '../../../shared/components/Button/ui/button';
import { Field } from '../../../shared/components/Field/ui/field';
import { Link } from '../../../shared/components/Link/ui/link';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import {
	formatEventFormat,
	formatEventSchedule,
	getEventStatus,
	getEventTypeColor,
	getEventTypeText,
} from '../lib/events';

import { WorkflowEventStatus } from './workflow-event-status';

import styles from '../styles/events.module.scss';

interface IWorkflowEventDetailProps {
	event: IWorkflowEvent;
	onOpenModule?: (path: string) => void;
}

export const WorkflowEventDetail: FC<IWorkflowEventDetailProps> = ({
	event,
	onOpenModule,
}) => {
	const status = getEventStatus(event);
	const canOpenAssessment =
		event.type === 'assessment' &&
		status === 'active' &&
		Boolean(event.relatedModulePath);

	return (
		<div className={styles.detail}>
			<div className={styles.detail__badges}>
				<Badge
					text={getEventTypeText(event.type)}
					color={getEventTypeColor(event.type)}
				/>
				<WorkflowEventStatus status={status} />
			</div>

			<Field title='Дата и время' text={formatEventSchedule(event)} />

			{event.format && (
				<Field title='Формат проведения' text={formatEventFormat(event.format)} />
			)}

			{event.format === 'offline' && event.place && (
				<Field title='Место проведения' text={event.place} />
			)}

			{event.format === 'online' && event.meetingUrl && (
				<div className={styles.detail__link}>
					<p className={styles.detail__label}>Ссылка для подключения</p>
					<Link text={event.meetingUrl} path={event.meetingUrl} />
				</div>
			)}

			{event.assessmentKind && (
				<Field title='Вид оценивания' text={event.assessmentKind} />
			)}

			{event.description && (
				<Field title='Описание' text={event.description} />
			)}

			{event.resultRequirements && (
				<Field title='Требования к результату' text={event.resultRequirements} />
			)}

			{event.criteria && (
				<Field title='Критерии' text={event.criteria} />
			)}

			{event.preparation && (
				<Field
					title='Требования к подготовке'
					text={event.preparation}
				/>
			)}

			{event.extra && (
				<Field title='Дополнительная информация' text={event.extra} />
			)}

			{event.materials && event.materials.length > 0 && (
				<Field
					title='Материалы'
					text={event.materials.map((item) => item.name).join(', ')}
				/>
			)}

			{event.type === 'assessment' && event.relatedModulePath && (
				canOpenAssessment ? (
					<Button
						text={event.relatedModuleLabel || 'Перейти к оцениванию'}
						color='blue'
						onClick={() => onOpenModule?.(event.relatedModulePath || '')}
					/>
				) : (
					<Notice
						type='info'
						title='Форма оценивания недоступна'
						text='Заполнить форму можно только в период проведения оценивания.'
					/>
				)
			)}
		</div>
	);
};
