import { FC, ReactNode, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

import styles from '../styles/tooltip.module.scss';

type TTooltipPlacement = 'right' | 'top' | 'bottom' | 'left';

interface TooltipProps {
	content: ReactNode;
	children: ReactNode;
	placement?: TTooltipPlacement;
}

export const Tooltip: FC<TooltipProps> = ({
	content,
	children,
	placement = 'right',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	const triggerRef = useRef<HTMLDivElement | null>(null);
	const tooltipRoot = document.getElementById('tooltip-root');

	if (!tooltipRoot) return null;

	const showTooltip = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();

			const gap = 8;

			switch (placement) {
				case 'top':
					setCoords({
						top: rect.top + window.scrollY - gap,
						left: rect.left + window.scrollX + rect.width / 2,
					});
					break;

				case 'bottom':
					setCoords({
						top: rect.bottom + window.scrollY + gap,
						left: rect.left + window.scrollX + rect.width / 2,
					});
					break;

				case 'left':
					setCoords({
						top: rect.top + window.scrollY,
						left: rect.left + window.scrollX - gap,
					});
					break;

				case 'right':
				default:
					setCoords({
						top: rect.top + window.scrollY,
						left: rect.right + window.scrollX + gap,
					});
					break;
			}
		}

		setIsOpen(true);
	};

	const hideTooltip = () => setIsOpen(false);

	return (
		<div
			className={styles.trigger}
			ref={triggerRef}
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}>
			{children}

			{isOpen &&
				createPortal(
					<div
						className={`${styles.tooltip} ${styles[`tooltip_${placement}`]}`}
						style={{
							top: coords.top,
							left: coords.left,
						}}>
						{content}
					</div>,
					tooltipRoot
				)}
		</div>
	);
};
