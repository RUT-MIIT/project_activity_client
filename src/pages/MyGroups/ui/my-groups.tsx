import type { FC } from 'react';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useNavigate } from 'react-router-dom';

import { Section } from '../../../shared/components/Section';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Text } from '../../../shared/components/Typography';
import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { Badge } from '../../../shared/components/Badge/ui/badge';
import { Notice } from '../../../shared/components/Notice/ui/notice';

import { getMyGroupsAction } from '../../../store/mentor/actions';

import styles from '../styles/my-groups.module.scss';

export const MyGroups: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { groups, isLoadingGroups } = useSelector((state) => state.mentor);

	useEffect(() => {
		dispatch(getMyGroupsAction());
	}, [dispatch]);

	const handleShowGroup = (groupId: number) => {
		navigate(`/my-groups/${groupId}`);
	};

	if (isLoadingGroups) {
		return <Preloader />;
	}

	return (
		<Section
			sectionWidth='full'
			sectionTitle={{ text: 'Мои группы' }}
			sectionDescription='Группы, в которых вы являетесь наставником'>
			<div className={styles.notice}>
				<Notice
					type='info'
					title='Проверьте список групп'
					text='Если в списке отсутствует ваша группа или вам назначена неверная группа, обратитесь к ответственному за проектную деятельность в вашем институте.'
				/>
			</div>

			{groups.length > 0 ? (
				<div className={styles.container}>
					{groups.map((group) => (
						<Card key={group.id}>
							<div className={styles.header}>
								<Badge text='Учебная группа' color='blue' />

								<h3 className={styles.title}>{group.name}</h3>
							</div>

							<div className={styles.info}>
								<div className={styles.item}>
									<span className={styles.label}>Студенты</span>

									<strong className={styles.value}>
										{group.studentsCount}
									</strong>
								</div>

								<div className={styles.item}>
									<span className={styles.label}>Команды</span>

									<strong className={styles.value}>{group.teamsCount}</strong>
								</div>
							</div>

							<CardControl withMarginAuto>
								<Button
									type='button'
									text='Подробнее'
									color='blue'
									onClick={() => handleShowGroup(group.id)}
								/>
							</CardControl>
						</Card>
					))}
				</div>
			) : (
				<Text
					text='За вами пока не закреплено ни одной группы.'
					color='grey'
					withMarginTop
				/>
			)}
		</Section>
	);
};
