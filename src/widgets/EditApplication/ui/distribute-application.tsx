import type { FC, FormEvent } from 'react';
import type { IDistributeApplicationProps } from '../types/types';
import type { IInstitute } from '../../../store/catalog/types';

import { useState, useEffect } from 'react';
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

	const [currentInstitute, setCurrentInstitute] = useState<IInstitute>({
		code: '0',
		name: 'Выберите подразделение..',
	});
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);

	const handleChangeInstitute = (selected: IInstitute) => {
		setCurrentInstitute(selected);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onDistribute(currentInstitute.code);
	};

	useEffect(() => {
		setIsBlockSubmit(currentInstitute.code === '0' ? true : false);
	}, [currentInstitute]);

	return (
		<Form
			name='distribute-application-form'
			onSubmit={handleSubmit}
			formWidth='full'
			withHeightStretch>
			<FormField title='Подразделение'>
				<Select
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
					isBlock={isLoadingAction || isBlockSubmit}
				/>
			</FormButtons>
		</Form>
	);
};
