export interface ITrackDetailModal {
	id: number | null;
	isOpen: boolean;
	onClose: () => void;
	instituteCode: string;
}
