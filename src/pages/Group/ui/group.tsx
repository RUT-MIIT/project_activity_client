import type { FC } from 'react';

import { Section } from '../../../shared/components/Section';

import styles from '../styles/group.module.scss';

export const Group: FC = () => {
	return (
		<Section sectionWidth='full' sectionTitle={{ text: 'Моя группа' }}>
			<div className={styles.container}>123</div>
		</Section>
	);
};
