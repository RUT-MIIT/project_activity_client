import type { FC, FormEvent } from 'react';
import type { IInviteCandidate } from '../../../store/student/types';

import { useEffect, useState } from 'react';
import { useDispatch } from '../../../store/store';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import { getInviteCandidatesAction } from '../../../store/student/actions';

import styles from '../styles/invite-external-team-member-form.module.scss';

interface IInviteExternalTeamMemberFormProps {
	onSubmit: (userId: number) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const InviteExternalTeamMemberForm: FC<
	IInviteExternalTeamMemberFormProps
> = ({ onSubmit, onCancel, isLoading = false }) => {
	const dispatch = useDispatch();

	const [search, setSearch] = useState('');
	const [selectedCandidate, setSelectedCandidate] =
		useState<IInviteCandidate | null>(null);
	const [candidates, setCandidates] = useState<IInviteCandidate[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		const query = search.trim();

		if (query.length < 2) {
			setCandidates([]);
			setIsSearching(false);

			return;
		}

		const timer = window.setTimeout(async () => {
			try {
				setIsSearching(true);

				const result = await dispatch(
					getInviteCandidatesAction(query)
				).unwrap();

				setCandidates(result.results);
			} catch {
				setCandidates([]);
			} finally {
				setIsSearching(false);
			}
		}, 400);

		return () => window.clearTimeout(timer);
	}, [dispatch, search]);

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setSelectedCandidate(null);
	};

	const handleChooseCandidate = (candidate: IInviteCandidate) => {
		if (!candidate.canInvite) {
			return;
		}

		setSelectedCandidate(candidate);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedCandidate?.user_id || !selectedCandidate.canInvite) {
			return;
		}

		onSubmit(selectedCandidate.user_id);
	};

	const getCandidateStatus = (candidate: IInviteCandidate) => {
		if (candidate.canInvite) {
			return 'Можно пригласить';
		}

		if (!candidate.isRegistered) {
			return 'Не зарегистрирован в системе';
		}

		if (candidate.hasPendingInvitation) {
			return 'Приглашение уже отправлено';
		}

		if (candidate.inTeam) {
			return 'Уже состоит в команде';
		}

		return 'Пригласить нельзя';
	};

	return (
		<Form
			name='invite-external-team-member-form'
			onSubmit={handleSubmit}
			formWidth='full'>
			<Notice
				type='info'
				title='Приглашение участника'
				text='Введите часть ФИО студента. Поиск выполняется среди студентов вашего проектного трека.'
			/>

			<FormField
				title='Поиск участника'
				fieldError={{
					text: 'Введите минимум 2 символа для начала поиска',
					isShow: search.trim().length === 1,
				}}>
				<FormInput
					name='invite-member-search'
					value={search}
					onChange={(e) => handleSearchChange(e.target.value)}
					placeholder='Введите ФИО'
					disabled={isLoading}
				/>
			</FormField>

			{isSearching && <div className={styles.loading}>Поиск участников...</div>}

			{search.trim().length >= 2 && !isSearching && candidates.length === 0 && (
				<Notice
					type='warning'
					title='Ничего не найдено'
					text='По вашему запросу кандидаты не найдены.'
				/>
			)}

			{candidates.length > 0 && (
				<div className={styles.list}>
					{candidates.map((candidate) => {
						const isSelected = selectedCandidate?.id === candidate.id;
						const isDisabled = !candidate.canInvite;

						return (
							<button
								key={candidate.id}
								type='button'
								className={`${styles.candidate} ${
									isSelected ? styles.candidate_selected : ''
								} ${isDisabled ? styles.candidate_disabled : ''}`}
								onClick={() => handleChooseCandidate(candidate)}
								disabled={isDisabled || isLoading}>
								<div className={styles.candidate__main}>
									<p className={styles.candidate__name}>
										{candidate.full_name}
									</p>

									<p className={styles.candidate__group}>
										Группа: {candidate.group.name}
									</p>
								</div>

								<div className={styles.candidate__meta}>
									<span
										className={
											candidate.canInvite
												? styles.status_success
												: styles.status_warning
										}>
										{getCandidateStatus(candidate)}
									</span>

									{candidate.team && (
										<span className={styles.candidate__team}>
											Команда: {candidate.team.name}
										</span>
									)}
								</div>
							</button>
						);
					})}
				</div>
			)}

			{selectedCandidate && (
				<Notice
					type='success'
					title='Участник выбран'
					text={`Вы выбрали ${selectedCandidate.full_name}. После отправки приглашения студент сможет принять его в своём личном кабинете.`}
				/>
			)}

			<FormButtons>
				<Button
					type='button'
					text='Отмена'
					color='cancel'
					onClick={onCancel}
					isBlock={isLoading}
				/>

				<Button
					type='submit'
					text='Пригласить'
					color='green'
					isBlock={
						!selectedCandidate?.user_id ||
						!selectedCandidate.canInvite ||
						isLoading ||
						isSearching
					}
				/>
			</FormButtons>
		</Form>
	);
};
