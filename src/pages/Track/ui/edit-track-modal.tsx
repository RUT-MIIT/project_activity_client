import type { FC, FormEvent, ChangeEvent } from 'react';

import { useEffect, useState } from 'react';
import { useSelector } from '../../../store/store';

import type { ITrack } from '../../../store/track/types';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Button } from '../../../shared/components/Button/ui/button';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../../shared/components/Form/components';

import styles from '../styles/create-track-modal.module.scss';

interface IEditTrackModalProps {
	isOpen: boolean;
	track: ITrack | null;
	onClose: () => void;
	onSubmit: (data: {
		id: number;
		name: string;
		minTeamMembers: number;
		maxTeamMembers: number;
	}) => void;
}

export const EditTrackModal: FC<IEditTrackModalProps> = ({
	isOpen,
	track,
	onClose,
	onSubmit,
}) => {
	const { isLoadingAction } = useSelector((state) => state.track);
	const [trackName, setTrackName] = useState('');
	const [trackNameError, setTrackNameError] = useState({
		isShow: false,
		text: '',
	});

	const [teamSizeRange, setTeamSizeRange] = useState({
		min: 4,
		max: 7,
	});

	useEffect(() => {
		if (!track) {
			return;
		}

		setTrackName(track.name);

		setTeamSizeRange({
			min: track.applications[0]?.minTeamMembers ?? 4,
			max: track.applications[0]?.maxTeamMembers ?? 7,
		});

		setTrackNameError({
			isShow: false,
			text: '',
		});
	}, [track]);

	const handleChangeTrackName = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setTrackName(value);

		setTrackNameError({
			isShow: value.trim().length === 0,
			text: value.trim().length === 0 ? 'Поле не может быть пустым' : '',
		});
	};

	const handleMinTeamSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		setTeamSizeRange((prev) => ({
			...prev,
			min: Math.min(value, prev.max),
		}));
	};

	const handleMaxTeamSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);

		setTeamSizeRange((prev) => ({
			...prev,
			max: Math.max(value, prev.min),
		}));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!track) {
			return;
		}

		if (trackName.trim().length === 0) {
			setTrackNameError({
				isShow: true,
				text: 'Введите название трека',
			});

			return;
		}

		onSubmit({
			id: track.id,
			name: trackName.trim(),
			minTeamMembers: teamSizeRange.min,
			maxTeamMembers: teamSizeRange.max,
		});
	};

	const handleClose = () => {
		setTrackName('');
		setTeamSizeRange({
			min: 4,
			max: 7,
		});

		setTrackNameError({
			isShow: false,
			text: '',
		});

		onClose();
	};

	const isSubmitBlocked =
		!track ||
		trackName.trim().length === 0 ||
		teamSizeRange.min < 3 ||
		teamSizeRange.max > 10 ||
		teamSizeRange.min > teamSizeRange.max;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title='Редактирование трека'
			description='Измените основные параметры проектного трека'>
			<Form
				name='edit-track-modal-form'
				onSubmit={handleSubmit}
				formWidth='full'>
				<FormField title='Название трека*' fieldError={trackNameError}>
					<FormInput
						name='track-name'
						placeholder='Введите название трека'
						value={trackName}
						onChange={handleChangeTrackName}
					/>
				</FormField>

				<FormField
					title='Количество человек в команде'
					withInfo
					infoText='Укажите допустимый диапазон количества участников в одной команде. Можно выбрать от 3 до 10 человек.'>
					<div className={styles.teamSize}>
						<div className={styles.teamSize__slider}>
							<div
								className={styles.teamSize__range}
								style={{
									left: `${((teamSizeRange.min - 3) / 7) * 100}%`,
									right: `${100 - ((teamSizeRange.max - 3) / 7) * 100}%`,
								}}
							/>

							<input
								type='range'
								min={3}
								max={10}
								step={1}
								value={teamSizeRange.min}
								onChange={handleMinTeamSizeChange}
								className={styles.teamSize__input}
							/>

							<input
								type='range'
								min={3}
								max={10}
								step={1}
								value={teamSizeRange.max}
								onChange={handleMaxTeamSizeChange}
								className={styles.teamSize__input}
							/>
						</div>

						<div className={styles.teamSize__labels}>
							<span>3</span>
							<span>4</span>
							<span>5</span>
							<span>6</span>
							<span>7</span>
							<span>8</span>
							<span>9</span>
							<span>10</span>
						</div>
					</div>
				</FormField>

				<FormButtons>
					<Button
						text='Отмена'
						type='button'
						color='cancel'
						onClick={handleClose}
					/>

					<Button
						text='Сохранить'
						type='submit'
						color='blue'
						isBlock={isSubmitBlocked || isLoadingAction}
					/>
				</FormButtons>
			</Form>
		</Modal>
	);
};
