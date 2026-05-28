import { IProject } from '../../../Track/lib/lib';

export interface IProjectCardProps {
	card: IProject;
	onShowDetail?: (id: number) => void;
	onSelect: (id: number) => void;
	isSelect: boolean;
}
