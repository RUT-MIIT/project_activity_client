import { IApplicationItem } from '../../../../../store/application/types';

export interface IAppCardProps {
	card: IApplicationItem;
	withComment?: boolean;
	withStage?: boolean;
	withAuthor?: boolean;
	isAuthor?: boolean;
	onShowHistory?: (id: number) => void;
	onShowDetail?: (id: number) => void;
}
