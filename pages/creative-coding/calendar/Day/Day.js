export const Day = ({ day, onClick }) => {
	const className = `day${day.value === 'blank-days' ? ' blank-days' : ''}${day.isCurrentDay ? ' current-day' : ''}`;
	let eventWidth;
	let eventMarginTop;

	console.log('day.event', day.event);
	if (day.event) {
		eventWidth = `${day.event.numDays * 100}%`;
		eventMarginTop = `${(day.event.order - 1) * 25 + 26}px`;
	}

	return (
		<div onClick={onClick} className={className}>
			{day.value === 'blank-days' ? '' : day.value}
			{day.event && 
				<div
					className='event'
					style={{
						width: eventWidth,
						marginTop: eventMarginTop
					}}>
					{day.event.title}
				</div>
			}
		</div>
	);
};

export default Day;
