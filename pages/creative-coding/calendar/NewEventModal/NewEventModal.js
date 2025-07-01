import { useState } from 'react';

export const NewEventModal = ({ onSave, onClose }) => {
	// States =================
	const [title, setTitle] = useState('Event');
	const [numDays, setNumDays] = useState(1);
	const [order, setOrder] = useState(1);
	const [color, setColor] = useState('#b188b5');

	// Functions =================
	function colorValueHandler(event) {
		let value = event.target.value;
		setColor(value);
		console.log('color', color);
	}

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
				<div className="color-selection">
					<label
						className="label-purple"
						htmlFor="#b188b5">
						<span className="swatch">Purple</span>
					</label>
					<input
						type="radio"
						id="event-color-purple"
						name="event-color"
						value="#b188b5"
						defaultChecked="true"
						onChange={colorValueHandler}
					/>
				</div>
				<div className="color-selection">
					<label
						className="label-blue"
						htmlFor="#1a759f">
						<span className="swatch">Blue</span>
					</label>
					<input
						type="radio"
						id="event-color-blue"
						name="event-color"
						value="#1a759f"
						onChange={colorValueHandler}
					/>
				</div>
				<div className="color-selection">
					<label
						className="label-green"
						htmlFor="#a7b300">
						<span className="swatch">Green</span>
					</label>
					<input
						type="radio"
						id="event-color-green"
						name="event-color"
						value="#a7b300"
						onChange={colorValueHandler}
					/>
				</div>
				<div className="color-selection">
					<label
						className="label-orange"
						htmlFor="#d48844">
						<span className="swatch">Orange</span>
					</label>
					<input
						type="radio"
						id="event-color-orange"
						name="event-color"
						value="#d48844"
						onChange={colorValueHandler}
					/>
				</div>

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
