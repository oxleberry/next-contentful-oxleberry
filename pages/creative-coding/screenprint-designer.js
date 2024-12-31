import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ScreenprintDesigner() {
	// States =================
	const [backgroundColor, setBackgroundColor] = useState('#000000');

	// Functions =================
	function backgroundColorHandler(event) {
		let value = event.target.value;
		setBackgroundColor(value);
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Screenprint Designer</title>
				<meta name="description" content="Oxleberry Screenprint Designer - Mockup your design on a tee shirt" />
			</Head>
			<div className="full-backboard screenprint-designer-page">
				<Header headline="Screenprint Designer" isSubPage={true}></Header>
				<main>
					<section className="share-content-section">
						<div className="share-content-container" style={{background: `${backgroundColor}`}}>
							<h2 className="hidden">Share Content</h2>
						</div>
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						{/* Option Pick a Color */}
						<div className="option option-color">
							<label htmlFor="custom-color" className="option-label">Pick a background color:</label>
							<input
								id="custom-color"
								className="custom-color"
								name="custom-color"
								type="color"
								value={backgroundColor}
								onChange={backgroundColorHandler}
							/>
						</div>
					</section>

				</main>
			</div>
		</>
	);
}
