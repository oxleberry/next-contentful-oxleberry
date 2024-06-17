import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ShareCard() {
	// States =================
	const [textInput, setTextInput] = useState('');

	function textInputHandler(event) {
		let value = event.target.value;
		setTextInput(value);
	}

	return (
		<>
			<Head>
				<title>Oxleberry | Share Card</title>
				<meta name="description" content="Oxleberry Share Card - Send a custom greeting" />
			</Head>
			<div className="full-backboard share-card-page">
				<Header headline="Share Card" isSubPage={true}></Header>
				<main>

					<section className="share-content-container">
						<h2 className="hidden">Share Content</h2>
						<div id="design-target">
							{/* <img id="design-display" src="" /> */}
							<p id="text-display" className="custom-text-output">{textInput}</p>
						</div>
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						<div className="option option-color">
							<label className="option-label">Choose a color:</label>
						</div>
						<div className="option option-custom-image">
							<label className="option-label">Upload in image:</label>
						</div>
						<div className="option option-text">
							<label htmlFor="custom-text" className="option-label">Create text:</label>
							<input
								id="custom-text"
								className="custom-text"
								name="custom-text"
								type="text"
								placeholder="Add Your Text Here"
								value={textInput}
								onChange={textInputHandler}
							/>
						</div>
						<div className="option option-image">
							<label className="option-label">Choose an image from the gallery:</label>
						</div>
					</section>

					<section className="canvas-container"></section>

				</main>
			</div>
		</>
	);
}
