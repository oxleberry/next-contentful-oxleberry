export const Day = ({ day, onClick }) => {
	const className = `day${day.value === 'blank-days' ? ' blank-days' : ''}${day.isCurrentDay ? ' current-day' : ''}`;
	let eventWidth;

	console.log('day.event', day.event);
	if (day.event) {
		eventWidth = `${day.event.numDays * 100}%`;
	}

	return (
		<div onClick={onClick} className={className}>
			{day.value === 'blank-days' ? '' : day.value}
			{day.event && 
				<div
					className='event'
					style={{width: eventWidth}}>
					{day.event.title}
				</div>
			}
		</div>
	);
};

export default Day;
