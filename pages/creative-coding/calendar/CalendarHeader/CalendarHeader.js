export const CalendarHeader = ({ onNext, onBack, dateDisplay, showDeleteTrigger, showDeleteAllModal }) => {
	return (
		<div className="calendar-header">
			<div className="month-label">{dateDisplay}</div>
			<div>
				{ showDeleteTrigger &&
					<button onClick={showDeleteAllModal} className="delete-all-modal-button">x</button>
				}
				<button onClick={onBack} className="back-button">Back</button>
				<button onClick={onNext} className="next-button">Next</button>
			</div>
		</div>
	);
}

export default CalendarHeader;
