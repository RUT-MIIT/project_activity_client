import { FC } from 'react';
import type { IFormInputStubProps } from '../../types/types';

import styles from './form-input.module.scss';

export const FormInputStub: FC<IFormInputStubProps> = ({
	value,
	color = 'default',
}) => {
	return (
		<div
			className={`${styles.stub} ${
				color !== 'default' ? styles[`stub_${color}`] : ''
			}`}>
			{value}
		</div>
	);
};
