import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ScreenprintDesigner() {
	const initialGalleryImageData = [
		{
			id: 1,
			name: 'sakura-flower',
			url: '/creative-coding-pages/share-card/sakura-flower.png',
		},
		{
			id: 2,
			name: 'sugar-skull',
			url: '/creative-coding-pages/share-card/sugar-skull.png',
		},
		{
			id: 3,
			name: 'flaming-bunny',
			url: '/creative-coding-pages/share-card/flaming-bunny.png',
		}
	]

	// States =================
	const [backgroundColor, setBackgroundColor] = useState('#000000');
	const [galleryImagePath, setGalleryImagePath] = useState('');

	// Functions =================
	function backgroundColorHandler(event) {
		let value = event.target.value;
		setBackgroundColor(value);
	}

	function galleryClickHandler(event) {
		let imagePath = event.target.src;
		setGalleryImagePath(imagePath);
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
							<div className="image-display" style={{backgroundImage: `url(${galleryImagePath})`}} />
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
						{/* Option Galley Image */}
						<div className="option option-image">
							<label className="option-label">Choose an image:</label>
							<div className="gallery-container">
								{initialGalleryImageData.map((image, idx) =>
									<button
										key={idx}
										type="button"
										className="gallery-image-button button-black"
										onClick={galleryClickHandler}>
										<img 
											className={`gallery-image gallery-image-${image.id}`}
											src={image.url}/>
									</button>
								)}
							</div>
						</div>
					</section>

				</main>
			</div>
		</>
	);
}
