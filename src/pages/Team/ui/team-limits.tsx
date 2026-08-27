import type { FC } from 'react';

import { Card } from '../../../shared/components/Card/ui';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import styles from '../styles/team-limits.module.scss';

interface ITeamLimitsProps {
	totalSlots: number;
	usedSlots: number;
}

export const TeamLimits: FC<ITeamLimitsProps> = ({ totalSlots, usedSlots }) => {
	const remainingSlots = Math.max(totalSlots - usedSlots, 0);
	const isLimitReached = remainingSlots === 0;

	return (
		<Card
			title='Ограничения'
			subtitle='Количество команд на проектном треке ограничено'>
			<div className={styles.container}>
				<div className={styles.notices}>
					<Notice
						type='info'
						title='Формируйте команду заранее'
						text='На трек выделено ограниченное количество слотов. Чем раньше вы сформируете состав своей команды, тем лучше. Обращаем ваше внимание что количество свободных слотов выделено на трек, а не на вашу учебную группу.'
					/>

					<Notice
						type='warning'
						title='Когда команда занимает слот'
						text='Команда считается сформированной и занимает слот, когда в ней набирается минимальное число участников и капитан подтверждает состав. После подтверждения состав команды может изменить только наставник.'
					/>

					{isLimitReached && (
						<Notice
							type='error'
							title='Свободных слотов не осталось'
							text='Сформировать новую команду сейчас нельзя. Вы можете вступить в уже созданную команду или обратиться к наставнику за помощью.'
						/>
					)}
				</div>

				<div className={styles.slots}>
					<div className={styles.slots__count}>
						<span className={styles.slots__used}>{usedSlots}</span>

						<span className={styles.slots__separator}>/</span>

						<span className={styles.slots__total}>{totalSlots}</span>
					</div>

					<p className={styles.slots__title}>слотов занято</p>
				</div>
			</div>
		</Card>
	);
};
