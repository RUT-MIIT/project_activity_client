import { IProject } from '../../../../store/track/types';

export interface IProjectCardProps {
	card: IProject;
	onShowDetail?: (id: number) => void;
	onSelect: (id: number) => void;
	isSelect: boolean;
}
