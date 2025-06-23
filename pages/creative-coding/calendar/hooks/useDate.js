import { useEffect, useState } from 'react';

export const useDate = (nav) => {
	const [dateDisplay, setDateDisplay] = useState('');

	useEffect(() => {
		const dt = new Date();

		if (nav !== 0) {
			dt.setMonth(new Date().getMonth() + nav);
		}

		const year = dt.getFullYear();

		setDateDisplay(`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`);
	}, [nav]);

	return {
		dateDisplay,
	};
};
