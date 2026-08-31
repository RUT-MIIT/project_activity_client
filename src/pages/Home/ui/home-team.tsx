import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import { EMAINROUTES } from '../../../shared/utils/routes';

import styles from '../styles/home-team.module.scss';

export const HomeTeam: FC = () => {
	const navigate = useNavigate();

	return (
		<Card
			title='Моя команда'
			subtitle='Информация о вашей команде'
			withHeightStretch>
			<Notice
				type='warning'
				title='Сначала сформируйте команду'
				text='Для выбора проекта необходимо сформировать команду и подтвердить её состав. После подтверждения состава вы сможете перейти к выбору проекта.'
			/>

			<CardControl withMarginAuto>
				<Button
					text='К моей команде'
					onClick={() => navigate(`/${EMAINROUTES.TEAM}`)}
					color='blue'
					withIcon={{ type: 'next', color: 'white', position: 'right' }}
				/>
			</CardControl>
		</Card>
	);
};
