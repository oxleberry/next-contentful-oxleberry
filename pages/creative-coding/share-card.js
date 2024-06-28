import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ShareCard() {
	// States =================
	const [colorInput, setColorInput] = useState('#000000');
	const [textInput, setTextInput] = useState('Welcome!');
	const [textColor, setTextColor] = useState('#ffffff');
	const [isCustomText, setIsCustomText] = useState(false);
	const [galleryImagePath, setGalleryImagePath] = useState('');
	const [galleryImage, setGalleryImage] = useState(null);
	const [galleryImageWidth, setGalleryImageWidth] = useState(0);
	const [galleryImageHeight, setGalleryImageHeight] = useState(0);

	const shareFileRef = useRef(null);
	const shareImageRef = useRef(null);

	// svg text template - shows up on browser, but not showing up on share card...?
	const svgString = `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="0 0 436 210"
		>

			<style>
				.share-container {
					transform: scale(1);
				}

				.share-svg-rect {
					fill: transparent;
				}

				.share-svg-text {
					fill: ${textColor};
					font-size: 42px;
					font-family: sans-serif;
				}

				.share-svg-rect-pink {
					fill: pink;
				}
			</style>

			<g class="share-container">
				<rect class="share-svg-rect" width="436" height="604"></rect>
				<text
				class="share-svg-text"
				x="50%"
				y="90%"
				dominant-baseline="middle"
				text-anchor="middle"
				>${textInput}</text>
			</g>
			<rect class="share-svg-rect-pink" width="100" height="100"></rect>
		</svg>
	`

	function colorInputHandler(event) {
		let value = event.target.value;
		setColorInput(value);
	}

	function textInputHandler(event) {
		let value = event.target.value;
		setTextInput(value);
	}

	function textFocusHandler(event) {
		if (!isCustomText) {
			setTextInput('');
			setIsCustomText(true);
		}
	}

	function galleryClickHandler(event) {
		let image = event.target;
		let imagePath = event.target.src;
		setGalleryImage(image);
		setGalleryImagePath(imagePath);
		setGalleryImageWidth(event.target.offsetWidth);
		setGalleryImageHeight(event.target.offsetHeight);
	}

	function shareTextClickHandler() {
		if (navigator.canShare) {
			console.log("Can Share");
			navigator.share({
				text: 'Oxleberry share card text',
				title: 'Oxleberry share card title',
				url: 'http://oxleberry.com'
			})
		} else {
			console.log("Copy to Clipboard");
			navigator.clipboard.writeText('Oxleberry share card clipboard')
		}
	}

	function shareClickHandler() {
		// create canvas
		const canvas = document.createElement('canvas');
		canvas.width = 436;
		canvas.height = 604;
		const context = canvas.getContext('2d');
		context.fillStyle = colorInput;
		context.fillRect(0, 0, 436, 604);
		shareFileRef.current.prepend(canvas);
		// return canvas;

		// drawImageToCanvas
		if (galleryImage) {
			let	scale = parseFloat(300 / galleryImageWidth).toFixed(2);
			context.drawImage(galleryImage, 68, 235, galleryImageWidth * scale, galleryImageHeight * scale);
		}

		// drawSVGToCanvas - shows up on browser, but not showing up on share card...?
		// version 1
		// const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
		// const img = new Image();
		// img.onload = () => {
		// 	URL.revokeObjectURL(url);
		// 	context.drawImage(img, 0, 0);
		// }
		// img.src = url;
		// version 2
		// const blob = new Blob([svgString], {type: 'image/svg+xml'});
		// const url = URL.createObjectURL(blob);
		// const img = new Image();
		// img.onload = () => context.drawImage(img, 0, 0);
		// img.src = url;

		// draw text
		context.font = "42px Lato";
		context.fillStyle = textColor;
		context.textAlign = "center";
		context.fillText(textInput, 218, 200);

		// pngToCanvas
		const dataUrl = canvas.toDataURL();
		fetch(dataUrl)
			.then(res => res.blob())
			.then(blob => {
				const file = new File([blob], `oxleberry-share-card.png`, {
					type: blob.type,
					lastModified: new Date().getTime()
				});
				// shareFile
				console.log(file);
				const files = [file];
				const data = { files };
				if (navigator.canShare && navigator.canShare({ files })) {
					return navigator.share(data);
				}
			})
			.catch(() => {
				console.warn('Sharing failed.');
			})

		// navigator.share({
		// 	text: "Oxleberry text",
		// 	title: "Oxleberry title"
		// });
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
							<div className="image-display" style={{backgroundImage: `url(${galleryImagePath})`}} />
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
								maxLength="20"
								placeholder="Add Your Text Here"
								value={textInput}
								onChange={textInputHandler}
								onFocus={textFocusHandler}
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
									<img ref={shareImageRef} className="gallery-image" src="/creative-coding-pages/share-card/images/flaming-bunny.png" />
								</button>
							</div>
						</div>
						{/* Share Card Button */}
						<div className="option option-share">
							<button
								type="button"
								className="share-card-button"
								onClick={shareTextClickHandler}
								// onClick={shareClickHandler}
							>Share Card
								<svg className="share-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42">
									<path d="M 35.478516 5.9804688 A 2.0002 2.0002 0 0 0 34.085938 9.4140625 L 35.179688 10.507812 C 23.476587 10.680668 14 20.256715 14 32 A 2.0002 2.0002 0 1 0 18 32 C 18 22.427546 25.627423 14.702715 35.154297 14.517578 L 34.085938 15.585938 A 2.0002 2.0002 0 1 0 36.914062 18.414062 L 41.236328 14.091797 A 2.0002 2.0002 0 0 0 41.228516 10.900391 L 36.914062 6.5859375 A 2.0002 2.0002 0 0 0 35.478516 5.9804688 z M 12.5 6 C 8.9338464 6 6 8.9338464 6 12.5 L 6 35.5 C 6 39.066154 8.9338464 42 12.5 42 L 35.5 42 C 39.066154 42 42 39.066154 42 35.5 L 42 28 A 2.0002 2.0002 0 1 0 38 28 L 38 35.5 C 38 36.903846 36.903846 38 35.5 38 L 12.5 38 C 11.096154 38 10 36.903846 10 35.5 L 10 12.5 C 10 11.096154 11.096154 10 12.5 10 L 20 10 A 2.0002 2.0002 0 1 0 20 6 L 12.5 6 z"></path>
								</svg>
							</button>
						</div>
					</section>

					<section
						id="canvas-container"
						className="canvas-container"
						ref={shareFileRef}
					></section>

				</main>
			</div>
		</>
	);
}