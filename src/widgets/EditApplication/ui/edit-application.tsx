import type { FC, FormEvent } from 'react';
import type { IEditAppForm, IEditApplicationProps } from '../types/types';
import type { IInstitute, ITag } from '../../../store/catalog/types';
import type { IProjectLevel } from '../../../shared/lib/lib';
import type {
	IApplicationComment,
	IField,
} from '../../../store/application/types';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../store/store';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Button } from '../../../shared/components/Button/ui/button';
import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Card } from '../../../shared/components/Card/ui/card';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormTextarea,
} from '../../../shared/components/Form/components';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Select } from '../../../shared/components/Select/ui/select';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { MultiSelect } from '../../../shared/components/Select/ui/multi-select';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { ApplicationField } from './application-field';
import { ApplicationComments } from './application-comments';
import { DistributeApplication } from './distribute-application';

import {
	validationSchema,
	initialAppValues,
	shouldBlockSubmit,
} from '../lib/helpers';
import {
	approveAppAction,
	editAppAction,
	reworkAppAction,
	revokeAppAction,
	rejectAppAction,
	distributeAppAction,
} from '../../../store/coordination/actions';
import {
	getInstitutesAction,
	getTagsAction,
} from '../../../store/catalog/actions';
import { setCurrentField } from '../../../store/coordination/reducer';
import { projectLevels } from '../../../shared/lib/lib';
import { EMAINROUTES } from '../../../shared/utils/routes';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';

import styles from '../styles/edit-application.module.scss';

