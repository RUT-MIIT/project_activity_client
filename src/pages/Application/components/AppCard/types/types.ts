import { IApplicationItem } from '../../../../../store/application/types';

export interface IAppCardProps {
	card: IApplicationItem;
	withAuthor?: boolean;
	onShowDetail: (id: number) => void;
}
