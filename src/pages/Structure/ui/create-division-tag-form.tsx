import type { FC, FormEvent, ChangeEvent } from 'react';
import { useState } from 'react';

import { useDispatch, useSelector } from '../../../store/store';

import { createDivisionTagAction } from '../../../store/structure/actions';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';

export const CreateDivisionTagForm: FC = () => {
	const dispatch = useDispatch();
	const { isLoadingAction } = useSelector((state) => state.structure);

	const [divisionTag, setDivisionTag] = useState<string>('');
	const [isBlockSubmit, setIsBlockSubmit] = useState(true);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(
			createDivisionTagAction({
				name: divisionTag,
				category: '',
			})
		);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDivisionTag(e.target.value);
		if (e.target.value.length > 0) {
			setIsBlockSubmit(false);
		} else {
			setIsBlockSubmit(true);
		}
	};

	return (
		<Form
			name='create-division-tag-form'
			onSubmit={handleSubmit}
			formWidth='full'
			withHeightStretch>
			<FormField title='Наименование тега'>
				<FormInput
					name='division-tag'
					placeholder='Наименование тега'
					value={divisionTag}
					onChange={handleChange}
				/>
			</FormField>

			<FormButtons withMargin>
				<Button
					text='Сохранить'
					type='submit'
					color='green'
					withIcon={{ type: 'check', color: 'white' }}
					isBlock={isLoadingAction || isBlockSubmit}
				/>
			</FormButtons>
		</Form>
	);
};
