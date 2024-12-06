import Head from 'next/head'
import Header from '../../components/Header'
import { useState, useRef } from 'react'
import { createClient } from 'contentful'


// get CMS content =================
export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});
	const res = await client.getEntries({ content_type: 'screenprintDesigner' });
	return {
		props: { screenprintDesignerItems: res.items }
	}
}


export default function ShareCard({ screenprintDesignerItems }) {
	// Assets & CMS Content =================
	const galleryImagesItems = screenprintDesignerItems.filter((item) => item.fields.id === 'galleryImages');
	const galleryImagesImages = galleryImagesItems[0].fields.images;

	// Variables =================
	const roundedCorners = true;

	// States =================
	const [backgroundColor, setBackgroundColor] = useState('#000000');
	const [textInput, setTextInput] = useState('Welcome!');
	const [textColor, setTextColor] = useState('#eeddb9');
	const [isCustomText, setIsCustomText] = useState(false);
	const [galleryImagePath, setGalleryImagePath] = useState('');
	const [galleryImage, setGalleryImage] = useState(null);
	const [galleryImageWidth, setGalleryImageWidth] = useState(0);
	const [galleryImageHeight, setGalleryImageHeight] = useState(0);

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

	function galleryClickHandler(event) {
		let image = event.target;
		let imagePath = event.target.src;
		image.crossOrigin='anonymous';
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
				<title>Oxleberry | Share Card</title>
				<meta name="description" content="Oxleberry Share Card - Send a custom greeting card" />
			</Head>
			<div className="full-backboard share-card-page">
				<Header headline="Share Card" isSubPage={true}></Header>
				<main>

					<section className="share-content-section">
						<div className="share-content-container" style={{background: `${backgroundColor}`}}>
							<h2 className="hidden">Share Content</h2>
							<p className="text-display" style={{color: `${textColor}`}}>{textInput}</p>
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
								{galleryImagesImages.map((image, idx) =>
									<button
										key={idx}
										type="button"
										className="gallery-image-button"
										onClick={galleryClickHandler}
										aria-label={image.ariaLabel}>
										<img
											className={`gallery-image gallery-image-${idx + 1}`}
											src={`https:${image.fields.file.url}`}/>
									</button>
								)}
							</div>
						</div>
						{/* Share Card Button */}
						<div className="option option-share">
							<button
								type="button"
								className="share-button"
								onClick={shareCardClickHandler}
							>Create Share Card</button>
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
