import type { FC } from 'react';
import type { INoticeProps } from '../types/types';

import infoIcon from '../../../images/icons/notice/info.png';
import warningIcon from '../../../images/icons/notice/warning.png';
import errorIcon from '../../../images/icons/notice/error.png';
import successIcon from '../../../images/icons/notice/success.png';

import styles from '../styles/notice.module.scss';

const noticeIcons = {
	info: infoIcon,
	warning: warningIcon,
	error: errorIcon,
	success: successIcon,
};

export const Notice: FC<INoticeProps> = ({ type, title, text, button }) => {
	return (
		<div className={`${styles.notice} ${styles[`notice_${type}`]}`}>
			<div className={styles.icon}>
				<img src={noticeIcons[type]} alt='' />
			</div>

			<div className={styles.content}>
				<p className={styles.title}>{title}</p>

				{text && <p className={styles.text}>{text}</p>}
			</div>

			{button && <div className={styles.action}>{button}</div>}
		</div>
	);
};
