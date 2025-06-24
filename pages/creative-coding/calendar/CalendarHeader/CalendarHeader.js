export const CalendarHeader = ({ onNext, onBack, dateDisplay }) => {
	return (
		<div className="calendar-header">
			<div className="month-label">{dateDisplay}</div>
			<nav>
				<button onClick={onBack} className="back-button">Back</button>
				<button onClick={onNext} className="next-button">Next</button>
			</nav>
		</div>
	);
}

export default CalendarHeader;
