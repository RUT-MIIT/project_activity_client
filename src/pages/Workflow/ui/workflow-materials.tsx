import type { FC } from 'react';

import { Card } from '../../../shared/components/Card/ui';
import { Button } from '../../../shared/components/Button/ui/button';
import { TeamAvatar } from '../../../shared/components/Avatar/ui/team-avatar';

import { getMemberRoleName } from '../lib/helpers';
import { mockFiles } from '../lib/mock';

import styles from '../styles/workflow.module.scss';

const getNameParts = (fullName: string) => {
	const [lastName = '', firstName = ''] = fullName.split(' ');

	return { firstName, lastName };
};

export const WorkflowMaterials: FC = () => {
	return (
		<div className={styles.page}>
			<Card
				title='Материалы проекта'
				subtitle='Загруженные файлы команды. Данные пока демонстрационные.'>
				<ul className={styles.list}>
					{mockFiles.map((file) => {
						const { firstName, lastName } = getNameParts(file.author);
						const extension =
							file.name.split('.').pop()?.toUpperCase() || 'FILE';

						return (
							<li className={styles.list__item} key={file.id}>
								<div className={styles.list__main}>
									<span className={styles.list__icon}>{extension}</span>
									<div className={styles.list__file}>
										<p className={styles.list__title}>{file.name}</p>
										<p className={styles.list__meta}>
											{file.size} · {file.uploadedAt}
										</p>
									</div>
								</div>
								<div className={styles.list__uploader}>
									<TeamAvatar
										firstName={firstName}
										lastName={lastName}
										memberRole={file.authorRole}
									/>
									<div className={styles.list__info}>
										<p className={styles.list__author}>{file.author}</p>
										<p className={styles.list__meta}>
											{getMemberRoleName(file.authorRole)}
										</p>
									</div>
								</div>
								<Button text='Скачать' color='blue' isBlock />
							</li>
						);
					})}
				</ul>
			</Card>
		</div>
	);
};
