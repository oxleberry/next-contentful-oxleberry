import { Event } from '../Event/Event';

export const Day = ({ day, onClick, triggerUpdateModal }) => {
	const className = `day${day.value === 'blank-days' ? ' blank-days' : ''}${day.isCurrentDay ? ' current-day' : ''}`;

	return (
		<div onClick={onClick} className={className}>
			{day.value === 'blank-days' ? '' : day.value}
			{day.event && day.event.map((event, idx) => 
				<Event
					key={idx}
					event={event}
					triggerUpdateModal={triggerUpdateModal}
				/>
			)}
		</div>
	);
};

export default Day;
