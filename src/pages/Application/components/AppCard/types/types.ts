import { IApplicationItem } from '../../../../../store/application/types';

export interface IAppCardProps {
	card: IApplicationItem;
	withAuthor?: boolean;
	onShowHistory: (id: number) => void;
	onShowDetail: (id: number) => void;
}
