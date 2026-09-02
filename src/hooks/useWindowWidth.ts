import { useEffect, useState } from 'react';

export const useWindowWidth = (): number => {
	const getWindowWidth = () =>
		typeof window !== 'undefined' ? window.innerWidth : 0;

	const [windowWidth, setWindowWidth] = useState<number>(getWindowWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return windowWidth;
};
