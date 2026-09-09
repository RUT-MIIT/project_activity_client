import type { FC } from 'react';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import { Card, CardControl } from '../../../../../shared/components/Card/ui';
import { Button } from '../../../../../shared/components/Button/ui/button';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Countdown } from '../../../../../shared/components/Countdown/ui/countdown';
import { Form } from '../../../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
} from '../../../../../shared/components/Form/components';

import {
	getRegistrationSettingsAction,
	updateRegistrationSettingsAction,
} from '../../../../../store/controlGroup/actions';

import styles from '../styles/control-group-showcase.module.scss';

const REGISTRATION_HOURS = [11, 12, 13, 14, 15, 16, 17];

const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
};

const formatDateTitle = (date: Date) => {
	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(date);
};

const formatTime = (date: Date) => {
	return new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
};

export const ControlGroupShowcase: FC = () => {
	const dispatch = useDispatch();

	const {
		registrationSettings,
		isLoadingRegistrationSettings,
		isUpdatingRegistrationSettings,
	} = useSelector((state) => state.controlGroup);

	const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
	const [selectedHour, setSelectedHour] = useState<number | null>(null);

	useEffect(() => {
		dispatch(getRegistrationSettingsAction());
	}, [dispatch]);

	useEffect(() => {
		if (!registrationSettings?.current.registrationOpensAt) {
			return;
		}

		const date = new Date(registrationSettings.current.registrationOpensAt);

		setSelectedDate(formatDate(date));
		setSelectedHour(date.getHours());
	}, [registrationSettings]);

	const otherInstitutes = registrationSettings?.otherInstitutes || [];

	const occupiedSlots = useMemo(() => {
		const slots = new Set<string>();

		registrationSettings?.otherInstitutes.forEach((institute) => {
			if (!institute.registrationOpensAt) {
				return;
			}

			const date = new Date(institute.registrationOpensAt);

			const dateKey = formatDate(date);
			const hour = date.getHours();

			slots.add(`${dateKey}-${hour}`);
		});

		return slots;
	}, [registrationSettings]);

	const currentRegistrationDate = useMemo(() => {
		if (!registrationSettings?.current.registrationOpensAt) {
			return null;
		}

		return new Date(registrationSettings.current.registrationOpensAt);
	}, [registrationSettings]);

	const isRegistrationOpen = registrationSettings?.current.isOpen === true;

	const isClosedByDecision =
		registrationSettings?.current.closedByDecision === true;

	const isRegistrationScheduled =
		currentRegistrationDate !== null &&
		currentRegistrationDate.getTime() > Date.now();

	const selectedDateObject = useMemo(() => {
		const [year, month, day] = selectedDate.split('-').map(Number);

		return new Date(year, month - 1, day);
	}, [selectedDate]);

	const handleSelectHour = (hour: number) => {
		const slotKey = `${selectedDate}-${hour}`;

		if (occupiedSlots.has(slotKey)) {
			return;
		}

		setSelectedHour(hour);
	};

	const handleSave = () => {
		if (selectedHour === null) {
			return;
		}

		const [year, month, day] = selectedDate.split('-').map(Number);

		const date = new Date(year, month - 1, day, selectedHour, 0, 0);

		dispatch(
			updateRegistrationSettingsAction({
				registrationOpensAt: date.toISOString(),
			})
		);

		setSelectedHour(null);
	};

	const handleClosedByDecision = () => {
		dispatch(
			updateRegistrationSettingsAction({
				closedByDecision: !isClosedByDecision,
			})
		);
	};

	if (isLoadingRegistrationSettings || !registrationSettings) {
		return <Preloader />;
	}

	return (
		<div className={styles.page}>
			<div className={styles.grid}>
				<Card>
					<div className={styles.status}>
						<div className={styles.statusHeader}>
							<div>
								<div className={styles.label}>Текущее состояние</div>

								<div className={styles.statusTitle}>
									{isRegistrationOpen
										? 'Регистрация открыта'
										: 'Регистрация закрыта'}
								</div>
							</div>

							<div
								className={`${styles.statusIndicator} ${
									isRegistrationOpen ? styles.statusIndicator_open : ''
								}`}
							/>
						</div>

						{currentRegistrationDate && (
							<div className={styles.currentDate}>
								<div className={styles.label}>Дата открытия</div>

								<div className={styles.value}>
									{formatDateTitle(currentRegistrationDate)}
								</div>

								<div className={styles.time}>
									{formatTime(currentRegistrationDate)}
								</div>
							</div>
						)}

						{isRegistrationScheduled && currentRegistrationDate && (
							<Countdown
								targetDate={currentRegistrationDate}
								label='До начала регистрации'
							/>
						)}

						{!currentRegistrationDate && (
							<div className={styles.emptyState}>
								Время открытия регистрации ещё не установлено.
							</div>
						)}

						<CardControl>
							<div className={styles.decision}>
								<div>
									<div className={styles.label}>Закрытие решением</div>

									<div className={styles.decisionText}>
										{isClosedByDecision
											? 'Регистрация принудительно закрыта'
											: 'Регистрация не закрыта решением'}
									</div>
								</div>
							</div>

							<Button
								text={isClosedByDecision ? 'Открыть' : 'Закрыть'}
								onClick={handleClosedByDecision}
								isBlock={isUpdatingRegistrationSettings}
							/>
						</CardControl>
					</div>
				</Card>

				<Card>
					<div className={styles.calendar}>
						<div className={styles.sectionHeader}>
							<div>
								<div className={styles.sectionTitle}>Выбор времени</div>

								<div className={styles.sectionDescription}>
									Выберите свободный слот для открытия регистрации
								</div>
							</div>
						</div>

						<Form
							name='registration-settings'
							autoComplete='off'
							onSubmit={(event) => {
								event.preventDefault();
								handleSave();
							}}>
							<FormField title='Дата регистрации'>
								<FormInput
									type='date'
									name='registrationDate'
									value={selectedDate}
									min={formatDate(new Date())}
									onChange={(event) => {
										setSelectedDate(event.target.value);
										setSelectedHour(null);
									}}
								/>
							</FormField>

							<div className={styles.selectedDate}>
								{formatDateTitle(selectedDateObject)}
							</div>

							<div className={styles.slots}>
								{REGISTRATION_HOURS.map((hour) => {
									const slotKey = `${selectedDate}-${hour}`;

									const isOccupied = occupiedSlots.has(slotKey);

									const isSelected = selectedHour === hour;

									return (
										<button
											key={hour}
											type='button'
											className={`${styles.slot} ${
												isSelected ? styles.slot_selected : ''
											} ${isOccupied ? styles.slot_occupied : ''}`}
											disabled={isOccupied}
											onClick={() => handleSelectHour(hour)}>
											<strong>
												{String(hour).padStart(2, '0')}
												:00
											</strong>

											<span>
												{isOccupied
													? 'Занято'
													: isSelected
													? 'Выбрано'
													: 'Свободно'}
											</span>
										</button>
									);
								})}
							</div>

							<div className={styles.legend}>
								<div className={styles.legendItem}>
									<span
										className={`${styles.legendDot} ${styles.legendDot_free}`}
									/>
									Свободно
								</div>

								<div className={styles.legendItem}>
									<span
										className={`${styles.legendDot} ${styles.legendDot_occupied}`}
									/>
									Другой институт
								</div>

								<div className={styles.legendItem}>
									<span
										className={`${styles.legendDot} ${styles.legendDot_selected}`}
									/>
									Выбрано
								</div>
							</div>

							<Button
								text='Установить время регистрации'
								onClick={handleSave}
								color='blue'
								isBlock={
									selectedHour === null || isUpdatingRegistrationSettings
								}
							/>
						</Form>
					</div>
				</Card>
			</div>

			<Card>
				<div className={styles.otherInstitutes}>
					<div className={styles.sectionHeader}>
						<div>
							<div className={styles.sectionTitle}>
								Расписание других институтов
							</div>

							<div className={styles.sectionDescription}>
								Занятые слоты, которые нельзя выбрать
							</div>
						</div>
					</div>

					{otherInstitutes.length === 0 ? (
						<div className={styles.emptyState}>
							Другие институты ещё не выбрали время регистрации.
						</div>
					) : (
						<div className={styles.instituteList}>
							{otherInstitutes
								.filter((institute) => institute.registrationOpensAt)
								.sort(
									(a, b) =>
										new Date(a.registrationOpensAt!).getTime() -
										new Date(b.registrationOpensAt!).getTime()
								)
								.map((institute) => {
									const date = new Date(institute.registrationOpensAt!);

									return (
										<div
											key={`${institute.instituteCode}-${institute.registrationOpensAt}`}
											className={styles.instituteItem}>
											<div>
												<div className={styles.instituteName}>
													{institute.instituteName}
												</div>

												<div className={styles.instituteCode}>
													{institute.instituteCode}
												</div>
											</div>

											<div className={styles.instituteDate}>
												<strong>{formatDateTitle(date)}</strong>

												<span>{formatTime(date)}</span>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
};
