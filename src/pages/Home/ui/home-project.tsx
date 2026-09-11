import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { Button } from '../../../shared/components/Button/ui/button';
import { Countdown } from '../../../shared/components/Countdown/ui/countdown';

import { getMyGroupAction } from '../../../store/student/actions';

import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/home-project.module.scss';

export const HomeProject: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { group } = useSelector((state) => state.student);

	const registration = group?.registration;
	const myTeam = group?.my_team ?? null;

	if (!registration) {
		return null;
	}

	const registrationDate = registration.opens_at
		? new Date(registration.opens_at)
		: null;

	const isClosedByDecision = registration.closed_by_decision;

	const isRegistrationScheduled =
		registrationDate !== null && registrationDate.getTime() > Date.now();

	const isRegistrationOpen =
		registration.is_open && !isRegistrationScheduled && !isClosedByDecision;

	const hasSelectedProject =
		myTeam?.has_project === true && myTeam.project !== null;

	const handleRegistrationStart = () => {
		window.setTimeout(() => {
			dispatch(getMyGroupAction());
		}, 2000);
	};

	return (
		<Card
			title='Текущий проект'
			subtitle='Проект, над которым работает ваша команда'
			withHeightStretch>
			{hasSelectedProject ? (
				<Notice
					type='success'
					title='Проект выбран'
					text={`Ваша команда выбрала проект «${myTeam?.project?.title}».`}
				/>
			) : isClosedByDecision ? (
				<Notice
					type='warning'
					title='Регистрация закрыта'
					text='Регистрация на проекты закрыта решением организаторов. За дополнительной информацией обратитесь к вашему наставнику.'
				/>
			) : isRegistrationScheduled && registrationDate ? (
				<div className={styles.row}>
					<Notice
						type='warning'
						title='Регистрация на проекты ещё не открыта'
						text='Регистрация на проекты откроется в указанное время. Капитаны команд с подтвержденными составами смогут выбрать проект для своей команды.'
					/>

					<Countdown
						targetDate={registrationDate}
						label='До начала регистрации'
						onComplete={handleRegistrationStart}
					/>
				</div>
			) : isRegistrationOpen ? (
				<Notice
					type='info'
					title='Регистрация на проекты открыта'
					text='Капитаны команд с подтвержденными составами могут выбрать проект для своей команды.'
				/>
			) : (
				<Notice
					type='warning'
					title='Регистрация на проекты ещё не открыта'
					text='Регистрация на проекты пока недоступна.'
				/>
			)}

			{isRegistrationOpen && !hasSelectedProject && (
				<CardControl>
					<Button
						text='К витрине проектов'
						onClick={() => navigate(`/${EMAINROUTES.SHOWCASE}`)}
						color='blue'
						withIcon={{
							type: 'next',
							color: 'white',
							position: 'right',
						}}
					/>
				</CardControl>
			)}
		</Card>
	);
};
