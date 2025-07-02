import { useState } from 'react';

export const NewEventModal = ({ data, onSave, onClose }) => {
	const colorOptions = [
		{
			id: 'purple',
			name: 'Purple',
			hexCode: '#b188b5'
		},
		{
			id: 'blue',
			name: 'Blue',
			hexCode: '#1a759f'
		},
		{
			id: 'green',
			name: 'Green',
			hexCode: '#a7b300'
		},
		{
			id: 'orange',
			name: 'Orange',
			hexCode: '#d48844'
		}
	]

	// States =================
	const [title, setTitle] = useState(data.title || 'Event');
	const [numDays, setNumDays] = useState(data.numDays || 1);
	const [order, setOrder] = useState(data.order || 1);
	const [color, setColor] = useState(data.color || colorOptions[0].hexCode);

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

				<div className="color-selection-label">Color:</div>
				{colorOptions.map((option, idx) =>
					<div key={idx} className="color-selection">
						<label
							className={`label-${option.id}`}
							htmlFor={option.hexCode}>
							<span className="swatch">{option.name}</span>
						</label>
						<input
							type="radio"
							id={`event-color-${option.id}`}
							name="event-color"
							value={option.hexCode}
							checked={color === option.hexCode}
							onChange={e => setColor(e.target.value)}
						/>
					</div>
				)}

				<button
					className="save-button"
					onClick={() => {
						onSave(title, numDays, order, color);
					}}>
					Save
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

export default NewEventModal;
