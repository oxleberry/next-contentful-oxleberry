import { Event } from '../Event/Event';

export const Day = ({ day, onClick, triggerUpdateModal, setLastEventClicked }) => {
	const className = `day${day.value === 'blank-days' ? ' blank-days' : ''}${day.isCurrentDay ? ' current-day' : ''}`;

	return (
		<div onClick={onClick} className={className}>
			{day.value === 'blank-days' ? '' : day.value}
			{day.event && day.event.map((event, idx) => 
				<Event
					key={idx}
					event={event}
					triggerUpdateModal={triggerUpdateModal}
					setLastEventClicked={setLastEventClicked}
				/>
			)}
		</div>
	);
};

export default Day;
