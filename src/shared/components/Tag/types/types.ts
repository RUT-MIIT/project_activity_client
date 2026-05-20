import { ITag } from '../../../../store/catalog/types';

export interface ITagListProps {
	items: ITag[];
	emptyText?: string;
	onRemove: (id: number) => void;
}

export interface ITagProps {
	name: string;
	id: number;
	onRemove: (id: number) => void;
}
