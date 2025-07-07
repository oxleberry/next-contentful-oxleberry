export const Event = ({ event, triggerUpdateModal }) => {
	const { title, numDays, order, color, isCentered } = event;
	const eventWidth = `${numDays * 100}%`;
	const eventMarginTop = `${(order - 1) * 25 + 26}px`;
	const eventTextAlignment = isCentered ? 'center' : 'start';
	const paddingLeft = isCentered ? '3px' : '12px';

	return (
		<div
			className='event'
			style={{
				width: eventWidth,
				marginTop: eventMarginTop,
				backgroundColor: color,
				textAlign: eventTextAlignment,
				paddingLeft: paddingLeft
			}}
			onClick={(e) => {
				e.stopPropagation();
				triggerUpdateModal(() => true );
			}}>
			{title}
		</div>
	);
}

export default Event;
