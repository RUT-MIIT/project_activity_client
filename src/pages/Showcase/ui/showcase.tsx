import type { FC } from 'react';

import { Section } from '../../../shared/components/Section';

import styles from '../styles/showcase.module.scss';

export const Showcase: FC = () => {
	return (
		<Section sectionWidth='full' sectionTitle={{ text: 'Витрина проектов' }}>
			<div className={styles.container}>123</div>
		</Section>
	);
};
