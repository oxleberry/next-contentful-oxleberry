import { useState } from 'react';

export const UpdateDeleteEventModal = ({ data, onUpdate, onDelete, onClose }) => {
	// States =================
	const [title, setTitle] = useState(data.title || 'Event');
	const [numDays, setNumDays] = useState(data.numDays || 1);
	const [order, setOrder] = useState(data.order || 1);

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

				<label htmlFor="event-num-days">Duration:</label>
				<input
					id="event-num-days"
					className="input-text-field"
					name="event-num-days"
					onChange={e => setNumDays(e.target.value)}
					type="number"
					value={numDays}
					min="1"
					max="7"
				/>

				<label htmlFor="event-order">Order #:</label>
				<input
					id="event-order"
					className="input-text-field"
					name="event-order"
					onChange={e => setOrder(e.target.value)}
					type="number"
					value={order}
					min="1"
					max="4"
				/>

				<button
					className="update-button"
					onClick={() => {
						onUpdate(title, numDays, order);
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
