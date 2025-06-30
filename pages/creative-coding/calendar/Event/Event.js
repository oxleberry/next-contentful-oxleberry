export const Event = (props) => {
	const { title, numDays, order } = props.event;
	const eventWidth = `${numDays * 100}%`;
	const eventMarginTop = `${(order - 1) * 25 + 26}px`;
	console.log('props', props);

	return (
		<div
			className='event'
			style={{
				width: eventWidth,
				marginTop: eventMarginTop
			}}>
			{title}
		</div>
	);
}

export default Event;
