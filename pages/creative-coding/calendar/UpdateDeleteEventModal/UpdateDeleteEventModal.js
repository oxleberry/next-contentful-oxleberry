export const UpdateDeleteEventModal = ({ onClose }) => {

	return(
		<>
			<div className="update-delete-event-modal">
				<p className="modal-headline">Update Event</p>

				<button
					className="cancel-button"
					onClick={onClose}>
					Cancel
				</button>
			</div>

			<div className="modal-backdrop"></div>
		</>
	);
};

export default UpdateDeleteEventModal;
