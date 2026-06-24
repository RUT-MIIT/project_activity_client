import type { FC, FormEvent } from 'react';
import type { IDistributeApplicationProps } from '../types/types';
import type { IInstitute } from '../../../store/catalog/types';

import { useState } from 'react';
import { useSelector } from '../../../store/store';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Select } from '../../../shared/components/Select/ui/select';

import { Button } from '../../../shared/components/Button/ui/button';

export const DistributeApplication: FC<IDistributeApplicationProps> = ({
	onDistribute,
}) => {
	const { institutes } = useSelector((state) => state.catalog);
	const { isLoadingAction } = useSelector((state) => state.coordination);

	const [currentInstitute, setCurrentInstitute] = useState<IInstitute | null>(
		null
	);

	const handleChangeInstitute = (selected: IInstitute | null) => {
		setCurrentInstitute(selected);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!currentInstitute) return;

		onDistribute(currentInstitute.code);
	};

	return (
		<Form
			name='distribute-application-form'
			onSubmit={handleSubmit}
			formWidth='full'
			withHeightStretch>
			<FormField title='Подразделение'>
				<Select
					placeholder='Выберите подразделение..'
					options={institutes}
					currentOption={currentInstitute}
					onChooseOption={handleChangeInstitute}
					valueKey='code'
					labelKey='name'
				/>
			</FormField>
			<FormButtons withMargin>
				<Button
					text='Сохранить'
					type='submit'
					color='green'
					withIcon={{ type: 'check', color: 'white' }}
					isBlock={isLoadingAction || !currentInstitute}
				/>
			</FormButtons>
		</Form>
	);
};
