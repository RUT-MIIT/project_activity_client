import type { FC } from 'react';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store/store';

import {
	Table,
	TableColumn,
	TableHeader,
	TableMain,
	TableRow,
} from '../../../../../shared/components/Table/ui';
import { Preloader } from '../../../../../shared/components/Preloader/ui/preloader';
import { Filter } from '../../../../../shared/components/Filter/ui/filter';
import { Text } from '../../../../../shared/components/Typography';
import { Badge } from '../../../../../shared/components/Badge/ui/badge';
import { Card } from '../../../../../shared/components/Card/ui';

import { getInstituteTeamsAction } from '../../../../../store/controlGroup/actions';

import { useWindowWidth } from '../../../../../hooks/useWindowWidth';

import styles from '../styles/control-group-mentors.module.scss';

export const ControlGroupTeams: FC = () => {
	const dispatch = useDispatch();

	const windowWidth = useWindowWidth();
	const isMobile = windowWidth <= 1000;

	const { teams, isLoadingTeams } = useSelector((state) => state.controlGroup);

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		dispatch(getInstituteTeamsAction());
	}, [dispatch]);

	const filteredTeams = useMemo(() => {
		if (!searchQuery.trim()) {
			return teams;
		}

		const query = searchQuery.trim().toLowerCase();

		return teams.filter((team) => {
			const teamName = team.name.toLowerCase();
			const groupName = team.studyGroup.name.toLowerCase();

			const mentors = team.mentors
				.map((mentor) => mentor.fullName.toLowerCase())
				.join(' ');

			const project = team.project?.title.toLowerCase() || '';

			return (
				teamName.includes(query) ||
				groupName.includes(query) ||
				mentors.includes(query) ||
				project.includes(query)
			);
		});
	}, [teams, searchQuery]);

	const getStatus = (status: string) => {
		switch (status) {
			case 'assembled':
				return {
					text: 'Состав сформирован',
					color: 'green' as const,
				};

			case 'forming':
				return {
					text: 'Формируется',
					color: 'yellow' as const,
				};

			default:
				return {
					text: status,
					color: 'grey' as const,
				};
		}
	};

	const getMentorsText = (team: (typeof teams)[number]) => {
		if (team.mentors.length === 0) {
			return 'Не назначены';
		}

		if (team.mentors.length <= 1) {
			return team.mentors.map((mentor) => mentor.fullName).join(', ');
		}

		return `${team.mentors[0].fullName} и ещё ${team.mentors.length - 1}`;
	};

	if (isLoadingTeams) {
		return <Preloader />;
	}

	return (
		<>
			<div className={styles.header}>
				<Filter
					placeholder='Поиск..'
					onFilter={setSearchQuery}
					width={isMobile ? 'full' : 'default'}
				/>
			</div>

			{filteredTeams.length === 0 ? (
				<Text text='Команды не найдены.' color='grey' />
			) : !isMobile ? (
				<div className={styles.table}>
					<Table>
						<TableHeader>
							<TableColumn text='№' textWeight='bold' columnSize='count' />

							<TableColumn text='Команда' textWeight='bold' columnSize='full' />

							<TableColumn text='Статус' textWeight='bold' columnSize='large' />

							<TableColumn
								text='Группа'
								textWeight='bold'
								columnSize='medium'
							/>

							<TableColumn
								text='Наставники'
								textWeight='bold'
								columnSize='full'
							/>

							<TableColumn text='Проект' textWeight='bold' columnSize='full' />

							<TableColumn
								text='Студенты'
								textWeight='bold'
								columnSize='small'
							/>
						</TableHeader>

						<TableMain>
							{filteredTeams.map((team, index) => {
								const status = getStatus(team.status);

								return (
									<TableRow key={team.id}>
										<TableColumn text={String(index + 1)} columnSize='count' />

										<TableColumn
											text={team.name}
											columnSize='full'
											textWeight='bold'
										/>

										<TableColumn withChildren columnSize='large'>
											<Badge text={status.text} color={status.color} />
										</TableColumn>

										<TableColumn
											text={team.studyGroup.name}
											columnSize='medium'
										/>

										<TableColumn
											text={getMentorsText(team)}
											textColor={team.mentors.length === 0 ? 'grey' : 'default'}
											columnSize='full'
										/>

										<TableColumn
											text={team.project?.title || 'Не назначен'}
											textColor={team.project ? 'default' : 'grey'}
											columnSize='full'
										/>

										<TableColumn
											text={String(team.membersCount)}
											columnSize='small'
										/>
									</TableRow>
								);
							})}
						</TableMain>
					</Table>
				</div>
			) : (
				<div className={styles.cards}>
					{filteredTeams.map((team, index) => {
						const status = getStatus(team.status);

						return (
							<Card key={team.id}>
								<div className={styles.cardHeader}>
									<span className={styles.cardNumber}>#{index + 1}</span>

									<Badge text={status.text} color={status.color} />
								</div>

								<h3 className={styles.cardTitle}>{team.name}</h3>

								<div className={styles.cardMeta}>
									<div className={styles.cardMetaItem}>
										<span className={styles.cardLabel}>Учебная группа</span>

										<span className={styles.cardValue}>
											{team.studyGroup.name}
										</span>
									</div>

									<div className={styles.cardMetaItem}>
										<span className={styles.cardLabel}>Участников</span>

										<span className={styles.cardValue}>
											{team.membersCount}
										</span>
									</div>
								</div>

								<div className={styles.cardInfo}>
									<div className={styles.cardMetaItem}>
										<span className={styles.cardLabel}>Наставники</span>

										<span
											className={`${styles.cardValue} ${
												team.mentors.length === 0 ? styles.cardValue_grey : ''
											}`}>
											{getMentorsText(team)}
										</span>
									</div>

									<div className={styles.cardMetaItem}>
										<span className={styles.cardLabel}>Проект</span>

										<span
											className={`${styles.cardValue} ${
												!team.project ? styles.cardValue_grey : ''
											}`}>
											{team.project?.title || 'Не назначен'}
										</span>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			)}
		</>
	);
};
