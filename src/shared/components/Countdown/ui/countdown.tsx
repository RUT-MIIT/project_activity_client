import type { FC } from 'react';
import type { ICountdownProps } from '../types/types';

import { useEffect, useMemo, useState } from 'react';

import styles from '../styles/countdown.module.scss';

const getSecondsUntilDate = (date: Date) => {
	return Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
};

const getTimeLeft = (date: Date) => {
	const totalSeconds = getSecondsUntilDate(date);

	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		days,
		hours,
		minutes,
		seconds,
		totalSeconds,
	};
};

export const Countdown: FC<ICountdownProps> = ({
	targetDate,
	label = 'До начала',
}) => {
	const date = useMemo(() => {
		return targetDate instanceof Date ? targetDate : new Date(targetDate);
	}, [targetDate]);

	const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(date));

	useEffect(() => {
		const update = () => {
			setTimeLeft(getTimeLeft(date));
		};

		update();

		const interval = window.setInterval(update, 1000);

		return () => window.clearInterval(interval);
	}, [date]);

	if (timeLeft.totalSeconds <= 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			<div className={styles.label}>{label}</div>

			<div className={styles.values}>
				<div className={styles.item}>
					<strong>{timeLeft.days}</strong>
					<span>дн.</span>
				</div>

				<div className={styles.item}>
					<strong>{String(timeLeft.hours).padStart(2, '0')}</strong>
					<span>ч.</span>
				</div>

				<div className={styles.item}>
					<strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>
					<span>мин.</span>
				</div>

				<div className={styles.item}>
					<strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>
					<span>сек.</span>
				</div>
			</div>
		</div>
	);
};
