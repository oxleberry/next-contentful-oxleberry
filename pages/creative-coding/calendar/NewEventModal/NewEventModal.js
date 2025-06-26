import { useState } from 'react';

export const NewEventModal = ({ onClose }) => {
	// States =================
	const [title, setTitle] = useState('Event');

	return(
		<>
			<div className="new-event-modal">
				<p className="modal-headline">New Event</p>

				<label htmlFor="event-title">Event name:</label>
				<input
					id="event-title"
					className="input-text-field"
					name="event-title"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>

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
