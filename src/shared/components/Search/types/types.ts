export interface ISearchProps<T> {
	data: T[];
	searchKey: keyof T;
	placeholder?: string;
	onFilter: (filtered: T[]) => void;
}

export interface ISearchInputProps {
	placeholder?: string;
	value?: string;
	onChange: (value: string) => void;
}
