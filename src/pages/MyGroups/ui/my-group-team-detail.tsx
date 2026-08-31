import type { FC, FormEvent } from 'react';
import type { IMentorTeam } from '../../../store/mentor/types';

import { useMemo, useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Button } from '../../../shared/components/Button/ui/button';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormButtons,
	FormField,
	FormInput,
} from '../../../shared/components/Form/components';
import { Text } from '../../../shared/components/Typography';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import {
	addMentorTeamMemberAction,
	confirmMentorTeamCompositionAction,
	deleteMentorTeamAction,
	removeMentorTeamMemberAction,
	unconfirmMentorTeamCompositionAction,
	updateMentorTeamCaptainAction,
	updateMentorTeamNameAction,
} from '../../../store/mentor/actions';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { getTeamStatusColor, getTeamStatusText } from '../../Team/lib/helpers';

import styles from '../styles/my-group-team-detail.module.scss';

interface IMyGroupTeamDetailProps {
	groupId: number;
	isOpen: boolean;
	onClose: () => void;
	team: IMentorTeam | null;
}

type TEditMode = 'default' | 'rename' | 'captain';

interface IStudentOption {
	id: number;
	name: string;
	userId: number;
}

export const MyGroupTeamDetail: FC<IMyGroupTeamDetailProps> = ({
	groupId,
	isOpen,
	onClose,
	team,
}) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { currentGroup, currentTeam, isLoadingTeamRequest } = useSelector(
		(state) => state.mentor
	);

	// currentTeam содержит актуальное состояние после мутаций.
	// team используется как первоначальный fallback.
	const activeTeam = currentTeam ?? team;

	const [editMode, setEditMode] = useState<TEditMode>('default');
	const [teamName, setTeamName] = useState('');
	const [selectedCaptainId, setSelectedCaptainId] = useState<number | null>(
		null
	);
	const [selectedStudent, setSelectedStudent] = useState<IStudentOption | null>(
		null
	);

	const availableStudents = useMemo<IStudentOption[]>(() => {
		if (!currentGroup || !activeTeam) {
			return [];
		}

		const teamMemberIds = new Set(
			activeTeam.members.map((member) => member.userId)
		);

		return currentGroup.students
			.filter((student): student is typeof student & { userId: number } => {
				// Только зарегистрированные
				if (!student.isRegistered) {
					return false;
				}

				// У зарегистрированного должен быть userId
				if (student.userId === null) {
					return false;
				}

				// Только студенты без команды
				if (student.team !== null) {
					return false;
				}

				// Дополнительная защита
				if (teamMemberIds.has(student.userId)) {
					return false;
				}

				return true;
			})
			.map((student) => ({
				id: student.id,
				name: [student.lastName, student.firstName, student.middleName]
					.filter(Boolean)
					.join(' '),
				userId: student.userId,
			}));
	}, [currentGroup, activeTeam]);

	const captainOptions = useMemo(() => {
		if (!activeTeam) {
			return [];
		}

		return activeTeam.members.map((member) => ({
			id: member.userId,
			name: member.fullName,
		}));
	}, [activeTeam]);

	const currentCaptain = useMemo(() => {
		if (!activeTeam) {
			return null;
		}

		const captain = activeTeam.members.find(
			(member) => member.role === 'leader'
		);

		return captain
			? {
					id: captain.userId,
					name: captain.fullName,
			  }
			: null;
	}, [activeTeam]);

	const openRename = () => {
		if (!activeTeam) {
			return;
		}

		setTeamName(activeTeam.name);
		setEditMode('rename');
	};

	const openCaptain = () => {
		setSelectedCaptainId(currentCaptain?.id ?? null);
		setEditMode('captain');
	};

	const cancelEdit = () => {
		setEditMode('default');
		setTeamName('');
		setSelectedCaptainId(null);
	};

	const handleRename = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!activeTeam) {
			return;
		}

		const name = teamName.trim();

		if (!name) {
			showToast({
				title: 'Не указано название',
				text: 'Введите название команды.',
				type: 'error',
			});

			return;
		}

		try {
			await dispatch(
				updateMentorTeamNameAction({
					groupId,
					teamSemesterId: activeTeam.id,
					name,
				})
			).unwrap();

			showToast({
				title: 'Команда переименована',
				text: 'Название команды успешно изменено.',
				type: 'success',
			});

			cancelEdit();
		} catch (err) {
			showToast({
				title: 'Не удалось переименовать команду',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleCaptain = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!activeTeam || selectedCaptainId === null) {
			return;
		}

		try {
			await dispatch(
				updateMentorTeamCaptainAction({
					groupId,
					teamSemesterId: activeTeam.id,
					captainId: selectedCaptainId,
				})
			).unwrap();

			showToast({
				title: 'Капитан назначен',
				text: 'Капитан команды успешно изменён.',
				type: 'success',
			});

			cancelEdit();
		} catch (err) {
			showToast({
				title: 'Не удалось назначить капитана',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleAddMember = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!activeTeam || !selectedStudent) {
			return;
		}

		try {
			await dispatch(
				addMentorTeamMemberAction({
					groupId,
					teamSemesterId: activeTeam.id,
					userId: selectedStudent.userId,
				})
			).unwrap();

			setSelectedStudent(null);

			showToast({
				title: 'Участник добавлен',
				text: 'Студент успешно добавлен в команду.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось добавить участника',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleRemoveMember = async (userId: number) => {
		if (!activeTeam) {
			return;
		}

		try {
			await dispatch(
				removeMentorTeamMemberAction({
					groupId,
					teamSemesterId: activeTeam.id,
					userId,
				})
			).unwrap();

			showToast({
				title: 'Участник удалён',
				text: 'Студент удалён из команды.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось удалить участника',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleConfirmComposition = async () => {
		if (!activeTeam) {
			return;
		}

		try {
			await dispatch(
				confirmMentorTeamCompositionAction({
					groupId,
					teamSemesterId: activeTeam.id,
				})
			).unwrap();

			showToast({
				title: 'Состав подтверждён',
				text: 'Состав команды успешно подтверждён.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось подтвердить состав',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleUnconfirmComposition = async () => {
		if (!activeTeam) {
			return;
		}

		try {
			await dispatch(
				unconfirmMentorTeamCompositionAction({
					groupId,
					teamSemesterId: activeTeam.id,
				})
			).unwrap();

			showToast({
				title: 'Состав возвращён на редактирование',
				text: 'Теперь состав команды снова можно изменять.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Не удалось изменить статус состава',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const handleDeleteTeam = async () => {
		if (!activeTeam) {
			return;
		}

		if (activeTeam.membersCount > 0) {
			return;
		}

		try {
			await dispatch(
				deleteMentorTeamAction({
					groupId,
					teamSemesterId: activeTeam.id,
				})
			).unwrap();

			showToast({
				title: 'Команда удалена',
				text: 'Команда успешно удалена.',
				type: 'success',
			});

			onClose();
		} catch (err) {
			showToast({
				title: 'Не удалось удалить команду',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	if (!activeTeam) {
		return (
			<Modal isOpen={isOpen} onClose={onClose} title='Управление командой'>
				<Preloader />
			</Modal>
		);
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Команда ${activeTeam.name}`}
			description='Управление составом и параметрами команды'>
			<div className={styles.container}>
				{editMode === 'default' && (
					<>
						<div className={styles.header}>
							<div className={styles.main}>
								<Badge
									text={getTeamStatusText(activeTeam.status)}
									color={getTeamStatusColor(activeTeam.status)}
								/>

								<h3 className={styles.title}>{activeTeam.name}</h3>
							</div>

							<div className={styles.count}>
								<span className={styles.count__label}>Участников</span>

								<strong className={styles.count__value}>
									{activeTeam.membersCount}
								</strong>
							</div>
						</div>

						<div className={styles.actions}>
							<Button
								type='button'
								text='Изменить название'
								color='blue'
								onClick={openRename}
								isBlock={isLoadingTeamRequest}
							/>

							<Button
								type='button'
								text='Назначить капитана'
								color='blue'
								onClick={openCaptain}
								isBlock={
									isLoadingTeamRequest || activeTeam.members.length === 0
								}
							/>
						</div>

						<div className={styles.section}>
							<h4 className={styles.section__title}>Добавить участника</h4>

							<Form
								name='mentor-team-add-member'
								onSubmit={handleAddMember}
								formWidth='full'>
								<FormField title='Студент'>
									<SelectWithSearch
										options={availableStudents}
										currentOption={selectedStudent}
										onChooseOption={(option) => {
											setSelectedStudent(option);
										}}
										placeholder='Выберите студента...'
										valueKey='id'
										labelKey='name'
										withClear={false}
									/>
								</FormField>

								<FormButtons>
									<Button
										type='submit'
										text='Добавить участника'
										color='blue'
										isBlock={selectedStudent === null || isLoadingTeamRequest}
									/>
								</FormButtons>
							</Form>
						</div>

						<div className={styles.section}>
							<h4 className={styles.section__title}>Состав команды</h4>

							{activeTeam.members.length > 0 ? (
								<div className={styles.members}>
									{activeTeam.members.map((member, index) => (
										<div className={styles.member} key={member.userId}>
											<span className={styles.member__count}>{index + 1}.</span>

											<TeamAvatar
												firstName={member.fullName.split(' ')[1] ?? ''}
												lastName={member.fullName.split(' ')[0] ?? ''}
												role={
													member.role === 'leader'
														? 'Капитан команды'
														: 'Участник'
												}
											/>

											<div className={styles.member__info}>
												<p className={styles.member__name}>{member.fullName}</p>

												<span className={styles.member__role}>
													{member.role === 'leader'
														? 'Капитан команды'
														: 'Участник'}

													{member.isPlaceholder ? ' · не зарегистрирован' : ''}
												</span>
											</div>

											<button
												type='button'
												className={styles.remove}
												onClick={() => handleRemoveMember(member.userId)}
												disabled={
													isLoadingTeamRequest || member.role === 'leader'
												}
												aria-label='Удалить участника'
												title={
													member.role === 'leader'
														? 'Сначала назначьте другого капитана'
														: 'Удалить участника'
												}>
												×
											</button>
										</div>
									))}
								</div>
							) : (
								<Text text='В команде пока нет участников.' color='grey' />
							)}
						</div>

						<div className={styles.footer}>
							{activeTeam.status === 'forming' ? (
								<Button
									type='button'
									text='Подтвердить состав'
									color='green'
									onClick={handleConfirmComposition}
									isBlock={isLoadingTeamRequest}
								/>
							) : (
								<Button
									type='button'
									text='Вернуть на формирование'
									color='purple'
									onClick={handleUnconfirmComposition}
									isBlock={isLoadingTeamRequest}
								/>
							)}

							<Button
								type='button'
								text='Удалить команду'
								color='red'
								onClick={handleDeleteTeam}
								isBlock={activeTeam.membersCount !== 0 || isLoadingTeamRequest}
							/>
						</div>
					</>
				)}

				{editMode === 'rename' && (
					<Form
						name='mentor-team-rename'
						onSubmit={handleRename}
						formWidth='full'>
						<FormField title='Название команды*'>
							<FormInput
								name='team-name'
								placeholder='Введите название команды'
								value={teamName}
								onChange={(e) => setTeamName(e.target.value)}
							/>
						</FormField>

						<FormButtons>
							<Button
								type='button'
								text='Назад'
								color='cancel'
								onClick={cancelEdit}
								isBlock={isLoadingTeamRequest}
							/>

							<Button
								type='submit'
								text='Сохранить'
								color='blue'
								isBlock={!teamName.trim() || isLoadingTeamRequest}
							/>
						</FormButtons>
					</Form>
				)}

				{editMode === 'captain' && (
					<Form
						name='mentor-team-captain'
						onSubmit={handleCaptain}
						formWidth='full'>
						<FormField title='Капитан команды*'>
							<SelectWithSearch
								options={captainOptions}
								currentOption={
									captainOptions.find(
										(option) => option.id === selectedCaptainId
									) ?? null
								}
								onChooseOption={(option) => {
									setSelectedCaptainId(option?.id ?? null);
								}}
								placeholder='Выберите капитана...'
								valueKey='id'
								labelKey='name'
								withClear={false}
							/>
						</FormField>

						<FormButtons withMargin>
							<Button
								type='button'
								text='Назад'
								color='cancel'
								onClick={cancelEdit}
								isBlock={isLoadingTeamRequest}
							/>

							<Button
								type='submit'
								text='Назначить капитана'
								color='blue'
								isBlock={selectedCaptainId === null || isLoadingTeamRequest}
							/>
						</FormButtons>
					</Form>
				)}
			</div>
		</Modal>
	);
};