export const EditApplication: FC<IEditApplicationProps> = ({ status }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showToast } = useToast();

	const { user } = useSelector((state) => state.user);
	const { applicationDetail, currentField, isLoadingAction } = useSelector(
		(state) => state.coordination
	);
	const { institutes, tags, isLoadingCatalog } = useSelector(
		(state) => state.catalog
	);

	const [activeTab, setActiveTab] = useState('/description');
	const [isDistributeModalOpen, setIsDistributeModalOpen] =
		useState<boolean>(false);
	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(false);
	const { values, handleChange, handleSelectChange, errors, setValues } =
		useForm<IEditAppForm>(initialAppValues, validationSchema);

	const getCommentCount = (fieldName: string) => {
		return (
			applicationDetail?.comments?.filter(
				(comment: IApplicationComment) => comment.field === fieldName
			).length || 0
		);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isBlockSubmit && user && applicationDetail) {
			const appData = {
				...values,
				project_level:
					typeof values.project_level === 'object'
						? values.project_level.name
						: values.project_level,
				target_institutes: values.target_institutes.map((elem) => elem.code),
				tags: [values.tags.id],
			};

			try {
				await dispatch(
					editAppAction({ id: applicationDetail.id, data: appData })
				).unwrap();
				showToast({
					title: 'Заявка успешно сохранена!',
					text: `Заявка «${applicationDetail.title}» сохранена.`,
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Произошла ошибка при сохранении заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleApproveApp = async () => {
		if (user && applicationDetail) {
			try {
				await dispatch(
					approveAppAction({ applicationId: applicationDetail.id })
				).unwrap();
				navigate(
					`/${
						status === 'my-app' ? EMAINROUTES.MY_APPS : EMAINROUTES.COORDINATION
					}`
				);
				showToast({
					title: 'Заявка успешно согласована!',
					text: `Заявка «${applicationDetail.title}» согласована.`,
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Произошла ошибка при согласовании заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleDistributeApp = async (code: string) => {
		if (user && applicationDetail) {
			try {
				await dispatch(
					distributeAppAction({ applicationId: applicationDetail.id, code })
				).unwrap();
				closeModal();
				navigate(`/${EMAINROUTES.EXTERNAL_APPS}`, {
					replace: true,
				});
				showToast({
					title: 'Заявка успешно распределена!',
					text: `Заявка «${applicationDetail.title}» распределена.`,
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Произошла ошибка при распределении заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleReworkApp = async () => {
		if (user && applicationDetail) {
			try {
				await dispatch(
					reworkAppAction({ applicationId: applicationDetail.id })
				).unwrap();
				navigate(`/${EMAINROUTES.COORDINATION}`, {
					replace: true,
				});
				showToast({
					title: 'Заявка отправлена на доработку!',
					text: `Заявка «${applicationDetail.title}» отправлена на доработку.`,
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Произошла ошибка при отправке заявки на доработку!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleRevokeApp = async () => {
		if (user && applicationDetail) {
			try {
				await dispatch(
					revokeAppAction({ applicationId: applicationDetail.id })
				).unwrap();
				navigate(
					`/${
						status === 'my-app' ? EMAINROUTES.MY_APPS : EMAINROUTES.COORDINATION
					}`
				);
				showToast({
					title: 'Заявка отозвана!',
					text: `Заявка «${applicationDetail.title}» отозвана.`,
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Произошла ошибка при отзыве заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const handleRejectApp = async (reason: string) => {
		if (user && applicationDetail) {
			try {
				await dispatch(
					rejectAppAction({
						applicationId: applicationDetail.id,
						reason: reason,
					})
				).unwrap();
				navigate(`/${EMAINROUTES.COORDINATION}`, {
					replace: true,
				});
				showToast({
					title: 'Заявка успешно отклонена!',
					text: `Заявка «${applicationDetail.title}» отклонена.`,
					type: 'success',
				});
			} catch (err) {
				showToast({
					title: 'Произошла ошибка при отклонении заявки!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	const openDistributeModal = () => {
		setIsDistributeModalOpen(true);
	};

	const closeModal = () => {
		setIsDistributeModalOpen(false);
	};

	const handleChangeInstitute = (selected: IInstitute[]) => {
		handleSelectChange('target_institutes', selected);
	};

	const handleChangeLevel = (selected: IProjectLevel) => {
		handleSelectChange('project_level', selected);
	};

	const handleChangeTags = (selected: ITag) => {
		handleSelectChange('tags', selected);
	};

	const handleSelectField = (selected: IField) => {
		dispatch(setCurrentField(selected));
	};

	const hasAction = (actionName: string) =>
		applicationDetail?.available_actions.some((a) => a.action === actionName);

	useEffect(() => {
		dispatch(setCurrentField(null));
		dispatch(getInstitutesAction());
		dispatch(getTagsAction());
	}, [dispatch]);

	useEffect(() => {
		if (applicationDetail) {
			const levelOption = projectLevels.find(
				(level) => level.name === applicationDetail.project_level
			) || { id: 0, name: 'Выберите уровень..' };

			setValues({
				author_lastname: applicationDetail.author_lastname,
				author_firstname: applicationDetail.author_firstname,
				author_middlename: applicationDetail.author_middlename,
				author_email: applicationDetail.author_email,
				author_phone: applicationDetail.author_phone,
				author_role: applicationDetail.author_role,
				author_division: applicationDetail.author_division,
				company: applicationDetail.company || '',
				company_contacts: applicationDetail.company_contacts || '',
				project_level: levelOption,
				target_institutes: applicationDetail.target_institutes || [],
				problem_holder: applicationDetail.problem_holder || '',
				goal: applicationDetail.goal || '',
				barrier: applicationDetail.barrier || '',
				existing_solutions: applicationDetail.existing_solutions || '',
				context: applicationDetail.context || '',
				recommended_tools: applicationDetail.recommended_tools || '',
				stakeholders: applicationDetail.stakeholders || '',
				experts: applicationDetail.experts || '',
				tags: applicationDetail.tags[0],
				title: applicationDetail.title || '',
				additional_materials: applicationDetail.additional_materials || '',
			});
		}
	}, [applicationDetail, setValues]);

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors));
	}, [values, errors]);

	if (isLoadingCatalog) {
		return <Preloader />;
	}

	const tabs =
		status === 'external-app'
			? [
					{ path: '/person', label: 'Автор' },
					{ path: '/description', label: 'О проекте' },
					{ path: '/problem', label: 'Проблема' },
					{ path: '/context', label: 'Контекст' },
					{ path: '/additional', label: 'Дополнительно' },
			  ]
			: [
					{ path: '/description', label: 'О проекте' },
					{ path: '/problem', label: 'Проблема' },
					{ path: '/context', label: 'Контекст' },
					{ path: '/additional', label: 'Дополнительно' },
			  ];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Tabs
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={(path) => setActiveTab(path)}
				/>
				<Button
					text='Вернуться'
					withIcon={{ type: 'back', color: 'black' }}
					onClick={() => navigate(-1)}
				/>
			</div>

			<div className={styles.main}>
				<div className={styles.form}>
					<Card withHeightStretch>
						<Form
							name='form-edit-app'
							onSubmit={handleSubmit}
							formWidth='full'
							withHeightStretch>
							<div className={styles.form__content}>
								{activeTab === '/person' && (
									<>
										<FormField title='Фамилия'>
											<FormInput
												name='author_lastname'
												value={values.author_lastname}
												onChange={handleChange}
												disabled
											/>
										</FormField>
										<FormField title='Имя'>
											<FormInput
												name='author_firstname'
												value={values.author_firstname}
												onChange={handleChange}
												disabled
											/>
										</FormField>
										<FormField title='Отчество'>
											<FormInput
												name='author_middlename'
												value={values.author_middlename}
												onChange={handleChange}
												disabled
											/>
										</FormField>
										<FormField title='Электронная почта'>
											<FormInput
												name='author_email'
												value={values.author_email}
												onChange={handleChange}
												disabled
											/>
										</FormField>
										<FormField title='Мобильный телефон'>
											<FormInput
												name='author_phone'
												value={values.author_phone}
												onChange={handleChange}
												disabled
											/>
										</FormField>
										<FormField title='Категория автора'>
											<FormInput
												name='author_role'
												value={values.author_role}
												onChange={handleChange}
												disabled
											/>
										</FormField>
										<FormField title='Компания или подразделение'>
											<FormInput
												name='author_division'
												value={values.author_division}
												onChange={handleChange}
												disabled
											/>
										</FormField>
									</>
								)}
								{activeTab === '/description' && (
									<>
										<ApplicationField
											title='Наименование организации-заказчика'
											fieldCode='company'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormInput
												name='company'
												value={values.company}
												onChange={handleChange}
												placeholder='Введите наименование организации-заказчика'
											/>
										</ApplicationField>
										<ApplicationField
											title='Контактные данные представителя заказчика'
											fieldCode='company_contacts'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='company_contacts'
												value={values.company_contacts}
												onChange={handleChange}
												placeholder='Введите контактные данные'
											/>
										</ApplicationField>
										<ApplicationField
											title='Уровень проекта'
											fieldCode='project_level'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<Select
												options={projectLevels}
												currentOption={values.project_level}
												onChooseOption={handleChangeLevel}
											/>
										</ApplicationField>
										<ApplicationField
											title='Экспертам из какого института / академии обратить внимание'
											fieldCode='target_institutes'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<MultiSelect
												options={institutes}
												selectedOptions={values.target_institutes}
												valueKey='code'
												labelKey='name'
												onChange={handleChangeInstitute}
											/>
										</ApplicationField>
									</>
								)}
								{activeTab === '/problem' && (
									<>
										<ApplicationField
											title='Носитель проблемы'
											fieldCode='problem_holder'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormInput
												name='problem_holder'
												value={values.problem_holder}
												onChange={handleChange}
												placeholder='Введите носителя проблемы'
											/>
										</ApplicationField>
										<ApplicationField
											title='Цель'
											fieldCode='goal'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='goal'
												value={values.goal}
												onChange={handleChange}
												placeholder='Введите цель проекта'
											/>
										</ApplicationField>
										<ApplicationField
											title='Барьер'
											fieldCode='barrier'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='barrier'
												value={values.barrier}
												onChange={handleChange}
												placeholder='Что мешает решить проблему сейчас?'
											/>
										</ApplicationField>
										<ApplicationField
											title='Существующие решения'
											fieldCode='existing_solutions'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='existing_solutions'
												value={values.existing_solutions}
												onChange={handleChange}
												placeholder='Введите существующие решения'
											/>
										</ApplicationField>
									</>
								)}
								{activeTab === '/context' && (
									<>
										<ApplicationField
											title='Контекст проекта'
											fieldCode='context'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='context'
												value={values.context}
												onChange={handleChange}
												placeholder='Введите контекст проекта'
											/>
										</ApplicationField>
										<ApplicationField
											title='Другие заинтересованные стороны'
											fieldCode='stakeholders'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='stakeholders'
												value={values.stakeholders}
												onChange={handleChange}
												placeholder='Введите другие заинтересованные стороны'
											/>
										</ApplicationField>
										<ApplicationField
											title='Рекомендуемые инструменты / методы'
											fieldCode='recommended_tools'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='recommended_tools'
												value={values.recommended_tools}
												onChange={handleChange}
												placeholder='Введите рекомендуемые инструменты / методы'
											/>
										</ApplicationField>
										<ApplicationField
											title='Эксперты'
											fieldCode='experts'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='experts'
												value={values.experts}
												onChange={handleChange}
												placeholder='Введите экспертов'
											/>
										</ApplicationField>
									</>
								)}
								{activeTab === '/additional' && (
									<>
										<ApplicationField
											title='Направление проекта'
											fieldCode='tags'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<SelectWithSearch
												options={tags}
												currentOption={values.tags}
												onChooseOption={handleChangeTags}
											/>
										</ApplicationField>
										<ApplicationField
											title='Наименование проекта'
											fieldCode='title'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormInput
												name='title'
												value={values.title}
												onChange={handleChange}
												placeholder='Введите наименование проекта'
											/>
										</ApplicationField>
										<ApplicationField
											title='Дополнительные материалы'
											fieldCode='additional_materials'
											currentField={currentField}
											getCommentCount={getCommentCount}
											onSelectField={handleSelectField}>
											<FormTextarea
												name='additional_materials'
												value={values.additional_materials}
												onChange={handleChange}
												placeholder='Введите дополнительные материалы'
											/>
										</ApplicationField>
									</>
								)}
							</div>
							<div className={styles.form__control}>
								{hasAction('transfer_to_institute') && (
									<Button
										text='Распределить'
										color='purple'
										withIcon={{ type: 'send', color: 'white' }}
										onClick={openDistributeModal}
										isBlock={isLoadingAction}
									/>
								)}
								{hasAction('save_changes') && (
									<Button
										text='Сохранить'
										type='submit'
										color='green'
										withIcon={{ type: 'check', color: 'white' }}
										isBlock={isLoadingAction}
									/>
								)}
								{hasAction('approve') && (
									<Button
										text={status === 'my-app' ? 'Отправить' : 'Согласовать'}
										color='blue'
										withIcon={{ type: 'send', color: 'white' }}
										onClick={handleApproveApp}
										isBlock={isLoadingAction}
									/>
								)}
								{hasAction('return_by_author') && (
									<Button
										text='Отозвать'
										withIcon={{ type: 'return', color: 'black' }}
										onClick={handleRevokeApp}
										isBlock={isLoadingAction}
									/>
								)}
								{hasAction('request_changes') && (
									<Button
										text='Вернуть'
										withIcon={{ type: 'return', color: 'black' }}
										onClick={handleReworkApp}
										isBlock={isLoadingAction}
									/>
								)}
								{hasAction('reject') && (
									<Button
										text='Отклонить'
										color='red'
										withIcon={{ type: 'cancel', color: 'white' }}
										onClick={() => handleRejectApp('Test')}
										isBlock={isLoadingAction}
									/>
								)}
							</div>
						</Form>
					</Card>
				</div>
				<div className={styles.comments}>
					<Card withHeightStretch>
						<ApplicationComments />
					</Card>
				</div>
			</div>

			{isDistributeModalOpen && (
				<Modal
					isOpen={isDistributeModalOpen}
					onClose={closeModal}
					title='Распределение заявки'
					description='Выберите подразделение на которое хотите распределить заявку.'>
					<DistributeApplication onDistribute={handleDistributeApp} />
				</Modal>
			)}
		</div>
	);
};
