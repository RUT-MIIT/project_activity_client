export interface ISearchProps<T> {
	data: T[];
	searchKey: keyof T;
	placeholder?: string;
	onFilter: (filtered: T[]) => void;
}
