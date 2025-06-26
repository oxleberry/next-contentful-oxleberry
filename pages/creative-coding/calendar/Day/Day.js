export const Day = ({ day, onClick }) => {
	const className = `day${day.value === 'blank-days' ? ' blank-days' : ''}${day.isCurrentDay ? ' current-day' : ''}`;

	return (
		<div onClick={onClick} className={className}>
			{day.value === 'blank-days' ? '' : day.value}
			{day.event && <div className='event'>{day.event.title}</div>}
		</div>
	);
};

export default Day;
