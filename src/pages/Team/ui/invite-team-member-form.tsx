import type { FC, FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { useSelector } from '../../../store/store';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import type { IGroupMember } from '../../../store/student/types';

interface IInviteStudentOption extends IGroupMember {
	fullName: string;
}

interface IInviteTeamMemberFormProps {
	onSubmit: (userId: number) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const InviteTeamMemberForm: FC<IInviteTeamMemberFormProps> = ({
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const { group, myTeam } = useSelector((state) => state.student);
	const { user } = useSelector((state) => state.user);

	const [selectedStudent, setSelectedStudent] =
		useState<IInviteStudentOption | null>(null);

	const availableStudents = useMemo<IInviteStudentOption[]>(() => {
		if (!group || !user || !myTeam) {
			return [];
		}

		const invitedUserIds = new Set(
			myTeam.sentInvitations.map((invitation) => invitation.user.id)
		);

		return group.members
			.filter(
				(student) =>
					student.team === null &&
					student.is_registered &&
					student.user_id !== user.id &&
					student.user_id !== null &&
					!invitedUserIds.has(student.user_id)
			)
			.map((student) => ({
				...student,
				fullName: `${student.last_name} ${student.first_name} ${student.middle_name}`,
			}));
	}, [group, user, myTeam]);

	const handleChooseStudent = (student: IInviteStudentOption | null) => {
		setSelectedStudent(student);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedStudent?.user_id) {
			return;
		}

		onSubmit(selectedStudent.user_id);
	};

	return (
		<Form
			name='invite-team-member-form'
			onSubmit={handleSubmit}
			formWidth='full'>
			<Notice
				type='warning'
				title='Обратите внимание'
				text='Пригласить можно студента, который уже прошёл авторизацию в системе и не был приглашен ранее.'
			/>

			<FormField title='Участник*'>
				<SelectWithSearch<IInviteStudentOption>
					options={availableStudents}
					currentOption={selectedStudent}
					onChooseOption={handleChooseStudent}
					placeholder='Выберите участника'
					valueKey='id'
					labelKey='fullName'
				/>
			</FormField>

			<FormButtons withMargin>
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
					isBlock={!selectedStudent?.user_id || isLoading}
				/>
			</FormButtons>
		</Form>
	);
};
