import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ShareCard() {
	// States =================
	const [colorInput, setColorInput] = useState('black');
	const [textInput, setTextInput] = useState('Welcome!');
	const [galleryImage, setGalleryImage] = useState('');

	function colorInputHandler(event) {
		let value = event.target.value;
		setColorInput(value);
	}

	function textInputHandler(event) {
		let value = event.target.value;
		setTextInput(value);
	}

	function galleryClickHandler(event) {
		let imagePath = event.target.src;
		setGalleryImage(imagePath);
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

					<section className="share-content-container" style={{background: `${colorInput}`}}>
						<h2 className="hidden">Share Content</h2>
							<p className="text-display">{textInput}</p>
							<div className="image-display" style={{backgroundImage: `url(${galleryImage})`}} />
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						{/* Option Pick a Color */}
						<div className="option option-color">
							<label htmlFor="custom-color" className="option-label">Pick a color:</label>
							<input
								id="custom-color"
								className="custom-color"
								name="custom-color"
								type="color"
								value={colorInput}
								onChange={colorInputHandler}
							/>
						</div>
						{/* Option Upload an Image */}
						{/* <div className="option option-custom-image">
							<label className="option-label">Upload in image:</label>
						</div> */}
						{/* Option Custom Text */}
						<div className="option option-text">
							<label htmlFor="custom-text" className="option-label">Customize text:</label>
							<input
								id="custom-text"
								className="custom-text"
								name="custom-text"
								type="text"
								maxlength="70"
								placeholder="Add Your Text Here"
								value={textInput}
								onChange={textInputHandler}
							/>
						</div>
						{/* Option Galley Image */}
						<div className="option option-image">
							<label className="option-label">Choose a gallery image:</label>
							<div className="gallery-container">
								<button 
									type="button" 
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}
								>
									<img className="gallery-image" src="/creative-coding-pages/share-card/images/geo-flower.svg" />
								</button>
								<button 
									type="button" 
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}
								>
									<img className="gallery-image" src="/creative-coding-pages/share-card/images/sugar-skull.svg" />
								</button>
								<button 
									type="button" 
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}
								>
									<img className="gallery-image" src="/creative-coding-pages/share-card/images/flaming-bunny.png" />
								</button>
							</div>
						</div>
					</section>

					<section className="canvas-container"></section>

				</main>
			</div>
		</>
	);
}
