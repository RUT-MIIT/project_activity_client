import type { FC, FormEvent } from 'react';
import type { ICreateAppForm } from '../types/types';
import type { IInstitute, ITag } from '../../../store/catalog/types';
import type { IProjectLevel, ICompanyType } from '../../../shared/lib/lib';

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
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Checkbox } from '../../../shared/components/Checkbox/ui/checkbox';

import {
	validationSchema,
	initialAppValues,
	shouldBlockSubmit,
	formFieldMainData,
} from '../lib/helpers';
import { createAppMainAction } from '../../../store/application/actions';
import {
	getInstitutesAction,
	getTagsAction,
} from '../../../store/catalog/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { projectLevels, companyTypes } from '../../../shared/lib/lib';
import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/create-main-application.module.scss';

export const CreateMainApplication: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { user } = useSelector((state) => state.user);
	const { institutes, tags, isLoadingCatalog } = useSelector(
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
	} = useForm<ICreateAppForm>(initialAppValues, validationSchema);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isBlockSubmit && user) {
			const appMainData = {
				author: user.id,
				...values,
				author_firstname: user.first_name,
				author_middlename: user.middle_name,
				author_lastname: user.last_name,
				author_phone: user.phone,
				author_email: user.email,
				author_role: user.role,
				author_division: user.department.name,
				is_internal_customer: values.company_type.id === 1 ? true : false,
				project_level:
					typeof values.project_level === 'object'
						? values.project_level.name
						: values.project_level,
				target_institutes: values.target_institutes.map((elem) => elem.code),
				tags: [values.tags.id],
			};

			try {
				await dispatch(createAppMainAction(appMainData)).unwrap();
				navigate(`/${EMAINROUTES.MY_APPS}`, {
					replace: true,
				});
				showToast({
					title: 'Заявка отправлена на рассмотрение!',
					text: `Заявка «${values.title}» отправлена. Ожидайте решения по заявке.`,
					type: 'success',
				});
			} catch (err) {
				console.log(err);
				showToast({
					title: 'Произошла ошибка при отправки заявки!',
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

	const handleChangeCompanyType = (selected: ICompanyType) => {
		handleSelectChange('company_type', selected);
		if (selected.id === 1) {
			handleSelectChange('company', 'РУТ (МИИТ)');
		} else {
			handleSelectChange('company', '');
		}
	};

	const handleChangeTags = (selected: ITag) => {
		handleSelectChange('tags', selected);
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
		dispatch(getTagsAction());
	}, [dispatch]);

	if (isLoadingCatalog) {
		return <Preloader />;
	}

	const steps = [
		{
			title: 'Шаг 1. О проекте',
			subtitle: 'Укажите сведения о заказчике и уровне проекта',
			content: (
				<>
					<FormField
						title={formFieldMainData.company_type.title}
						withInfo
						infoText={formFieldMainData.company_type.info}>
						<Select
							options={companyTypes}
							currentOption={values.company_type}
							onChooseOption={handleChangeCompanyType}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.company.title}
						withInfo
						infoText={formFieldMainData.company.info}>
						<FormInput
							name={formFieldMainData.company.name}
							value={values.company}
							onChange={handleChange}
							placeholder={formFieldMainData.company.placeholder}
							disabled={values.company_type.id === 1}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.company_contacts.title}
						withInfo
						infoText={formFieldMainData.company_contacts.info}>
						<FormTextarea
							name={formFieldMainData.company_contacts.name}
							value={values.company_contacts}
							onChange={handleChange}
							placeholder={formFieldMainData.company_contacts.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.project_level.title}
						withInfo
						infoText={formFieldMainData.project_level.info}>
						<Select
							options={projectLevels}
							currentOption={values.project_level}
							onChooseOption={handleChangeLevel}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.target_institutes.title}
						withInfo
						infoText={formFieldMainData.target_institutes.info}>
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
			subtitle: 'Опишите проблему и препятствия, с которыми сталкиваетесь',
			content: (
				<>
					<FormField
						title={formFieldMainData.problem_holder.title}
						withInfo
						infoText={formFieldMainData.problem_holder.info}>
						<FormInput
							name={formFieldMainData.problem_holder.name}
							value={values.problem_holder}
							onChange={handleChange}
							placeholder={formFieldMainData.problem_holder.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.goal.title}
						withInfo
						infoText={formFieldMainData.goal.info}>
						<FormTextarea
							name={formFieldMainData.goal.name}
							value={values.goal}
							onChange={handleChange}
							placeholder={formFieldMainData.goal.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.barrier.title}
						withInfo
						infoText={formFieldMainData.barrier.info}>
						<FormTextarea
							name={formFieldMainData.barrier.name}
							value={values.barrier}
							onChange={handleChange}
							placeholder={formFieldMainData.barrier.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.existing_solutions.title}
						withInfo
						infoText={formFieldMainData.existing_solutions.info}>
						<FormTextarea
							name={formFieldMainData.existing_solutions.name}
							value={values.existing_solutions}
							onChange={handleChange}
							placeholder={formFieldMainData.existing_solutions.placeholder}
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
						title={formFieldMainData.context.title}
						withInfo
						infoText={formFieldMainData.context.info}>
						<FormTextarea
							name={formFieldMainData.context.name}
							value={values.context}
							onChange={handleChange}
							placeholder={formFieldMainData.context.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.stakeholders.title}
						withInfo
						infoText={formFieldMainData.stakeholders.info}>
						<FormTextarea
							name={formFieldMainData.stakeholders.name}
							value={values.stakeholders}
							onChange={handleChange}
							placeholder={formFieldMainData.stakeholders.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.recommended_tools.title}
						withInfo
						infoText={formFieldMainData.recommended_tools.info}>
						<FormTextarea
							name={formFieldMainData.recommended_tools.name}
							value={values.recommended_tools}
							onChange={handleChange}
							placeholder={formFieldMainData.recommended_tools.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.experts.title}
						withInfo
						infoText={formFieldMainData.experts.info}>
						<FormTextarea
							name={formFieldMainData.experts.name}
							value={values.experts}
							onChange={handleChange}
							placeholder={formFieldMainData.experts.placeholder}
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
						title={formFieldMainData.tags.title}
						withInfo
						infoText={formFieldMainData.tags.info}>
						<SelectWithSearch
							options={tags}
							currentOption={values.tags}
							onChooseOption={handleChangeTags}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.title.title}
						withInfo
						infoText={formFieldMainData.title.info}>
						<FormInput
							name={formFieldMainData.title.name}
							value={values.title}
							onChange={handleChange}
							placeholder={formFieldMainData.title.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.additional_materials.title}
						withInfo
						infoText={formFieldMainData.additional_materials.info}>
						<FormTextarea
							name={formFieldMainData.additional_materials.name}
							value={values.additional_materials}
							onChange={handleChange}
							placeholder={formFieldMainData.additional_materials.placeholder}
						/>
					</FormField>
					<FormField title={formFieldMainData.needs_consultation.title}>
						<Checkbox
							checked={values.needs_consultation}
							label={formFieldMainData.needs_consultation.placeholder}
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
		{ title: 'Другие заинтересованные стороны', value: values.stakeholders },
		{
			title: 'Рекомендуемые инструменты / методы',
			value: values.recommended_tools,
		},
		{ title: 'Эксперты', value: values.experts },
		{
			title: 'Направление проекта',
			value: values.tags.id === 0 ? '' : values.tags.name,
		},
		{ title: 'Наименование проекта', value: values.title },
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
