import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import { Card, CardControl } from '../../../shared/components/Card/ui';
import { Notice } from '../../../shared/components/Notice/ui/notice';
import { Button } from '../../../shared/components/Button/ui/button';

import { EMAINROUTES } from '../../../shared/utils/routes';

export const HomeProject: FC = () => {
	const navigate = useNavigate();

	return (
		<Card
			title='Текущий проект'
			subtitle='Проект, над которым работает ваша команда'
			withHeightStretch>
			<Notice
				type='info'
				title='Регистрация на проекты ещё не открыта'
				text='Пока регистрация не открыта, вы можете посмотреть витрину доступных проектов и заранее сформировать команду для участия.'
			/>{' '}
			<CardControl withMarginAuto>
				<Button
					text='К витрине проектов'
					onClick={() => navigate(`/${EMAINROUTES.SHOWCASE}`)}
					color='blue'
					withIcon={{ type: 'next', color: 'white', position: 'right' }}
				/>
			</CardControl>
		</Card>
	);
};
