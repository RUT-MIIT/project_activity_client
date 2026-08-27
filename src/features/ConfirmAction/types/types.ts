export interface IConfirmAction {
	isOpen: boolean;
	onClose: () => void;
	id: number;
	onSubmit: (id: number) => void;

	title: string;
	subtitle?: string;
	buttonText: string;
	buttonColor?: 'blue' | 'green' | 'red' | 'cancel';
}
