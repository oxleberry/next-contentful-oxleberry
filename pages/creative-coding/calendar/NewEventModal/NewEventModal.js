export const NewEventModal = ({ onClose }) => {

	return(
		<>
			<div className="new-event-modal">
				<p className="modal-headline">New Event</p>

				<button
					onClick={onClose}
					className="cancel-button">Cancel
				</button>
			</div>

			<div className="modal-backdrop"></div>
		</>
	);
};

export default NewEventModal;
