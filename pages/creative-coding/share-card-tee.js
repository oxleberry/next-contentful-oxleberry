import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ShareCard() {
	// States =================
	const [garmentStyle, setGarmentStyle] = useState('adult-tee');
	const [backgroundColor, setBackgroundColor] = useState('pink');
	// const [backgroundColor, setBackgroundColor] = useState('#000000');
	const [textInput, setTextInput] = useState('Welcome!');
	const [textColor, setTextColor] = useState('#eeddb9');
	const [isCustomText, setIsCustomText] = useState(false);
	const [galleryImagePath, setGalleryImagePath] = useState('');
	const [galleryImage, setGalleryImage] = useState(null);
	const [galleryImageWidth, setGalleryImageWidth] = useState(0);
	const [galleryImageHeight, setGalleryImageHeight] = useState(0);
	const [roundedCorners, setRoundedCorners] = useState(true);

	// Elements
	const shareFileRef = useRef(null);

	// NOTE: not currently working - shows up on browser, but not showing up on share card
	const svgString = `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="0 0 400 100"
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
				<rect class="share-svg-rect" width="400" height="400"></rect>
				<text
				class="share-svg-text"
				x="50%"
				y="80%"
				dominant-baseline="middle"
				text-anchor="middle"
				>${textInput}</text>
			</g>
			<rect class="share-svg-rect-pink" width="100" height="100"></rect>
		</svg>
	`

	function garmentStyleHandler(event) {
		let value = event.target.value;
		setGarmentStyle(value);
	}

	function backgroundColorHandler(event) {
		let value = event.target.value;
		setBackgroundColor(value);
	}

	function textColorHandler(event) {
		let value = event.target.value;
		setTextColor(value);
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

	function displayGarmentOption(garmentId, garmentName, defaultChecked) {
		return (
			<div className="option-garment">
				<input
					id={garmentId}
					className="custom-garment"
					name="custom-garment"
					type="radio"
					value={garmentId}
					defaultChecked={defaultChecked}
					onChange={garmentStyleHandler}
				/>
				<label htmlFor="custom-garment" className="option-label">{garmentName}</label>
			</div>
		)
	}

	function galleryClickHandler(event) {
		let image = event.target;
		let imagePath = event.target.src;
		setGalleryImage(image);
		setGalleryImagePath(imagePath);
		setGalleryImageWidth(event.target.offsetWidth);
		setGalleryImageHeight(event.target.offsetHeight);
	}

	function createCanvas() {
		const canvas = document.createElement('canvas');
		canvas.width = 400;
		canvas.height = 400;
		const context = canvas.getContext('2d');
		context.save(); // Save the current state
		// Clips rounded corners on share card
		if (roundedCorners) {
			drawRoundedCorners(canvas);
		}
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, 400, 400);
		context.restore(); // Restore to the state saved by the most recent call to save()
		shareFileRef.current.prepend(canvas);
		return canvas;
	}

	function drawRoundedCorners(canvas) {
		const width = 400;
		const height = 400;
		const top = 0;
		const left = 0;
		const cornerRadius = 40;
		const context = canvas.getContext('2d');
		context.beginPath();
		context.fillStyle = backgroundColor;
		context.moveTo(cornerRadius, 0);
		context.arcTo(width, top, width, height, cornerRadius);
		context.arcTo(width, height, left, height, cornerRadius);
		context.arcTo(left, height, left, top, cornerRadius);
		context.arcTo(left, top, width, top, cornerRadius);
		context.closePath();
		context.clip();
	}

	function drawImageToCanvas(canvas) {
		if (galleryImage) {
			const context = canvas.getContext('2d');
			const	scale = parseFloat(250 / galleryImageWidth).toFixed(2);
			context.drawImage(galleryImage, 75, 140, galleryImageWidth * scale, galleryImageHeight * scale);
		}
	}

	function drawTextToCanvas(canvas) {
		const context = canvas.getContext('2d');
		context.font = "42px Lato";
		context.fillStyle = textColor;
		context.textAlign = "center";
		const x = 200;
		let y = 90;
		const lineheight = 46;
		const lineWidthMax = 20;
		if (textInput.length > lineWidthMax) {
			drawWrappedTextLinesToCanvas(x, y, lineheight, lineWidthMax, canvas);
		} else {
			context.fillText(textInput, x, y);
		}
	}

	function drawWrappedTextLinesToCanvas(x, y, lineheight, lineWidthMax, canvas) {
		y = y - (lineheight / 2); // start half a line height higher
		const context = canvas.getContext('2d');
		const words =  textInput.split(' ');
		let currentLine = '';
		let textLines = [];
		// seperate words into lines of text that will fit
		for (var i = 0; i < words.length; i++) {
			const word = words[i];
			const lineWithNextWord = currentLine + word + ' ';
			if (lineWithNextWord.length < lineWidthMax) {
				// current word fits so add it to the currentLine
				currentLine = lineWithNextWord;
			} else {
				// current line is full, add it to textLines array
				textLines.push(currentLine);
				// reset check for next line of text
				currentLine = word + ' ';
			}
		}
		// add remaining text to textLines array
		textLines.push(currentLine);
		// draws wrapped lines of text
		for (let i = 0; i < textLines.length; i++) {
			context.fillText(textLines[i], x, y + (i * lineheight));
		}
	}

	// NOTE: not currently working - shows up on browser, but not showing up on share card
	function drawSVGToCanvas(canvas) {
		// version 1
		const context = canvas.getContext('2d');
		const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			context.drawImage(img, 0, 0);
		}
		img.src = url;
		// version 2
		// const blob = new Blob([svgString], {type: 'image/svg+xml'});
		// const url = URL.createObjectURL(blob);
		// const img = new Image();
		// img.onload = () => context.drawImage(img, 0, 0);
		// img.src = url;
	}

	function shareFile(canvas) {
		// canvasToPng
		const dataUrl = canvas.toDataURL();
		fetch(dataUrl)
			.then(res => res.blob())
			.then(blob => {
				const fileName = `oxleberry-share-card-${new Date().getTime()}.png`
				const file = new File([blob], fileName, {
					type: blob.type,
					lastModified: new Date().getTime()
				});
				// shareFile
				const files = [file];
				const data = { files };
				if (navigator.canShare && navigator.canShare({ files })) {
					return navigator.share(data);
				} else {
					console.warn('Sharing failed.');
				}
			})
			.catch(() => {
				console.warn('Canvas to Png failed.');
			})
	}

	function shareCardClickHandler() {
		const canvas = createCanvas();
		drawImageToCanvas(canvas);
		drawTextToCanvas(canvas);
		// drawSVGToCanvas(canvas); // NOTE: not currently working - shows up on browser, but not showing up on share card
		shareFile(canvas);
	}

	function shareUrlClickHandler() {
		const shareData = {
			title: "Oxleberry Share Card",
			url: "share-card",
		};
		if (navigator.canShare) {
			return navigator.share(shareData);
		} else {
			const currentUrl = window.location.href;
			navigator.clipboard.writeText(currentUrl);
		}
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Design a T-shirt</title>
				<meta name="description" content="Oxleberry Design a T-shirt" />
			</Head>
			<div className="full-backboard share-card-tee-page">
				<Header headline="Design a T-shirt" isSubPage={true}></Header>
				<main>

					<section className="share-content-section">
						<div className="share-content-container" style={{background: `${backgroundColor}`}}>
							<img className="tee-image" src={`/creative-coding-pages/share-card/images/${garmentStyle}.png`} />
							<h2 className="hidden">Share Content</h2>
							<p className="text-display" style={{color: `${textColor}`}}>{textInput}</p>
							<div className="image-display" style={{backgroundImage: `url(${galleryImagePath})`}} />
						</div>
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						{/* Option - Garment style */}
						<div className="option option-garment-style">
							<legend className="option-label">Garment style:</legend>
							{displayGarmentOption('adult-tee', 'Adult', true)}
							{displayGarmentOption('womens-tee', 'Womens', false)}
							{displayGarmentOption('onesie', 'Onesie', false)}
						</div>
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
						{/* Option Upload an Image */}
						{/* <div className="option option-custom-image">
							<label className="option-label">Upload in image:</label>
						</div> */}
						{/* Option Custom Text */}
						<div className="option option-text">
							<div className="row">
								<label htmlFor="custom-text" className="option-label">Customize text:</label>
								<input
									id="custom-text-color"
									className="custom-text-color"
									name="custom-text-color"
									type="color"
									value={textColor}
									onChange={textColorHandler}
								/>
							</div>
							<input
								id="custom-text"
								className="custom-text"
								name="custom-text"
								type="text"
								maxLength="34" // max characters for 2 lines of text
								placeholder="maximum 34 characters"
								value={textInput}
								onChange={textInputHandler}
								onFocus={textFocusHandler}
							/>
						</div>
						{/* Option Galley Image */}
						<div className="option option-image">
							<label className="option-label">Choose an image:</label>
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
						{/* Share Card Button */}
						<div className="option option-share">
							<button
								type="button"
								className="share-button"
								onClick={shareCardClickHandler}
							>Create Share Card
								{/* <svg className="share-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42">
									<path d="M 35.478516 5.9804688 A 2.0002 2.0002 0 0 0 34.085938 9.4140625 L 35.179688 10.507812 C 23.476587 10.680668 14 20.256715 14 32 A 2.0002 2.0002 0 1 0 18 32 C 18 22.427546 25.627423 14.702715 35.154297 14.517578 L 34.085938 15.585938 A 2.0002 2.0002 0 1 0 36.914062 18.414062 L 41.236328 14.091797 A 2.0002 2.0002 0 0 0 41.228516 10.900391 L 36.914062 6.5859375 A 2.0002 2.0002 0 0 0 35.478516 5.9804688 z M 12.5 6 C 8.9338464 6 6 8.9338464 6 12.5 L 6 35.5 C 6 39.066154 8.9338464 42 12.5 42 L 35.5 42 C 39.066154 42 42 39.066154 42 35.5 L 42 28 A 2.0002 2.0002 0 1 0 38 28 L 38 35.5 C 38 36.903846 36.903846 38 35.5 38 L 12.5 38 C 11.096154 38 10 36.903846 10 35.5 L 10 12.5 C 10 11.096154 11.096154 10 12.5 10 L 20 10 A 2.0002 2.0002 0 1 0 20 6 L 12.5 6 z"></path>
								</svg> */}
							</button>
						</div>
						{/* Share Url Button */}
						<div className="option option-share">
							<button
								type="button"
								className="share-button"
								onClick={shareUrlClickHandler}
							>Share Url
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
