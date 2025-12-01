import type { FC } from 'react';

import { Section } from '../../../shared/components/Section';
import { CreatePublicApplication } from '../../../widgets/CreateApplication/ui/create-public-application';

import styles from '../styles/apply.module.scss';

export const Apply: FC = () => {
	return (
		<div className={styles.container}>
			<Section
				sectionWidth='full'
				sectionHeight='page'
				sectionTitle={{ text: 'Создание новой заявки' }}
				sectionDescription='Заполните несколько шагов, чтобы отправить заявку на рассмотрение'>
				<CreatePublicApplication />
			</Section>
		</div>
	);
};
