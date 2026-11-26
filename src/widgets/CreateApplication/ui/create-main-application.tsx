import type { FC, FormEvent } from 'react';
import type { ICreateAppForm } from '../types/types';
import type { IInstitute, ITag } from '../../../store/catalog/types';
import type {
	IProjectLevel,
	ICompanyType,
	IApplicationKind,
} from '../../../shared/lib/lib';

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
	FormInputNumber,
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
	requiredFieldsMain,
	getRequiredFieldsByKind,
	shouldBlockSubmit,
	formFieldMainData,
} from '../lib/helpers';
import { createAppMainAction } from '../../../store/application/actions';
import {
	getInstitutesAction,
	getTagsAction,
} from '../../../store/catalog/actions';
import { getMyDivisionPlansAction } from '../../../store/structure/actions';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import {
	projectLevels,
	companyTypes,
	applicationKinds,
	getApplicationKindPayload,
	isInternalCustomer,
} from '../../../shared/lib/lib';
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
	const { currentSemester, divisionsPlans } = useSelector(
		(state) => state.structure
	);
	const isInstituteValidator = user?.role === 'institute_validator';
	const instituteId = user?.institute?.id ?? user?.department.id;
	const instituteName =
		user?.institute?.name ?? user?.department.name ?? 'Институт';
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
			const {
				application_kind,
				problem_holder,
				goal,
				barrier,
				existing_solutions,
				case_description,
				main_department,
				company_type,
				...formValues
			} = values;
			const appMainData = {
				author: user.id,
				...formValues,

				author_firstname: user.first_name,
				author_middlename: user.middle_name,
				author_lastname: user.last_name,
				author_phone: user.phone,
				author_email: user.email,
				author_role: user.role,
				author_division: user.department.name,

				customer_type: company_type?.id ?? 'internal',

				project_level: values.project_level?.name ?? '',

				target_institutes: values.target_institutes.map((elem) => elem.code),

				tags: values.tags ? [values.tags.id] : [],
				main_department_id: isInstituteValidator
					? main_department?.id ?? user.institute?.id ?? user.department.id
					: user.department.id,
				...getApplicationKindPayload(application_kind?.id, {
					problem_holder,
					goal,
					barrier,
					existing_solutions,
					case_description,
				}),
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
					title: 'Произошла ошибка при отправке заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleChangeInstitute = (selected: IInstitute[]) => {
		handleSelectChange('target_institutes', selected);
	};

	const handleChangeLevel = (selected: IProjectLevel | null) => {
		handleSelectChange('project_level', selected);
	};

	const handleChangeApplicationKind = (selected: IApplicationKind | null) => {
		if (!selected) {
			return;
		}

		handleSelectChange('application_kind', selected);
	};

	const handleChangeCompanyType = (selected: ICompanyType | null) => {
		if (!selected) {
			return;
		}
		handleSelectChange('company_type', selected);
		if (isInternalCustomer(selected.id)) {
			handleSelectChange('company', 'РУТ (МИИТ)');
		} else {
			handleSelectChange('company', '');
		}
	};

	const handleChangeTags = (selected: ITag | null) => {
		handleSelectChange('tags', selected);
	};

	const handleChangeMainDepartment = (
		selected: { id: number; name: string } | null
	) => {
		if (!selected) {
			return;
		}

		handleSelectChange('main_department', selected);
	};

	const handleChangeCheckBox = (name: keyof ICreateAppForm) => {
		handleCheckboxToggle(name);
	};

	const handleNextStep = () => setCurrentStep((prev) => prev + 1);
	const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

	useEffect(() => {
		setIsBlockSubmit(
			shouldBlockSubmit(
				values,
				getRequiredFieldsByKind(
					requiredFieldsMain,
					values.application_kind?.id
				),
				errors
			)
		);
	}, [values, errors]);

	useEffect(() => {
		dispatch(getInstitutesAction());
		dispatch(getTagsAction());
	}, [dispatch]);

	useEffect(() => {
		if (isInstituteValidator && currentSemester && user?.institute_code) {
			dispatch(
				getMyDivisionPlansAction({
					semesterId: currentSemester.id,
					divisionCode: user.institute_code,
				})
			);
		}
	}, [currentSemester, dispatch, isInstituteValidator, user?.institute_code]);

	if (isLoadingCatalog) {
		return <Preloader />;
	}

	const instituteOption = {
		id: instituteId ?? 0,
		name: instituteName,
	};
	const departmentOptions = [
		instituteOption,
		...divisionsPlans
			.filter(
				(elem) =>
					elem.department_id !== instituteId && elem.department_name !== 'ЦПДС'
			)
			.map((elem) => ({
				id: elem.department_id,
				name: elem.department_short_name
					? `${elem.department_name} (${elem.department_short_name})`
					: elem.department_name,
			})),
	];

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
							placeholder='Выберите тип заказчика..'
							options={companyTypes}
							currentOption={values.company_type}
							onChooseOption={handleChangeCompanyType}
							withClear={false}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.company.title}
						withInfo
						infoText={formFieldMainData.company.info}
						fieldError={{
							text: errors.company || '',
							isShow: !!errors.company,
						}}>
						<FormInput
							name={formFieldMainData.company.name}
							value={values.company}
							onChange={handleChange}
							placeholder={formFieldMainData.company.placeholder}
							disabled={isInternalCustomer(values.company_type?.id)}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.company_contacts.title}
						withInfo
						infoText={formFieldMainData.company_contacts.info}
						fieldError={{
							text: errors.company_contacts || '',
							isShow: !!errors.company_contacts,
						}}>
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
							placeholder='Выберите уровень..'
							options={projectLevels}
							currentOption={values.project_level}
							onChooseOption={handleChangeLevel}
							withClear={false}
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
			subtitle:
				values.application_kind?.id === 'case'
					? 'Опишите ситуацию'
					: 'Опишите проблему и препятствия, с которыми сталкиваетесь',
			content: (
				<>
					<FormField
						title={formFieldMainData.application_kind.title}
						withInfo
						infoText={formFieldMainData.application_kind.info}>
						<Select
							placeholder='Выберите тип заявки..'
							options={applicationKinds}
							currentOption={values.application_kind}
							onChooseOption={handleChangeApplicationKind}
							withClear={false}
						/>
					</FormField>
					{values.application_kind?.id === 'case' ? (
						<FormField
							title={formFieldMainData.case_description.title}
							withInfo
							infoText={formFieldMainData.case_description.info}
							fieldError={{
								text: errors.case_description || '',
								isShow: !!errors.case_description,
							}}>
							<FormTextarea
								name={formFieldMainData.case_description.name}
								value={values.case_description}
								onChange={handleChange}
								placeholder={formFieldMainData.case_description.placeholder}
							/>
						</FormField>
					) : (
						<>
							<FormField
								title={formFieldMainData.problem_holder.title}
								withInfo
								infoText={formFieldMainData.problem_holder.info}
								fieldError={{
									text: errors.problem_holder || '',
									isShow: !!errors.problem_holder,
								}}>
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
								infoText={formFieldMainData.goal.info}
								fieldError={{
									text: errors.goal || '',
									isShow: !!errors.goal,
								}}>
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
								infoText={formFieldMainData.barrier.info}
								fieldError={{
									text: errors.barrier || '',
									isShow: !!errors.barrier,
								}}>
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
								infoText={formFieldMainData.existing_solutions.info}
								fieldError={{
									text: errors.existing_solutions || '',
									isShow: !!errors.existing_solutions,
								}}>
								<FormTextarea
									name={formFieldMainData.existing_solutions.name}
									value={values.existing_solutions}
									onChange={handleChange}
									placeholder={formFieldMainData.existing_solutions.placeholder}
								/>
							</FormField>
						</>
					)}
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
						infoText={formFieldMainData.context.info}
						fieldError={{
							text: errors.context || '',
							isShow: !!errors.context,
						}}>
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
						infoText={formFieldMainData.stakeholders.info}
						fieldError={{
							text: errors.stakeholders || '',
							isShow: !!errors.stakeholders,
						}}>
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
						infoText={formFieldMainData.recommended_tools.info}
						fieldError={{
							text: errors.recommended_tools || '',
							isShow: !!errors.recommended_tools,
						}}>
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
						infoText={formFieldMainData.experts.info}
						fieldError={{
							text: errors.experts || '',
							isShow: !!errors.experts,
						}}>
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
					{isInstituteValidator && (
						<FormField
							title={formFieldMainData.main_department.title}
							withInfo
							infoText={formFieldMainData.main_department.info}>
							<Select
								placeholder={formFieldMainData.main_department.placeholder}
								options={departmentOptions}
								currentOption={values.main_department ?? instituteOption}
								onChooseOption={handleChangeMainDepartment}
								withClear={false}
							/>
						</FormField>
					)}
					<FormField
						title={formFieldMainData.tags.title}
						withInfo
						infoText={formFieldMainData.tags.info}>
						<SelectWithSearch
							placeholder='Выберите направление..'
							options={tags}
							currentOption={values.tags}
							onChooseOption={handleChangeTags}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.title.title}
						withInfo
						infoText={formFieldMainData.title.info}
						fieldError={{
							text: errors.title || '',
							isShow: !!errors.title,
						}}>
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
						infoText={formFieldMainData.additional_materials.info}
						fieldError={{
							text: errors.additional_materials || '',
							isShow: !!errors.additional_materials,
						}}>
						<FormTextarea
							name={formFieldMainData.additional_materials.name}
							value={values.additional_materials}
							onChange={handleChange}
							placeholder={formFieldMainData.additional_materials.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.track_composer_comment.title}
						withInfo
						infoText={formFieldMainData.track_composer_comment.info}
						fieldError={{
							text: errors.track_composer_comment || '',
							isShow: !!errors.track_composer_comment,
						}}>
						<FormTextarea
							name={formFieldMainData.track_composer_comment.name}
							value={values.track_composer_comment}
							onChange={handleChange}
							placeholder={formFieldMainData.track_composer_comment.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldMainData.recommended_teams_count.title}
						withInfo
						infoText={formFieldMainData.recommended_teams_count.info}
						fieldError={{
							text: errors.recommended_teams_count || '',
							isShow: !!errors.recommended_teams_count,
						}}>
						<FormInputNumber
							name={formFieldMainData.recommended_teams_count.name}
							value={values.recommended_teams_count}
							onChange={handleChange}
							placeholder={
								formFieldMainData.recommended_teams_count.placeholder
							}
						/>
					</FormField>
					<FormField title={formFieldMainData.is_continuing.title}>
						<Checkbox
							checked={values.is_continuing}
							label={formFieldMainData.is_continuing.placeholder}
							onChange={() => handleChangeCheckBox('is_continuing')}
						/>
					</FormField>
					<FormField title={formFieldMainData.needs_consultation.title}>
						<Checkbox
							checked={values.needs_consultation}
							label={formFieldMainData.needs_consultation.placeholder}
							onChange={() => handleChangeCheckBox('needs_consultation')}
						/>
					</FormField>
				</>
			),
		},
	];

	const summaryFields = [
		{ title: 'Организация-заказчик*', value: values.company },
		{ title: 'Контактные данные заказчика*', value: values.company_contacts },
		{
			title: 'Уровень проекта*',
			value:
				values.project_level?.id === 0 ? '' : values.project_level?.name ?? '',
		},
		{
			title: 'Институт / академия',
			value:
				values.target_institutes.length > 0
					? values.target_institutes.map((elem) => elem.name).join(', ')
					: '',
		},
		{
			title: 'Тип заявки*',
			value: values.application_kind?.name ?? '',
		},
		...(values.application_kind?.id === 'case'
			? [{ title: 'Описание*', value: values.case_description }]
			: [
					{ title: 'Носитель проблемы*', value: values.problem_holder },
					{ title: 'Цель*', value: values.goal },
					{ title: 'Барьер*', value: values.barrier },
					{
						title: 'Существующие решения*',
						value: values.existing_solutions,
					},
			  ]),
		{ title: 'Контекст проекта*', value: values.context },
		{ title: 'Другие заинтересованные стороны', value: values.stakeholders },
		{
			title: 'Рекомендуемые инструменты / методы',
			value: values.recommended_tools,
		},
		{ title: 'Эксперты', value: values.experts },
		...(isInstituteValidator
			? [
					{
						title: 'Подразделение заявки*',
						value: values.main_department?.name ?? '',
					},
			  ]
			: []),
		{
			title: 'Направление проекта',
			value: values.tags?.id === 0 ? '' : values.tags?.name ?? '',
		},
		{ title: 'Наименование проекта*', value: values.title },
		{
			title: 'Рекомендуемое число команд на проект*',
			value: values.recommended_teams_count,
		},
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
									<p className={styles.summary__text}>
										{value?.toString().trim() || '—'}
									</p>
								</li>
							))}
						</ul>
					</Card>
				</div>
			</div>
		</div>
	);
};
