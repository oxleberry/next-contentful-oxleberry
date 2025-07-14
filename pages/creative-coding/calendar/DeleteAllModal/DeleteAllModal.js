export const DeleteAllModal = ({ onClose }) => {
	return(
		<>
			<div className="update-delete-event-modal">
				<p className="modal-headline">WARNING - THIS WILL PERMANENTLY DELETE ALL EVENTS FROM YOUR CALENDAR</p>

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

export default DeleteAllModal;
