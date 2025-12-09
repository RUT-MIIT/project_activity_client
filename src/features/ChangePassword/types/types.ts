export interface IChangePasswordForm {
	old_password: string;
	new_password: string;
	repeat_password: string;
}

export interface IChangePasswordFormProps {
	onSuccess?: () => void;
}
