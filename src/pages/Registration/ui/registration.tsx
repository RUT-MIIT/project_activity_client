import type { FC, FormEvent } from 'react';
import type { IRegistrationForm } from '../types/types';
import type { IDepartment } from '../../../store/catalog/types';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../store/store';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { PublicLayout } from '../../../shared/components/Layout/PublicLayout/ui/public-layout';
import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
	FormTextarea,
	FormButtons,
	FormLinks,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { SelectWithSearch } from '../../../shared/components/Select/ui/select-with-search';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';

import {
	links,
	initialRegistrationValues,
	validationSchema,
	shouldBlockSubmit,
} from '../lib/helpers';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { EPAGESROUTES } from '../../../shared/utils/routes';

import { registerUser } from '../../../store/user/actions';
import { getDepartmentsAction } from '../../../store/catalog/actions';

import styles from '../styles/registration.module.scss';

export const Registration: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { isLoading } = useSelector((state) => state.user);
	const { isLoadingCatalog, departments } = useSelector(
		(state) => state.catalog
	);

	const [department, setDepartment] = useState<IDepartment | null>(null);
	const { values, handleChange, errors } = useForm<IRegistrationForm>(
		initialRegistrationValues,
		validationSchema
	);

	const [isBlockSubmit, setIsBlockSubmit] = useState<boolean>(true);

	const handleChangeDepartment = (selected: IDepartment) => {
		setDepartment(selected);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isBlockSubmit && department) {
			const registrationData = {
				email: values.email,
				first_name: values.firstName,
				last_name: values.lastName,
				middle_name: values.middleName,
				phone: values.phone,
				comment: values.comment,
				department: department.id,
			};

			try {
				await dispatch(registerUser(registrationData)).unwrap();
				showToast({
					title: 'Заявка на регистрацию успешно отправлена!',
					text: 'После одобрения вашей заявки администратором системы вы получите данные для входа на электронную почту.',
					type: 'success',
				});
				// Можно редиректить на login, если нужно
				navigate(EPAGESROUTES.LOGIN, { replace: true });
			} catch (err) {
				console.error(err);
				showToast({
					title: 'Ошибка при регистрации!',
					text: getErrorMessage(err),
					type: 'error',
				});
			}
		}
	};

	useEffect(() => {
		setIsBlockSubmit(shouldBlockSubmit(values, errors, department));
	}, [values, errors, department]);

	useEffect(() => {
		dispatch(getDepartmentsAction());
	}, [dispatch]);

	if (isLoadingCatalog) {
		return <Preloader />;
	}

	return (
		<PublicLayout>
			<main className={styles.container}>
				<Form
					name='form-registration'
					onSubmit={handleSubmit}
					title='Присоединяйтесь к проектам!'
					subtitle='Зарегистрируйтесь, чтобы начать участие в проектной деятельности'
					titleAlign='left'>
					<FormField
						title='Фамилия'
						fieldError={{
							text: errors.lastName || '',
							isShow: !!errors.lastName,
						}}>
						<FormInput
							name='lastName'
							placeholder='Ваша фамилия'
							value={values.lastName}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title='Имя'
						fieldError={{
							text: errors.firstName || '',
							isShow: !!errors.firstName,
						}}>
						<FormInput
							name='firstName'
							placeholder='Ваше имя'
							value={values.firstName}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title='Отчество'
						fieldError={{
							text: errors.middleName || '',
							isShow: !!errors.middleName,
						}}>
						<FormInput
							name='middleName'
							placeholder='Ваше отчество'
							value={values.middleName}
							onChange={handleChange}
						/>
					</FormField>

					<FormField
						title='Электронная почта'
						fieldError={{ text: errors.email || '', isShow: !!errors.email }}>
						<FormInput
							name='email'
							placeholder='Ваша электронная почта'
							value={values.email}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						title='Телефон'
						fieldError={{
							text: errors.phone || '',
							isShow: !!errors.phone,
						}}>
						<FormInput
							name='phone'
							placeholder='+ 7'
							value={values.phone}
							onChange={handleChange}
						/>
					</FormField>
					<FormField title='Выберите структурное подразделение'>
						<SelectWithSearch
							options={departments}
							currentOption={department}
							onChooseOption={handleChangeDepartment}
						/>
					</FormField>
					<FormField title='Комментарий'>
						<FormTextarea
							name='comment'
							placeholder='Опишите цель регистрации'
							value={values.comment}
							onChange={handleChange}
						/>
					</FormField>
					<FormButtons>
						<Button
							type='submit'
							text='Зарегистрироваться'
							width='full'
							isBlock={isBlockSubmit || isLoading}></Button>
					</FormButtons>
				</Form>
				<FormLinks links={links} />
			</main>
		</PublicLayout>
	);
};
