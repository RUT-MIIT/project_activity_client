import type { FC } from 'react';
import type { IOverviewMentor } from '../types/overview';

import { Field } from '../../../shared/components/Field/ui/field';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import styles from '../styles/workflow.module.scss';

interface IWorkflowMentorModalProps {
	mentor: IOverviewMentor;
}

export const WorkflowMentorModal: FC<IWorkflowMentorModalProps> = ({
	mentor,
}) => {
	const fullName = [mentor.lastName, mentor.firstName, mentor.middleName]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={styles.member}>
			<div className={styles.member__head}>
				<TeamAvatar
					firstName={mentor.firstName}
					lastName={mentor.lastName}
					memberRole='mentor'
				/>
				<div>
					<p className={styles.member__name}>{fullName}</p>
					<p className={styles.member__role}>
						{mentor.position || 'Наставник команды'}
					</p>
				</div>
			</div>

			{mentor.email && <Field title='Почта' text={mentor.email} />}
			{mentor.phone && <Field title='Телефон' text={mentor.phone} />}
			{mentor.academicDegree && (
				<Field title='Учёная степень' text={mentor.academicDegree} />
			)}
			{mentor.academicTitle && (
				<Field title='Учёное звание' text={mentor.academicTitle} />
			)}
			{!mentor.email && !mentor.phone && (
				<p className={styles.member__role}>
					Контактные данные пока не указаны.
				</p>
			)}
		</div>
	);
};
