export interface IBadge {
	text: string;
	type?: 'elem' | 'button';
	color?: string;
	withDot?: boolean;
	onClick?: () => void;
}
