import type { FC, FormEvent } from 'react';
import type { IConfirmAction } from '../types/types';

import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Form } from '../../../shared/components/Form/ui/form';
import { FormButtons } from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';

export const ConfirmAction: FC<IConfirmAction> = ({
	isOpen,
	onClose,
	id,
	onSubmit,
	title,
	subtitle,
	buttonText,
	buttonColor = 'blue',
}) => {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(id);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			modalWidth='small'
			title={title}
			description={subtitle}>
			<Form name='form-confirm-action' onSubmit={handleSubmit}>
				<FormButtons>
					<Button
						type='submit'
						text={buttonText}
						color={buttonColor}
						width='full'
					/>
				</FormButtons>
			</Form>
		</Modal>
	);
};
