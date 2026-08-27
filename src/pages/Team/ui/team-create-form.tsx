import type { FC, FormEvent, ChangeEvent } from 'react';
import { useState } from 'react';

import { Button } from '../../../shared/components/Button/ui/button';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../../shared/components/Form/components';

import {
	required,
	maxLength,
	minLength,
} from '../../../shared/lib/validationRules';

import type { ICreateTeam } from '../../../store/student/types';

interface ITeamCreateFormProps {
	onSubmit: (data: ICreateTeam) => void;
	isLoading?: boolean;
}

export const TeamCreateForm: FC<ITeamCreateFormProps> = ({
	onSubmit,
	isLoading = false,
}) => {
	const [name, setName] = useState('');
	const [nameTouched, setNameTouched] = useState(false);

	const validators = [required(), minLength(2), maxLength(30)];

	const getNameError = () => {
		if (!nameTouched) {
			return {
				isShow: false,
				text: '',
			};
		}

		for (const validator of validators) {
			if (!validator.validate(name.trim())) {
				return {
					isShow: true,
					text: validator.errorMessage,
				};
			}
		}

		return {
			isShow: false,
			text: '',
		};
	};

	const nameError = getNameError();

	const isSubmitBlocked =
		!name.trim() ||
		name.trim().length < 2 ||
		name.trim().length > 30 ||
		isLoading;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
		setNameTouched(true);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const value = name.trim();

		const isValid = validators.every((validator) => validator.validate(value));

		if (!isValid) {
			setNameTouched(true);
			return;
		}

		onSubmit({
			name: value,
		});
	};

	return (
		<Form
			name='team-create-modal-form'
			onSubmit={handleSubmit}
			formWidth='full'>
			<FormField title='Название команды*' fieldError={nameError}>
				<FormInput
					name='team-name'
					placeholder='Например, Инноваторы'
					value={name}
					onChange={handleChange}
				/>
			</FormField>

			<FormButtons withMargin>
				<Button
					text='Создать команду'
					type='submit'
					color='blue'
					isBlock={isSubmitBlocked}
				/>
			</FormButtons>
		</Form>
	);
};
