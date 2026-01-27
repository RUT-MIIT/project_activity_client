import type { FC, FormEvent, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from '../../../store/store';

import { setDivisionPlanAction } from '../../../store/structure/actions';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInputNumber,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';

export const SetDivisionNormForm: FC = () => {
	const dispatch = useDispatch();
	const { currentDivision, currentSemester, isLoadingAction } = useSelector(
		(state) => state.structure
	);

	const [divisionNorm, setDivisionNorm] = useState<number | null>(
		currentDivision ? currentDivision.plan : null
	);
	const [isBlockSubmit, setIsBlockSubmit] = useState(true);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (divisionNorm === null) return;

		if (currentDivision && currentSemester) {
			dispatch(
				setDivisionPlanAction({
					department_id: currentDivision.department_id,
					semester_id: currentSemester.id,
					plan: divisionNorm,
				})
			);
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;

		// Пустое поле — блокируем
		if (rawValue === '') {
			setDivisionNorm(null);
			setIsBlockSubmit(true);
			return;
		}

		const value = Number(rawValue);

		// NaN или отрицательное — блокируем
		if (Number.isNaN(value) || value < 0) {
			setDivisionNorm(value);
			setIsBlockSubmit(true);
			return;
		}

		// 0 и положительные — разрешаем
		setDivisionNorm(value);
		setIsBlockSubmit(false);
	};

	useEffect(() => {
		if (currentDivision) {
			setDivisionNorm(currentDivision.plan);
		}
	}, [currentDivision]);

	return (
		<Form
			name='set-division-norm-form'
			onSubmit={handleSubmit}
			formWidth='full'
			withHeightStretch>
			<FormField title='Плановое количество заявок'>
				<FormInputNumber
					name='division-norm'
					placeholder='Плановое количество заявок'
					value={divisionNorm}
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
