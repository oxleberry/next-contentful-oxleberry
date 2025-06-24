export const Day = ({ day, onClick }) => {
	const className = `day${day.value === 'blank-days' ? ' blank-days' : ''}`;

	return (
		<div onClick={onClick} className={className}>
			{day.value === 'blank-days' ? '' : day.value}
		</div>
	);
};
