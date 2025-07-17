export const CalendarHeader = ({ onNext, onBack, dateDisplay, showDeleteTrigger, showDeleteAllModal }) => {
	return (
		<>
			<div className="intro">
				<p className="sub-headline">Web app using local storage to store data</p>
				<p className="text">Based on <a href="https://www.youtube.com/watch?v=m9OSBJaQTlM">Coding A Calendar App In Plain JavaScript</a> tutorial video</p>
				<p className="text">& based on <a href="https://www.youtube.com/watch?v=m9OSBJaQTlM">Converting A Plain JavaScript App To React</a> tutorial video.</p>
				<p className="text">Play around with example on <a href="https://codepen.io/oxleberry/pen/vEBrMWg">Codepen</a>.</p>
			</div>
			<hr></hr>
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
		</>
	);
}

export default CalendarHeader;
