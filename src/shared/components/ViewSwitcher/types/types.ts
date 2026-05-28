export interface IViewOption<T extends string = string> {
	id: T;
	name: string;
}

export interface IViewSwitcherProps<T extends string = string> {
	options?: IViewOption<T>[];
	defaultView?: T;
	storageKey: string;
	onChange: (view: T) => void;
}
