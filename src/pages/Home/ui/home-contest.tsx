import type { FC } from 'react';

import { Button } from '../../../shared/components/Button/ui/button';

import styles from '../styles/home-contest.module.scss';

export const HomeContest: FC = () => {
	return (
		<div className={styles.contest}>
			<div className={styles.info}>
				<h4 className={styles.title}>
					Международные транспортные проектные соревнования
				</h4>
				<div className={styles.description}>
					<Button
						text='Перейти на сайт соревнований'
						type='link'
						href='https://contest.miit.ru/'
					/>
					<p className={styles.text}>
						Собери команду, выбери проблему от компании и пройди путь от идеи до
						защиты проекта.
					</p>
					<p className={styles.text}>
						Отдельный сайт соревнований — вся информация, этапы и материалы в
						одном месте.
					</p>
				</div>
			</div>
			<div className={styles.prize}>
				<p className={styles.text}>
					1 000 000 ₽ за проблему, которую ты сможешь закрыть
				</p>
				<div className={styles.badge}>contest.miit.ru</div>
			</div>
		</div>
	);
};
