import type { FC, FormEvent } from 'react';
import type { ICreateAppMainForm } from '../types/types';
import type { IInstitute } from '../../../store/catalog/types';
import type { IProjectLevel } from '../../../shared/lib/lib';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../store/store';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Card } from '../../../shared/components/Card/ui/card';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormTextarea,
	FormButtons,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Select } from '../../../shared/components/Select/ui/select';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { Checkbox } from '../../../shared/components/Checkbox/ui/checkbox';

import {
	validationSchema,
	initialAppMainValues,
	shouldBlockSubmit,
	formFieldData,
} from '../lib/helpers';
import { createAppMainAction } from '../../../store/application/actions';
import { getInstitutesAction } from '../../../store/catalog/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { projectLevels } from '../../../shared/lib/lib';
import { EPAGESROUTES, EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/create-main-application.module.scss';

export const CreateMainApplication: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { user } = useSelector((state) => state.user);
	const { institutes, isLoadingCatalog } = useSelector(
		(state) => state.catalog
	);
	const [currentStep, setCurrentStep] = useState(1);
	const { isLoading } = useSelector((state) => state.application);
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);
	const {
		values,
		handleChange,
		handleSelectChange,
		handleCheckboxToggle,
		errors,
	} = useForm<ICreateAppMainForm>(initialAppMainValues, validationSchema);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isBlockSubmit && user) {
			const appMainData = {
				author: user.id,
				author_firstname: user.first_name,
				author_middlename: user.middle_name,
				author_lastname: user.last_name,
				author_phone: user.phone,
				author_email: user.email,
				author_role: user.role,
				author_division: user.department.name,
				...values,
				project_level:
					typeof values.project_level === 'object'
						? values.project_level.name
						: values.project_level,
				target_institutes: values.target_institutes.map((elem) => elem.code),
			};

			try {
				await dispatch(createAppMainAction(appMainData)).unwrap();
				navigate(`${EPAGESROUTES.MAIN}/${EMAINROUTES.MY_APPS}`, {
					replace: true,
				});
				showToast({
					title: 'Заявка успешно создана!',
					text: `Заявка «${values.title}» создана.`,
					type: 'success',
				});
			} catch (err) {
				console.log(err);
				showToast({
					title: 'Произошла ошибка при создании заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleChangeInstitute = (selected: IInstitute[]) => {
		handleSelectChange('target_institutes', selected);
	};

	const handleChangeLevel = (selected: IProjectLevel) => {
		handleSelectChange('project_level', selected);
	};

	const handleChangeConsultation = () => {
		handleCheckboxToggle('needs_consultation');
	};

	const handleNextStep = () => setCurrentStep((prev) => prev + 1);
	const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	useEffect(() => {
		dispatch(getInstitutesAction());
	}, [dispatch]);

	if (isLoadingCatalog) {
		return <Preloader />;
	}

	const steps = [
		{
			title: 'Шаг 1. О проекте',
			subtitle:
				'Укажите наименование проекта, сведения о заказчике и уровне проекта',
			content: (
				<>
					<FormField
						title={formFieldData.company.title}
						withInfo
						infoText={formFieldData.company.info}>
						<FormInput
							name={formFieldData.company.name}
							value={values.company}
							onChange={handleChange}
							placeholder={formFieldData.company.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.company_contacts.title}
						withInfo
						infoText={formFieldData.company_contacts.info}>
						<FormTextarea
							name={formFieldData.company_contacts.name}
							value={values.company_contacts}
							onChange={handleChange}
							placeholder={formFieldData.company_contacts.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.project_level.title}
						withInfo
						infoText={formFieldData.project_level.info}>
						<Select
							options={projectLevels}
							currentOption={values.project_level}
							onChooseOption={handleChangeLevel}
						/>
					</FormField>
					<FormField
						title={formFieldData.target_institutes.title}
						withInfo
						infoText={formFieldData.target_institutes.info}>
						<MultiSelect
							options={institutes}
							selectedOptions={values.target_institutes}
							valueKey='code'
							labelKey='name'
							onChange={handleChangeInstitute}
						/>
					</FormField>
				</>
			),
		},
		{
			title: 'Шаг 2. Проблема',
			subtitle: 'Опишите задачу и препятствия, с которыми сталкиваетесь',
			content: (
				<>
					<FormField
						title={formFieldData.problem_holder.title}
						withInfo
						infoText={formFieldData.problem_holder.info}>
						<FormInput
							name={formFieldData.problem_holder.name}
							value={values.problem_holder}
							onChange={handleChange}
							placeholder={formFieldData.problem_holder.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.goal.title}
						withInfo
						infoText={formFieldData.goal.info}>
						<FormTextarea
							name={formFieldData.goal.name}
							value={values.goal}
							onChange={handleChange}
							placeholder={formFieldData.goal.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.barrier.title}
						withInfo
						infoText={formFieldData.barrier.info}>
						<FormTextarea
							name={formFieldData.barrier.name}
							value={values.barrier}
							onChange={handleChange}
							placeholder={formFieldData.barrier.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.existing_solutions.title}
						withInfo
						infoText={formFieldData.existing_solutions.info}>
						<FormTextarea
							name={formFieldData.existing_solutions.name}
							value={values.existing_solutions}
							onChange={handleChange}
							placeholder={formFieldData.existing_solutions.placeholder}
						/>
					</FormField>
				</>
			),
		},
		{
			title: 'Шаг 3. Контекст и рекомендации',
			subtitle: 'Опишите окружение проекта',
			content: (
				<>
					<FormField
						title={formFieldData.context.title}
						withInfo
						infoText={formFieldData.context.info}>
						<FormTextarea
							name={formFieldData.context.name}
							value={values.context}
							onChange={handleChange}
							placeholder={formFieldData.context.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.title.title}
						withInfo
						infoText={formFieldData.title.info}>
						<FormInput
							name={formFieldData.title.name}
							value={values.title}
							onChange={handleChange}
							placeholder={formFieldData.title.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.stakeholders.title}
						withInfo
						infoText={formFieldData.stakeholders.info}>
						<FormTextarea
							name={formFieldData.stakeholders.name}
							value={values.stakeholders}
							onChange={handleChange}
							placeholder={formFieldData.stakeholders.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.recommended_tools.title}
						withInfo
						infoText={formFieldData.recommended_tools.info}>
						<FormTextarea
							name={formFieldData.recommended_tools.name}
							value={values.recommended_tools}
							onChange={handleChange}
							placeholder={formFieldData.recommended_tools.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldData.experts.title}
						withInfo
						infoText={formFieldData.experts.info}>
						<FormTextarea
							name={formFieldData.experts.name}
							value={values.experts}
							onChange={handleChange}
							placeholder={formFieldData.experts.placeholder}
						/>
					</FormField>
				</>
			),
		},
		{
			title: 'Шаг 4. Дополительно',
			subtitle: 'Опишите дополнительные сведения',
			content: (
				<>
					<FormField
						title={formFieldData.additional_materials.title}
						withInfo
						infoText={formFieldData.additional_materials.info}>
						<FormTextarea
							name={formFieldData.additional_materials.name}
							value={values.additional_materials}
							onChange={handleChange}
							placeholder={formFieldData.additional_materials.placeholder}
						/>
					</FormField>
					<FormField title={formFieldData.needs_consultation.title}>
						<Checkbox
							checked={values.needs_consultation}
							label={formFieldData.needs_consultation.placeholder}
							onChange={handleChangeConsultation}
						/>
					</FormField>
				</>
			),
		},
	];

	const summaryFields = [
		{ title: 'Организация-заказчик', value: values.company },
		{ title: 'Контактные данные заказчика', value: values.company_contacts },
		{
			title: 'Уровень проекта',
			value: values.project_level.id === 0 ? '' : values.project_level.name,
		},
		{
			title: 'Институт / академия',
			value:
				values.target_institutes.length > 0
					? values.target_institutes.map((elem) => elem.name).join(', ')
					: '',
		},
		{ title: 'Носитель проблемы', value: values.problem_holder },
		{ title: 'Цель', value: values.goal },
		{ title: 'Барьер', value: values.barrier },
		{ title: 'Существующие решения', value: values.existing_solutions },
		{ title: 'Контекст проекта', value: values.context },
		{ title: 'Наименование проекта', value: values.title },
		{ title: 'Другие заинтересованные стороны', value: values.stakeholders },
		{
			title: 'Рекомендуемые инструменты / методы',
			value: values.recommended_tools,
		},
		{ title: 'Эксперты', value: values.experts },
	];

	const isLastStep = currentStep === steps.length;
	const progress = (currentStep / steps.length) * 100;

	return (
		<div className={styles.container}>
			<div className={styles.progress}>
				<div className={styles.progress__info}>
					<span>
						Шаг {currentStep} из {steps.length}
					</span>
				</div>
				<div className={styles.progress__bar}>
					<div
						className={styles.progress__fill}
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			<div className={styles.main}>
				<div className={styles.form}>
					<Card
						title={steps[currentStep - 1].title}
						subtitle={steps[currentStep - 1].subtitle}
						withHeightStretch>
						<Form
							name='form-create-main-app'
							onSubmit={handleSubmit}
							formWidth='full'
							withHeightStretch>
							<div className={styles.form__content}>
								{steps[currentStep - 1].content}
							</div>

							<div className={styles.form__control}>
								<FormButtons>
									{currentStep > 1 && (
										<Button
											key='prev'
											text='Назад'
											onClick={handlePrevStep}
											withIcon={{
												type: 'prev',
												position: 'left',
												color: 'black',
											}}
										/>
									)}
									{!isLastStep ? (
										<Button
											key='next'
											text='Далее'
											color='blue'
											onClick={handleNextStep}
											style={{ margin: '0 0 0 auto' }}
											withIcon={{
												type: 'next',
												position: 'right',
												color: 'white',
											}}
										/>
									) : (
										<Button
											key='submit'
											type='submit'
											text='Отправить заявку'
											color='blue'
											isBlock={isBlockSubmit || isLoading}
											style={{ margin: '0 0 0 auto' }}
											withIcon={{
												type: 'send',
												position: 'left',
												color: 'white',
											}}
										/>
									)}
								</FormButtons>
							</div>
						</Form>
					</Card>
				</div>
				<div className={styles.summary}>
					<Card title='Сводная информация' withHeightStretch>
						<ul className={styles.summary__list}>
							{summaryFields.map(({ title, value }) => (
								<li key={title} className={styles.summary__item}>
									<h5 className={styles.summary__title}>{title}</h5>
									<p className={styles.summary__text}>{value?.trim() || '—'}</p>
								</li>
							))}
						</ul>
					</Card>
				</div>
			</div>
		</div>
	);
};
