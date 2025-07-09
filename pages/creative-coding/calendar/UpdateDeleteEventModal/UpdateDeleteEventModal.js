import { useState } from 'react';

export const UpdateDeleteEventModal = ({ data, onUpdate, onDelete, onClose }) => {
	// States =================
	const [title, setTitle] = useState(data.title || 'Event');

	return(
		<>
			<div className="update-delete-event-modal">
				<p className="modal-headline">Update Event</p>

				<div className="inline-row">
					<span>Center</span>
				</div>

				<label htmlFor="event-title">Rename:</label>
				<input
					id="event-title"
					className="input-text-field"
					name="event-title"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

				<button
					className="update-button"
					onClick={() => {
						onUpdate(title);
					}}>
					Update
				</button>

				<button
					className="delete-button"
					onClick={onDelete}>
					Delete
				</button>

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
