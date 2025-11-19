import type { FC } from 'react';
import type { IFormFieldProps } from '../../types/types';

import styles from './form-field.module.scss';

export const FormField: FC<IFormFieldProps> = ({
	title,
	fieldError,
	withInfo = false,
	withMarginBottom = false,
	onInfo,
	infoText,
	children,
}) => {
	return (
		<div
			className={`${styles.container} ${
				withMarginBottom ? styles.container_margin_bottom : ''
			}`}>
			<div className={styles.header}>
				<h4 className={styles.title}>{title}</h4>
				{withInfo && (
					<div className={styles.icon_wrapper}>
						<div className={styles.icon} onClick={onInfo}></div>
						<div className={styles.info}>
							<p className={styles.info__text}>{infoText}</p>
						</div>
					</div>
				)}
			</div>
			{children}
			{fieldError && (
				<span
					className={`${styles.error} ${
						fieldError.isShow ? styles['error_status_show'] : ''
					}`}>
					{fieldError.text}
				</span>
			)}
		</div>
	);
};
