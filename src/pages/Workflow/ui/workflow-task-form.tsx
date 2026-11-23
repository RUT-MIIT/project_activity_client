import type { FC, FormEvent } from 'react';
import type { ITaskFormValues, ITaskMember, TTaskStatus } from '../types/tasks';

import { useState } from 'react';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormButtons,
	FormField,
	FormInput,
	FormTextarea,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Select } from '../../../shared/components/Select/ui/select';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';

import { getTaskStatusText, taskStages } from '../lib/tasks';

interface IWorkflowTaskFormProps {
	initial: ITaskFormValues;
	members: ITaskMember[];
	submitText: string;
	onSubmit: (values: ITaskFormValues) => void;
	onCancel: () => void;
}

const statusOptions: { id: TTaskStatus; name: string }[] = [
	{ id: 'todo', name: getTaskStatusText('todo') },
	{ id: 'in_progress', name: getTaskStatusText('in_progress') },
	{ id: 'review', name: getTaskStatusText('review') },
	{ id: 'done', name: getTaskStatusText('done') },
];

const stageOptions = taskStages.map((stage) => ({
	id: stage.id,
	name: `Этап ${stage.id}. ${stage.shortTitle}`,
}));

export const WorkflowTaskForm: FC<IWorkflowTaskFormProps> = ({
	initial,
	members,
	submitText,
	onSubmit,
	onCancel,
}) => {
	const [values, setValues] = useState<ITaskFormValues>(initial);
	const [titleError, setTitleError] = useState('');
	const [dueError, setDueError] = useState('');
	const memberOptions = members.map((member) => ({
		id: member.id,
		name: member.fullName,
	}));

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const nextTitleError = values.title.trim() ? '' : 'Укажите название задачи';
		const nextDueError = values.dueAt ? '' : 'Укажите плановую дату завершения';

		setTitleError(nextTitleError);
		setDueError(nextDueError);

		if (nextTitleError || nextDueError) {
			return;
		}

		onSubmit({ ...values, title: values.title.trim() });
	};

	return (
		<Form name='workflow-task-form' onSubmit={handleSubmit}>
			<FormField
				title='Название задачи'
				fieldError={{ text: titleError, isShow: Boolean(titleError) }}>
				<FormInput
					name='title'
					value={values.title}
					onChange={(event) =>
						setValues((prev) => ({ ...prev, title: event.target.value }))
					}
				/>
			</FormField>
			<FormField title='Подробное описание'>
				<FormTextarea
					name='description'
					value={values.description}
					onChange={(event) =>
						setValues((prev) => ({
							...prev,
							description: event.target.value,
						}))
					}
				/>
			</FormField>
			<FormField title='Этап проектной деятельности'>
				<Select
					options={stageOptions}
					currentOption={
						stageOptions.find((option) => option.id === values.stageId) || null
					}
					onChooseOption={(option) => {
						if (option) {
							setValues((prev) => ({ ...prev, stageId: option.id }));
						}
					}}
					withClear={false}
				/>
			</FormField>
			<FormField title='Статус выполнения'>
				<Select
					options={statusOptions}
					currentOption={
						statusOptions.find((option) => option.id === values.status) || null
					}
					onChooseOption={(option) => {
						if (option) {
							setValues((prev) => ({ ...prev, status: option.id }));
						}
					}}
					withClear={false}
				/>
			</FormField>
			<FormField title='Исполнители'>
				<MultiSelect
					options={memberOptions}
					selectedOptions={memberOptions.filter((member) =>
						values.assigneeIds.includes(member.id)
					)}
					onChange={(selected) =>
						setValues((prev) => ({
							...prev,
							assigneeIds: selected.map((item) => item.id),
						}))
					}
					placeholder='Назначьте участников'
				/>
			</FormField>
			<FormField title='Дата начала'>
				<FormInput
					type='date'
					name='startAt'
					value={values.startAt}
					onChange={(event) =>
						setValues((prev) => ({ ...prev, startAt: event.target.value }))
					}
				/>
			</FormField>
			<FormField
				title='Плановая дата завершения'
				fieldError={{ text: dueError, isShow: Boolean(dueError) }}>
				<FormInput
					type='date'
					name='dueAt'
					value={values.dueAt}
					onChange={(event) =>
						setValues((prev) => ({ ...prev, dueAt: event.target.value }))
					}
				/>
			</FormField>
			<FormButtons withMargin>
				<Button text='Отмена' color='cancel' onClick={onCancel} />
				<Button type='submit' text={submitText} color='blue' />
			</FormButtons>
		</Form>
	);
};
