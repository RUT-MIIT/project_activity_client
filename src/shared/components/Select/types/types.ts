export interface ISelectProps<T> {
	options: T[];
	currentOption: T | null;
	onChooseOption: (option: T | null) => void;
	valueKey?: keyof T;
	labelKey?: keyof T;
	width?: 'default' | 'medium' | 'full' | 'small' | 'large' | 'auto';
	placeholder?: string;
	withClear?: boolean;
}

export interface IMultiSelectProps<T> {
	options: T[];
	selectedOptions: T[];
	onChange: (selected: T[]) => void;
	valueKey?: keyof T;
	labelKey?: keyof T;
	placeholder?: string;
	listHeight?: '120' | '160' | '200' | '240';
}
