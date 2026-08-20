import type { FC } from 'react';

import { Section } from '../../../shared/components/Section';

import styles from '../styles/team.module.scss';

export const Team: FC = () => {
	return (
		<Section sectionWidth='full' sectionTitle={{ text: 'Моя команда' }}>
			<div className={styles.container}>123</div>
		</Section>
	);
};
