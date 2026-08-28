import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/home-team.module.scss';

interface ITeamMember {
	id: number;
	first_name: string;
	last_name: string;
	role: string;
}

const mockTeam = {
	name: 'Команда «Инноваторы»',

	members: [
		{
			id: 1,
			first_name: 'Иван',
			last_name: 'Петров',
			role: 'Капитан команды',
		},
		{
			id: 2,
			first_name: 'Анна',
			last_name: 'Смирнова',
			role: 'Разработчик',
		},
		{
			id: 3,
			first_name: 'Дмитрий',
			last_name: 'Иванов',
			role: 'Аналитик',
		},
		{
			id: 4,
			first_name: 'Мария',
			last_name: 'Соколова',
			role: 'Проектировщик',
		},
		{
			id: 5,
			first_name: 'Алексей',
			last_name: 'Кузнецов',
			role: 'Разработчик',
		},
		{
			id: 6,
			first_name: 'Екатерина',
			last_name: 'Морозова',
			role: 'Дизайнер',
		},
	] as ITeamMember[],

	mentor: {
		id: 7,
		first_name: 'Сергей',
		last_name: 'Орлов',
		role: 'Наставник команды',
	},
};

export const HomeTeam: FC = () => {
	const navigate = useNavigate();
	const members = [...mockTeam.members, mockTeam.mentor];

	return (
		<Card title='Моя команда' subtitle='Название команды' withHeightStretch>
			<CardControl withMarginAuto>
				<Button
					text='К моей команде'
					onClick={() => navigate(`/${EMAINROUTES.TEAM}`)}
				/>
			</CardControl>
		</Card>
	);
};
