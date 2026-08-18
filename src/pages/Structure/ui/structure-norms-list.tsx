import type { FC } from 'react';
import type { IDivisionStats } from '../../../store/structure/types';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../../store/store';

import {
	getMyDivisionStatsAction,
	getMyDivisionPlansAction,
} from '../../../store/structure/actions';
import { setCurrentDivision } from '../../../store/structure/reducer';
import {
	getApprovedCount,
	selectDivisionsNormsSummary,
} from '../../../store/structure/selectors';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../shared/components/Table/ui';
import { ProgressBar } from '../../../shared/components/ProgressBar/ui/progress-bar';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { SetDivisionNormForm } from './set-division-norm-form';

import styles from '../styles/structure-norms.module.scss';

export const StructureNormsList: FC = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const {
		currentSemester,
		divisionsPlans,
		myDivisionStats,
		currentDivision,
		isLoadingStats,
		isLoadingPlans,
	} = useSelector((state) => state.structure);
	const { totalPlan, totalFact, percent } = useSelector(
		selectDivisionsNormsSummary
	);
	const [isOpenSetDivisionPlanModal, setIsOpenSetDivisionPlanModal] =
		useState<boolean>(false);

	useEffect(() => {
		console.log(currentSemester);
		console.log(user);
		if (currentSemester && user) {
			dispatch(getMyDivisionStatsAction(currentSemester.id));

			dispatch(
				getMyDivisionPlansAction({
					semesterId: currentSemester.id,
					divisionCode: user.institute_code ?? undefined,
				})
			);
		}
	}, [dispatch, currentSemester, user]);

	const handleOpenSetDivisionPlanModal = (division: IDivisionStats) => {
		dispatch(setCurrentDivision(division));
		setIsOpenSetDivisionPlanModal(true);
	};

	const closeModals = () => {
		setIsOpenSetDivisionPlanModal(false);
	};

	if (isLoadingStats || isLoadingPlans) {
		return <Preloader />;
	}

	return (
		myDivisionStats && (
			<>
				<div className={styles.norms}>
					<div className={`${styles.card} ${styles.card_color_blue}`}>
						<h5
							className={
								styles.card__title
							}>{`План подразделения (${myDivisionStats.department_short_name})`}</h5>
						<span className={styles.card__count}>{myDivisionStats.plan}</span>
						<p className={styles.card__text}>
							Показатель заявок установленный для&nbsp;вашего подразделения
						</p>
					</div>
					<div className={`${styles.card} ${styles.card_color_blue}`}>
						<h5 className={styles.card__title}>Распределено заявок</h5>
						<span className={styles.card__count}>{totalPlan}</span>
						<p className={styles.card__text}>
							Планируемое количество заявок распределенное
							по&nbsp;подразделениям
						</p>
					</div>
					<div className={`${styles.card} ${styles.card_color_blue}`}>
						<h5 className={styles.card__title}>Количество заявок</h5>
						<span className={styles.card__count}>{totalFact}</span>
						<p className={styles.card__text}>
							Фактическое количество заявок от&nbsp;подразделений
						</p>
					</div>
					<div className={`${styles.card} ${styles.card_color_blue}`}>
						<h5 className={styles.card__title}>Прогресс выполнения</h5>
						<span className={styles.card__count}>{percent}%</span>
						<p className={styles.card__text}>
							Процент выполнения плана подразделениями
						</p>
					</div>
				</div>
				<div className={styles.table}>
					<Table>
						<TableHeader>
							<TableColumn
								text='Наименование подразделения'
								textWeight='bold'
								columnSize='full'
							/>
							<TableColumn text='План' textWeight='bold' columnSize='small' />
							<TableColumn text='Факт' textWeight='bold' columnSize='small' />
							<TableColumn
								text='Выполнение'
								textWeight='bold'
								columnSize='progress'
							/>
						</TableHeader>
						<TableMain>
							{divisionsPlans
								.filter((elem) => elem.department_name !== 'ЦПДС')
								.map((elem: IDivisionStats) => (
									<TableRow key={elem.department_id}>
										<TableColumn
											text={elem.department_name}
											id={elem.department_id}
											columnSize='full'
											textWeight='bold'
											active
											onClick={() => handleOpenSetDivisionPlanModal(elem)}
										/>
										<TableColumn
											text={elem.plan}
											textColor={elem.plan === 0 ? 'red' : 'default'}
											id={elem.department_id}
											columnSize='small'
										/>
										<TableColumn
											text={getApprovedCount(elem.applications_by_status)}
											textColor={elem.plan === 0 ? 'grey' : 'blue'}
											id={elem.department_id}
											columnSize='small'
										/>
										<TableColumn
											withChildren
											id={elem.department_id}
											columnSize='progress'>
											<ProgressBar
												value={getApprovedCount(elem.applications_by_status)}
												max={elem.plan}
												withInfo
												caption='Выполнение'
											/>
										</TableColumn>
									</TableRow>
								))}
						</TableMain>
					</Table>
					{isOpenSetDivisionPlanModal && currentDivision && (
						<Modal
							isOpen={isOpenSetDivisionPlanModal}
							onClose={closeModals}
							title='Установить план для подразделения'
							description={currentDivision.department_name}>
							<SetDivisionNormForm />
						</Modal>
					)}
				</div>
			</>
		)
	);
};
