import type { FC, FormEvent } from 'react';
import type { TAuthMethod, TRegistrationStep } from '../types/types';
import type {
	IPreRegisteredStudent,
	IPreRegistrationLookupRequest,
} from '../../../store/user/types';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { PublicLayout } from '../../../shared/components/Layout/PublicLayout/ui/public-layout';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormInputStub,
	FormTextarea,
	FormButtons,
	FormLinks,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Select } from '../../../shared/components/Select/ui/select';

import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import {
	required,
	emailFormat,
	minLength,
	maxLength,
} from '../../../shared/lib/validationRules';
import { studentLinks, authMethods } from '../lib/helpers';
import {
	lookupStudentAction,
	registerStudentAction,
	reportStudentMismatchAction,
} from '../../../store/user/actions';

import styles from '../styles/registration.module.scss';

export const RegistrationStudent: FC = () => {
	const navigate = useNavigate();
	const { showToast } = useToast();
	const dispatch = useDispatch();

	const [isLookupLoading, setIsLookupLoading] = useState(false);
	const [isReportingError, setIsReportingError] = useState(false);
	const [reportComment, setReportComment] = useState('');
	const [isReportLoading, setIsReportLoading] = useState(false);

	const [step, setStep] = useState<TRegistrationStep>(1);

	const [authMethod, setAuthMethod] = useState<TAuthMethod>('personnel_number');
	const [authValue, setAuthValue] = useState('');

	const [student, setStudent] = useState<IPreRegisteredStudent | null>(null);

	const [email, setEmail] = useState('');
	const [emailTouched, setEmailTouched] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [authValueTouched, setAuthValueTouched] = useState(false);

	const selectedAuthMethod = authMethods.find(
		(method) => method.value === authMethod
	);

	const emailValidators = [required(), emailFormat()];

	const emailError = emailTouched
		? emailValidators
				.map((validator) =>
					validator.validate(email.trim()) ? '' : validator.errorMessage
				)
				.find(Boolean) || ''
		: '';

	const passwordValidators = [required(), minLength(8)];

	const passwordError = passwordTouched
		? passwordValidators
				.map((validator) =>
					validator.validate(password) ? '' : validator.errorMessage
				)
				.find(Boolean) || ''
		: '';

	const handleChangeAuthMethod = (value: TAuthMethod) => {
		setAuthMethod(value);
		setAuthValue('');
		setAuthValueTouched(false);
	};

	const handleChangeAuthValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAuthValue(e.target.value);
		setAuthValueTouched(true);
	};

	const getAuthValidators = () => {
		switch (authMethod) {
			case 'student_card':
				return [required(), minLength(8), maxLength(8)];

			case 'snils':
				return [required(), minLength(11), maxLength(11)];

			case 'personnel_number':
				return [required()];
		}
	};

	const authValueValidators = getAuthValidators();

	const authValueError = authValueTouched
		? authValueValidators
				.map((validator) =>
					validator.validate(authValue.trim()) ? '' : validator.errorMessage
				)
				.find(Boolean) || ''
		: '';

	const isStepOneBlocked = authValue.trim().length === 0 || !!authValueError;
	const isStepThreeBlocked =
		email.trim().length === 0 ||
		!!emailError ||
		password.length === 0 ||
		!!passwordError ||
		passwordRepeat.length === 0 ||
		password !== passwordRepeat;

	const getLookupData = (): IPreRegistrationLookupRequest => {
		switch (authMethod) {
			case 'student_card':
				return {
					student_card: authValue.trim(),
				};

			case 'personnel_number':
				return {
					personnel_number: authValue.trim(),
				};

			case 'snils':
				return {
					snils: authValue.trim(),
				};
		}
	};

	const handleLookupStudent = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setAuthValueTouched(true);

		const value = authValue.trim();

		if (!value) {
			showToast({
				title: 'Не заполнено поле',
				text: 'Введите данные для поиска.',
				type: 'error',
			});

			return;
		}

		if (authValueError) {
			showToast({
				title: 'Проверьте данные',
				text: authValueError,
				type: 'error',
			});

			return;
		}

		setIsLookupLoading(true);

		try {
			const result = await dispatch(
				lookupStudentAction(getLookupData())
			).unwrap();

			if (result.is_registered) {
				showToast({
					title: 'Пользователь уже зарегистрирован',
					text: 'Пользователь с указанными данными уже зарегистрирован в системе.',
					type: 'error',
				});

				return;
			}

			setStudent(result);
			setStep(2);
		} catch (error) {
			showToast({
				title: 'Не удалось найти пользователя',
				text: getErrorMessage(error),
				type: 'error',
			});
		} finally {
			setIsLookupLoading(false);
		}
	};

	const handleConfirmStudent = () => {
		if (!student) {
			return;
		}

		setStep(3);
	};

	const handleReportMismatch = () => {
		setIsReportingError(true);
		setReportComment('');
	};

	const handleSubmitReportMismatch = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!student) {
			return;
		}

		const comment = reportComment.trim();

		if (!comment) {
			showToast({
				title: 'Не заполнено поле',
				text: 'Опишите проблему.',
				type: 'error',
			});

			return;
		}

		setIsReportLoading(true);

		try {
			await dispatch(
				reportStudentMismatchAction({
					id: student.id,
					comment,
				})
			).unwrap();

			showToast({
				title: 'Сообщение отправлено',
				text: 'Сообщение отправлено администратору.',
				type: 'success',
			});

			setIsReportingError(false);
			setReportComment('');
			setStudent(null);
			setAuthValue('');
			setAuthValueTouched(false);
			setStep(1);
		} catch (error) {
			showToast({
				title: 'Не удалось отправить сообщение',
				text: getErrorMessage(error),
				type: 'error',
			});
		} finally {
			setIsReportLoading(false);
		}
	};

	const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setEmailTouched(true);

		if (isStepThreeBlocked) {
			showToast({
				title: 'Проверьте данные',
				text: 'Заполните все поля и убедитесь, что пароли совпадают.',
				type: 'error',
			});

			return;
		}

		if (!student) {
			showToast({
				title: 'Ошибка регистрации',
				text: 'Не удалось определить данные пользователя.',
				type: 'error',
			});

			return;
		}

		try {
			await dispatch(
				registerStudentAction({
					id: student.id,
					email: email.trim(),
					password,
				})
			).unwrap();

			showToast({
				title: 'Регистрация завершена',
				text: 'Вы успешно зарегистрированы.',
				type: 'success',
			});

			navigate('/');
		} catch (error) {
			showToast({
				title: 'Не удалось зарегистрироваться',
				text: getErrorMessage(error),
				type: 'error',
			});
		}
	};

	const handleBackToStepOne = () => {
		setStudent(null);
		setStep(1);
	};

	const handleBackToStepTwo = () => {
		setStep(2);
	};

	useEffect(() => {
		setEmail('');
		setEmailTouched(false);
		setPassword('');
		setPasswordTouched(false);
		setPasswordRepeat('');
	}, [step]);

	return (
		<PublicLayout>
			<main className={styles.container}>
				{step === 1 && (
					<Form
						name='form-registration-student-identification'
						onSubmit={handleLookupStudent}
						title='Регистрация пользователя'
						subtitle='Для регистрации в системе необходимо найти ваши данные в базе РУТ (МИИТ). Выберите один из способов идентификации и введите соответствующие данные.'
						titleAlign='left'>
						<FormField
							title='Способ идентификации'
							withInfo
							infoText='Выберите способ идентификации который вам удобен'>
							<Select
								options={authMethods}
								currentOption={selectedAuthMethod ?? null}
								onChooseOption={(option) => {
									if (option) {
										handleChangeAuthMethod(option.value);
									}
								}}
								placeholder='Выберите способ идентификации'
								valueKey='value'
								labelKey='label'
								withClear={false}
							/>
						</FormField>

						<FormField
							title={selectedAuthMethod?.label ?? 'Данные'}
							withInfo
							infoText={selectedAuthMethod?.info}
							fieldError={{
								text: authValueError,
								isShow: !!authValueError,
							}}>
							<FormInput
								name='authValue'
								placeholder={selectedAuthMethod?.placeholder ?? ''}
								value={authValue}
								onChange={handleChangeAuthValue}
							/>
						</FormField>

						<FormButtons>
							<Button
								type='submit'
								text={isLookupLoading ? 'Поиск...' : 'Продолжить'}
								color='blue'
								width='full'
								isBlock={isStepOneBlocked || isLookupLoading}
							/>
						</FormButtons>
						<FormLinks links={studentLinks} />
					</Form>
				)}

				{step === 2 && student && (
					<Form
						name='form-registration-student-confirm'
						onSubmit={
							isReportingError
								? handleSubmitReportMismatch
								: (e) => {
										e.preventDefault();
										handleConfirmStudent();
								  }
						}
						title={isReportingError ? 'Сообщить об ошибке' : 'Проверьте данные'}
						subtitle={
							isReportingError
								? 'Опишите, какие данные указаны неверно.'
								: 'Мы нашли следующие данные. Убедитесь, что они принадлежат вам.'
						}
						titleAlign='left'>
						{!isReportingError ? (
							<>
								<FormField title='Фамилия'>
									<FormInputStub value={student.last_name} />
								</FormField>

								<FormField title='Имя'>
									<FormInputStub value={student.first_name} />
								</FormField>

								<FormField title='Отчество'>
									<FormInputStub value={student.middle_name} />
								</FormField>

								<FormField title='Учебная группа'>
									<FormInputStub value={student.group_name} />
								</FormField>

								<FormField title='Студенческий билет'>
									<FormInputStub value={student.student_card} />
								</FormField>

								<FormButtons>
									<Button
										type='button'
										text='Назад'
										color='cancel'
										onClick={handleBackToStepOne}
									/>

									<Button
										type='button'
										text='Сообщить об ошибке'
										color='red'
										onClick={handleReportMismatch}
									/>

									<Button type='submit' text='Продолжить' color='blue' />
								</FormButtons>
							</>
						) : (
							<>
								<FormField title='Описание проблемы'>
									<FormTextarea
										name='reportComment'
										placeholder='Например: не та группа, я учусь на другом направлении'
										value={reportComment}
										onChange={(e) => setReportComment(e.target.value)}
									/>
								</FormField>

								<FormButtons>
									<Button
										type='button'
										text='Назад'
										color='cancel'
										onClick={() => {
											setIsReportingError(false);
											setReportComment('');
										}}
									/>

									<Button
										type='submit'
										text={
											isReportLoading ? 'Отправка...' : 'Отправить сообщение'
										}
										color='blue'
										isBlock={
											isReportLoading || reportComment.trim().length === 0
										}
									/>
								</FormButtons>
							</>
						)}
					</Form>
				)}

				{step === 3 && student && (
					<Form
						name='form-registration-student-account'
						onSubmit={handleRegister}
						title='Создайте аккаунт'
						subtitle={`Добро пожаловать, ${student.first_name}! Осталось указать данные для входа.`}
						autoComplete='off'
						titleAlign='left'>
						<FormField
							title='Электронная почта'
							fieldError={{
								text: emailError,
								isShow: !!emailError,
							}}>
							<FormInput
								name='email'
								type='text'
								placeholder='Ваша электронная почта'
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setEmailTouched(true);
								}}
							/>
						</FormField>

						<FormField
							title='Пароль'
							fieldError={{
								text: passwordError,
								isShow: !!passwordError,
							}}>
							<FormInput
								name='password'
								type='password'
								placeholder='Придумайте пароль'
								autoComplete='new-password'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setPasswordTouched(true);
								}}
							/>
						</FormField>

						<FormField
							title='Подтверждение пароля'
							fieldError={{
								text:
									passwordRepeat.length > 0 && password !== passwordRepeat
										? 'Пароли не совпадают'
										: '',
								isShow:
									passwordRepeat.length > 0 && password !== passwordRepeat,
							}}>
							<FormInput
								name='passwordRepeat'
								type='password'
								placeholder='Повторите пароль'
								value={passwordRepeat}
								onChange={(e) => {
									setPasswordRepeat(e.target.value);
								}}
							/>
						</FormField>

						<FormButtons>
							<Button
								type='button'
								text='Назад'
								color='cancel'
								onClick={handleBackToStepTwo}
							/>

							<Button
								type='submit'
								text='Зарегистрироваться'
								color='blue'
								isBlock={isStepThreeBlocked}
							/>
						</FormButtons>
					</Form>
				)}
			</main>
		</PublicLayout>
	);
};
