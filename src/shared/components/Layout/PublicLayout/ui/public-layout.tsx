import type { FC } from 'react';
import type { IPublicLayoutProps } from '../types/types';

import { PublicLayoutFooter } from './public-layout-footer';

import styles from '../styles/public-layout.module.scss';

export const PublicLayout: FC<IPublicLayoutProps> = ({ children }) => {
	return (
		<div className={styles.container}>
			<div className={styles.main}>
				<div className={styles.img}></div>
				<div className={styles.info}>
					<h1 className={styles.title}>
						Проектная деятельность РУТ&nbsp;(МИИТ)
					</h1>
					<p className={styles.subtitle}>
						Создавайте, развивайте и реализуйте свои идеи вместе с университетом
					</p>
				</div>
				<PublicLayoutFooter />
			</div>
			<div className={styles.wrapper}>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
};
