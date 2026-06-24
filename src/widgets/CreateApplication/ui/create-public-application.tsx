import type { FC, FormEvent } from 'react';
import type { ICreateAppForm } from '../types/types';
import type { IInstitute, ITag } from '../../../store/catalog/types';
import type { IAuthorCategory, ICompanyType } from '../../../shared/lib/lib';

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
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { Checkbox } from '../../../shared/components/Checkbox/ui/checkbox';
import { Link } from '../../../shared/components/Link/ui/link';

import {
	validationSchema,
	initialAppValues,
	requiredFieldsPublic,
	shouldBlockSubmit,
	formFieldPublicData,
} from '../lib/helpers';
import { createAppPublicAction } from '../../../store/application/actions';
import {
	getInstitutesAction,
	getExternalTagsAction,
} from '../../../store/catalog/actions';
import { authorCategories, companyTypes } from '../../../shared/lib/lib';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { EPAGESROUTES } from '../../../shared/utils/routes';

import styles from '../styles/create-public-application.module.scss';

export const CreatePublicApplication: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showToast } = useToast();

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
		if (!isBlockSubmit) {
			const appMainData = {
				...values,
				project_level: '',
				is_internal_customer: values.company_type?.id === 1,
				author_role:
					typeof values.author_role === 'object'
						? values.author_role.name
						: values.author_role,
				target_institutes: values.target_institutes.map((elem) => elem.code),
				tags: values.tags ? [values.tags.id] : [],
			};

			try {
				await dispatch(createAppPublicAction(appMainData)).unwrap();
				navigate(EPAGESROUTES.LOGIN, {
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

	const handleChangeCategories = (selected: IAuthorCategory | null) => {
		if (selected) {
			handleSelectChange('author_role', selected);
			if (selected.id === 1) {
				handleSelectChange('company_type', {
					id: 1,
					name: 'Внутренний заказчик',
				});
				handleSelectChange('company', 'РУТ (МИИТ)');
			} else {
				handleSelectChange('company_type', {
					id: 2,
					name: 'Внешний заказчик',
				});
				handleSelectChange('company', '');
			}
		}
	};

	const handleChangeCompanyType = (selected: ICompanyType | null) => {
		if (selected) {
			handleSelectChange('company_type', selected);
			if (selected.id === 1) {
				handleSelectChange('company', 'РУТ (МИИТ)');
			} else {
				handleSelectChange('company', '');
			}
		}
	};

	const handleChangeTags = (selected: ITag | null) => {
		handleSelectChange('tags', selected);
	};

	const handleChangePrivacyPerson = () => {
		handleCheckboxToggle('privacy_person');
	};

	const handleChangePrivacyOrg = () => {
		handleCheckboxToggle('privacy_org');
	};

	const handleNextStep = () => setCurrentStep((prev) => prev + 1);
	const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, requiredFieldsPublic, errors));
	}, [values, errors]);

	useEffect(() => {
		dispatch(getInstitutesAction());
		dispatch(getExternalTagsAction());
	}, [dispatch]);

	if (isLoadingCatalog) {
		return <Preloader />;
	}

	const steps = [
		{
			title: 'Шаг 1. Личные данные автора',
			subtitle: 'Введите ваши данные',
			content: (
				<>
					<FormField
						title={formFieldPublicData.author_lastname.title}
						fieldError={{
							text: errors.author_lastname || '',
							isShow: !!errors.author_lastname,
						}}>
						<FormInput
							name={formFieldPublicData.author_lastname.name}
							placeholder={formFieldPublicData.author_lastname.placeholder}
							value={values.author_lastname}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.author_firstname.title}
						fieldError={{
							text: errors.author_firstname || '',
							isShow: !!errors.author_firstname,
						}}>
						<FormInput
							name={formFieldPublicData.author_firstname.name}
							placeholder={formFieldPublicData.author_firstname.placeholder}
							value={values.author_firstname}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.author_middlename.title}
						fieldError={{
							text: errors.author_middlename || '',
							isShow: !!errors.author_middlename,
						}}>
						<FormInput
							name={formFieldPublicData.author_middlename.name}
							placeholder={formFieldPublicData.author_middlename.placeholder}
							value={values.author_middlename}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.author_email.title}
						fieldError={{
							text: errors.author_email || '',
							isShow: !!errors.author_email,
						}}>
						<FormInput
							name={formFieldPublicData.author_email.name}
							placeholder={formFieldPublicData.author_email.placeholder}
							value={values.author_email}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.author_phone.title}
						fieldError={{
							text: errors.author_phone || '',
							isShow: !!errors.author_phone,
						}}>
						<FormInput
							name={formFieldPublicData.author_phone.name}
							placeholder={formFieldPublicData.author_phone.placeholder}
							value={values.author_phone}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.author_role.title}
						fieldError={{
							text: errors.author_role || '',
							isShow: !!errors.author_role,
						}}>
						<Select
							placeholder='Выберите категорию автора..'
							options={authorCategories}
							currentOption={values.author_role}
							onChooseOption={handleChangeCategories}
							withClear={false}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.author_division.title}
						withInfo
						infoText={formFieldPublicData.author_division.info}
						fieldError={{
							text: errors.author_division || '',
							isShow: !!errors.author_division,
						}}>
						<FormInput
							name={formFieldPublicData.author_division.name}
							placeholder={formFieldPublicData.author_division.placeholder}
							value={values.author_division}
							onChange={handleChange}
						/>
					</FormField>
				</>
			),
		},
		{
			title: 'Шаг 2. О проекте',
			subtitle:
				'Укажите наименование проекта, сведения о заказчике и уровне проекта',
			content: (
				<>
					<FormField
						title={formFieldPublicData.company_type.title}
						withInfo
						infoText={formFieldPublicData.company_type.info}>
						<Select
							placeholder='Выберите тип заказчика..'
							options={companyTypes}
							currentOption={values.company_type}
							onChooseOption={handleChangeCompanyType}
							withClear={false}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.company.title}
						withInfo
						infoText={formFieldPublicData.company.info}
						fieldError={{
							text: errors.company || '',
							isShow: !!errors.company,
						}}>
						<FormInput
							name={formFieldPublicData.company.name}
							value={values.company}
							onChange={handleChange}
							placeholder={formFieldPublicData.company.placeholder}
							disabled={values.company_type?.id === 1}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.company_contacts.title}
						withInfo
						infoText={formFieldPublicData.company_contacts.info}
						fieldError={{
							text: errors.company_contacts || '',
							isShow: !!errors.company_contacts,
						}}>
						<FormTextarea
							name={formFieldPublicData.company_contacts.name}
							value={values.company_contacts}
							onChange={handleChange}
							placeholder={formFieldPublicData.company_contacts.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.target_institutes.title}
						withInfo
						infoText={formFieldPublicData.target_institutes.info}>
						<MultiSelect
							options={institutes}
							selectedOptions={values.target_institutes}
							valueKey='code'
							labelKey='name'
							onChange={handleChangeInstitute}
							listHeight='160'
						/>
					</FormField>
				</>
			),
		},
		{
			title: 'Шаг 3. Проблема',
			subtitle: 'Опишите проблему и препятствия, с которыми сталкиваетесь',
			content: (
				<>
					<FormField
						title={formFieldPublicData.problem_holder.title}
						withInfo
						infoText={formFieldPublicData.problem_holder.info}
						fieldError={{
							text: errors.problem_holder || '',
							isShow: !!errors.problem_holder,
						}}>
						<FormInput
							name={formFieldPublicData.problem_holder.name}
							value={values.problem_holder}
							onChange={handleChange}
							placeholder={formFieldPublicData.problem_holder.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.goal.title}
						withInfo
						infoText={formFieldPublicData.goal.info}
						fieldError={{
							text: errors.goal || '',
							isShow: !!errors.goal,
						}}>
						<FormTextarea
							name={formFieldPublicData.goal.name}
							value={values.goal}
							onChange={handleChange}
							placeholder={formFieldPublicData.goal.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.barrier.title}
						withInfo
						infoText={formFieldPublicData.barrier.info}
						fieldError={{
							text: errors.barrier || '',
							isShow: !!errors.barrier,
						}}>
						<FormTextarea
							name={formFieldPublicData.barrier.name}
							value={values.barrier}
							onChange={handleChange}
							placeholder={formFieldPublicData.barrier.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.existing_solutions.title}
						withInfo
						infoText={formFieldPublicData.existing_solutions.info}
						fieldError={{
							text: errors.existing_solutions || '',
							isShow: !!errors.existing_solutions,
						}}>
						<FormTextarea
							name={formFieldPublicData.existing_solutions.name}
							value={values.existing_solutions}
							onChange={handleChange}
							placeholder={formFieldPublicData.existing_solutions.placeholder}
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
						title={formFieldPublicData.tags.title}
						withInfo
						infoText={formFieldPublicData.tags.info}>
						<SelectWithSearch
							options={tags}
							currentOption={values.tags}
							onChooseOption={handleChangeTags}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.title.title}
						withInfo
						infoText={formFieldPublicData.title.info}
						fieldError={{
							text: errors.title || '',
							isShow: !!errors.title,
						}}>
						<FormInput
							name={formFieldPublicData.title.name}
							value={values.title}
							onChange={handleChange}
							placeholder={formFieldPublicData.title.placeholder}
						/>
					</FormField>
					<FormField
						title={formFieldPublicData.additional_materials.title}
						withInfo
						infoText={formFieldPublicData.additional_materials.info}
						fieldError={{
							text: errors.additional_materials || '',
							isShow: !!errors.additional_materials,
						}}>
						<FormTextarea
							name={formFieldPublicData.additional_materials.name}
							value={values.additional_materials}
							onChange={handleChange}
							placeholder={formFieldPublicData.additional_materials.placeholder}
						/>
					</FormField>
					<FormField title={formFieldPublicData.privacy_person.title}>
						<Checkbox
							checked={values.privacy_person}
							onChange={handleChangePrivacyPerson}>
							<div>
								Даю{' '}
								<Link
									text='согласие на обработку'
									path='https://pd.emiit.ru/privacy'
								/>{' '}
								своих персональных данных
							</div>
						</Checkbox>
					</FormField>
					<FormField title={formFieldPublicData.privacy_org.title}>
						<Checkbox
							checked={values.privacy_org}
							onChange={handleChangePrivacyOrg}>
							<div>
								Подтверждаю, что лично ознакомился(-ась) с{' '}
								<Link
									text='Положением об обработке персональных данных РУТ (МИИТ)'
									path='https://rut-miit.ru/org/privacy'
								/>{' '}
								и принимаю условия этого положения
							</div>
						</Checkbox>
					</FormField>
				</>
			),
		},
	];

	const summaryFields = [
		{ title: 'Организация-заказчик', value: values.company },
		{ title: 'Контактные данные заказчика', value: values.company_contacts },
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
		{
			title: 'Направление проекта',
			value: values.tags?.id === 0 ? '' : values.tags?.name ?? '',
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
							<Button
								text='Вернуться на главную'
								withIcon={{ type: 'back', color: 'black' }}
								onClick={() => navigate(-1)}
							/>
						</ul>
					</Card>
				</div>
			</div>
		</div>
	);
};
