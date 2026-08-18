import type { PropsWithChildren } from 'react';

export interface IModalProps extends PropsWithChildren {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	modalWidth?: 'large' | 'default' | 'full' | 'small';
	closeByClickOutside?: boolean;
	closeByPressEsc?: boolean;
}

export interface IModalOverlayProps {
	onClick: () => void;
}
