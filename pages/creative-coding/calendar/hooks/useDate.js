import { useEffect, useState } from 'react';

export const useDate = () => {
	const [dateDisplay, setDateDisplay] = useState('');

	useEffect(() => {
		const dt = new Date();
		const year = dt.getFullYear();

		setDateDisplay(`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`);
	}, []);

	return {
		dateDisplay,
	};
};
