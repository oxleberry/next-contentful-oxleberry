import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ShareCard() {
	const borderWidth = 8;

	// States =================
	const [garmentStyle, setGarmentStyle] = useState('adult-tee');
	const [garmentColor, setGarmentColor] = useState('#1d1d1d');
	const [textInput, setTextInput] = useState('Welcome!');
	const [textColor, setTextColor] = useState('#eeddb9');
	const [galleryImage, setGalleryImage] = useState(null);
	const [galleryImageWidth, setGalleryImageWidth] = useState(0);
	const [galleryImageHeight, setGalleryImageHeight] = useState(0);
	const [roundedCorners, setRoundedCorners] = useState(true);
	const [startCursorPos, setStartCursorPos] = useState({ x: null, y: null});
	const [curDragElem, setCurDragElem] = useState(null);
	const [designIdx, setDesignIdx] = useState(-1);
	const [designs, setDesigns] = useState([]);
	const [designZIndex, setDesignZIndex] = useState(-1);
	/* =========================
		designs = [{
			id: number
			path: string
			posX: number
			posY: number
			width: number
			rotate: number
			dragClass: string, ex: 'draggable', 'no-drag'
			zIndex: number
		}]
	========================= */

	// Elements
	const shareFileRef = useRef(null);
	const dragContainerRef = useRef(null);
	let designRefs = useRef([null]);

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

	function garmentColorHandler(event) {
		let value = event.target.value;
		setGarmentColor(value);
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

	function displayColorSwatch(colorId, hexValue) {
		return (
			<div className="option-color">
				<input
					id={`color-${colorId}`}
					className={`color-${colorId}`}
					name="color-selector"
					type="radio"
					value={hexValue}
					onChange={garmentColorHandler}
					style={{background: hexValue}}
				/>
				<label htmlFor="custom-color" className="option-label">{colorId}</label>
			</div>
		)
	}

	function getDesignPosition(design) {
		let parentDistX = dragContainerRef.current.parentElement.getBoundingClientRect().left;
		let artDistX = design.getBoundingClientRect().left;
		let newPosX = artDistX - parentDistX - borderWidth;
		let parentDistY = dragContainerRef.current.parentElement.getBoundingClientRect().top;
		let artDistY = design.getBoundingClientRect().top;
		let updateY = artDistY - parentDistY - borderWidth;
		return { x: newPosX, y: updateY };
	}

	function getCurrentDesign() {
		if (curDragElem == null) {
			let recentDesignAdded = designRefs.current[designRefs.current.length - 1];
			return recentDesignAdded;
		} else {
			return curDragElem
		}
	}

	function sizeClickHandler(event) {
		let currentDesign = getCurrentDesign();
		let currentPos = getDesignPosition(currentDesign);
		let increment = 30;
		let updateWidth;
		let updatePosX;
		let updatePosY;
		// extracting the digits from the width style
		let widthValue = currentDesign.style.width.replace(/\D/g, '');
		// increment based on button clicked
		if (event.target.id == "plus") {
			updateWidth = +widthValue + increment;
			updatePosX = currentPos.x - increment / 2;
			updatePosY = currentPos.y - increment / 2;
		} else if (event.target.id == "minus") {
			updateWidth = +widthValue - increment;
			updatePosX = currentPos.x + increment / 2;
			updatePosY = currentPos.y + increment / 2;
		}
		// update width of current design &
		// update position of current design (to update size from the center)
		setDesigns(designs.map(design => {
			if (design.id == currentDesign.id) {
				return { ...design, width: updateWidth, posX: updatePosX, posY: updatePosY };
			} else {
				return design; // no changes to these item
			}
		}));
	}

	function rotateClickHandler(event) {
		let currentDesign = getCurrentDesign();
		let increment = 15;
		// update rotate value of current design
		if (event.target.id == "rotate-left") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					let updateRotate = design.rotate - increment;
					return { ...design, rotate: updateRotate };
				} else {
					return design;
				}
			}));
		} else if (event.target.id == "rotate-right") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					let updateRotate = design.rotate + increment;
					return { ...design, rotate: updateRotate };
				} else {
					return design;
				}
			}));
		}
	}

	function deleteClickHandler(event) {
		// skip if designs are empty
		if (designRefs.current[0] === null) return;
		let currentDesign = getCurrentDesign();
		let currentDesignId = +currentDesign.id;
		// remove current design
		setDesigns(
			designs.filter(design => design.id !== currentDesignId)
		);
		designRefs.current.pop();
		// set current design to last design added
		let lastDesign = designRefs.current[designRefs.current.length - 1];
		setCurDragElem(lastDesign);
	}

	function setNewDesign(image) {
		let nextId = designIdx + 1;
		let nextZIndex = designZIndex + 1;
		setDesignIdx(nextId);
		setDesignZIndex(nextZIndex);
		// add a new design
		setDesigns(
			[
				...designs,
				{
					id: nextId,
					path: image,
					posX: 175,
					posY: 130,
					width: 220,
					rotate: 0,
					dragClass: 'draggable',
					zIndex: nextZIndex
				}
			]
		);
		// clear target element
		setCurDragElem(null);
	}

	function uploadImageClickHandler(event) {
		let imageFile;
		let reader;
		let uploadImage;
		imageFile = event.target.files[0];
		if(!imageFile.type.match('image.*')) {
			alert("This file is not a unsupported image file");
			return;
		}
		reader = new FileReader();
		reader.addEventListener('load', (function() {
			return function(event) {
				uploadImage = event.target.result;
				setNewDesign(uploadImage);
			};
		})(imageFile), false);
		reader.readAsDataURL(imageFile);
	}

	function galleryClickHandler(event) {
		let galleryImagePath = event.target.src;
		setNewDesign(galleryImagePath);
	}


	// =======================================
	// Draggable Image functions
	// =======================================
	function dragStartHandler(event) {
		if (event.target == null) return;
		// track current desing & cursor start position
		setCurDragElem(event.target.parentElement);
		setStartCursorPos({
			x: event.clientX,
			y: event.clientY
		});
		let nextZIndex = designZIndex + 1;
		setDesignZIndex(nextZIndex);
		// set current design to top z-index
		// set all other designs to not be draggable
		setDesigns(designs.map((design, idx) => {
			if (design.id == event.target.id) { // find unique item
				return { ...design, zIndex: nextZIndex }; // update current design
			} else {
				return { ...design, dragClass: 'no-drag' }; // update all other items
			}
		}));
	}

	function dragOverHandler(event) {
		if (event.target == null) return;
		event.preventDefault();
		let currentDesign = designs.find(design => design.id == event.target.id);
		if (currentDesign == undefined) return;
		// calculate new position
		let cursorX = event.clientX;
		let cursorY = event.clientY;
		let distanceX = cursorX - startCursorPos.x;
		let distanceY = cursorY - startCursorPos.y;
		curDragElem.style.left = currentDesign.posX + distanceX + 'px';
		curDragElem.style.top = currentDesign.posY + distanceY + 'px';
	}

	function dragDropHandler(event) {
		if (event.target == null) return;
		event.preventDefault();
		let currentPos = getDesignPosition(curDragElem);
		// update position of art & reset all items to be draggable
		setDesigns(designs.map(design => {
			if (design.id == event.target.id) { // find unique item
				return { ...design, posX: currentPos.x, posY: currentPos.y, dragClass: 'draggable' }; // update target item
			} else {
				return { ...design, dragClass: 'draggable' }; // update all other items
			}
		}));
	}


	// =======================================
	// Share Card functions
	// =======================================
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
		context.fillStyle = garmentColor;
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
		context.fillStyle = garmentColor;
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
				<meta name="description" content="Oxleberry Design a T-Shirt" />
			</Head>
			<div className="full-backboard share-card-tee-page">
				<Header headline="Design a T-shirt" isSubPage={true}></Header>
				<main>

					<section className="share-content-section">
						<div
							className="share-content-container"
							ref={dragContainerRef}
							onDragOver={event => dragOverHandler(event, false)}
							onDrop={event => dragDropHandler(event, false)}
							style={{background: garmentColor, borderWidth: `${borderWidth}px`}}
						>
							{designs.map((design, idx) =>
								<div
									className={`design-image-wrapper ${design.dragClass}`}
									key={idx}
									id={design.id}
									draggable
									ref={(el) => (designRefs.current[idx] = el)}
									style={{left: design.posX, top: design.posY, width: design.width, zIndex: design.zIndex}}
									>
									<img
										src={design.path}
										alt=""
										id={design.id}
										className={`design-image design-${idx} ${design.dragClass}`}
										draggable
										onDragStart={event => dragStartHandler(event, false)}
										style={{transform: `rotate(${design.rotate}deg)`, width: design.width}}
									/>
								</div>
							)}
							<img className="tee-image" src={`/creative-coding-pages/share-card/images/${garmentStyle}.png`} />
							<h2 className="hidden">Share Content</h2>
						</div>
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						{/* Option - Garment style */}
						<div className="option-section option-garment-style">
							<legend className="option-label">Garment style:</legend>
							{displayGarmentOption('adult-tee', 'Adult', true)}
							{displayGarmentOption('womens-tee', 'Womens', false)}
							{displayGarmentOption('onesie', 'Onesie', false)}
						</div>
						{/* Option Pick a Color */}
						<div className="option-section option-garment-color">
							<legend className="option-label">Garment color:</legend>
							{displayColorSwatch('black', '#1d1d1d')}
							{displayColorSwatch('red', '#d41b02')}
							{displayColorSwatch('gold', '#ffaa00')}
							{displayColorSwatch('olive', '#5f6e1f')}
							{displayColorSwatch('navy', '#022c59')}
							{displayColorSwatch('pink', '#ffade2')}
							{displayColorSwatch('charcoal', '#4d4b49')}
							{displayColorSwatch('grey', '#bfbebb')}
							{displayColorSwatch('white', '#fff')}
							<div className="option-color">
								<input
									id="color-custom"
									className="color-selector"
									name="color-selector"
									type="color"
									defaultValue="#9daec1"
									onChange={garmentColorHandler}
								/>
								<label htmlFor="custom-color" className="option-label">Custom</label>
							</div>
						</div>

						<div className="option-section option-size-rotate-delete">
							{/* Option Size */}
							<div className="sub-container">
								<div className="option-size">
									<label className="option-label">Art size:</label>
									<button
										id="minus"
										className="option-button"
										onClick={sizeClickHandler}
									>-</button>
									<button
										id="plus"
										className="option-button"
										onClick={sizeClickHandler}
									>+</button>
								</div>
							</div>
							{/* Option Rotate */}
							<div className="sub-container">
								<div className="option-rotate">
									<label className="option-label">Rotate art:</label>
									<button
										id="rotate-left"
										className="option-button"
										onClick={rotateClickHandler} >
										<svg className="rotate-icon rotate-left-icon" viewBox="0 0 500 500">
											<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
										</svg>
									</button>
									<button
										id="rotate-right"
										className="option-button"
										onClick={rotateClickHandler} >
										<svg className="rotate-icon rotate-right-icon" viewBox="0 0 500 500">
											<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
										</svg>
									</button>
								</div>
							</div>
							{/* Option Delete */}
							<div className="sub-container">
								<div className="option-delete">
									<label className="option-label hidden">Delete:</label>
									<button
										id="delete"
										className="option-button"
										onClick={deleteClickHandler} >
										<svg className="delete-icon" viewBox="0 0 32 32">
											<path d="M25 4h-18c-1.657 0-3 1.343-3 3v1h24v-1c0-1.657-1.343-3-3-3zM19.76 2l0.441 3.156h-8.402l0.441-3.156h7.52zM20 0h-8c-0.825 0-1.593 0.668-1.708 1.486l-0.585 4.185c-0.114 0.817 0.467 1.486 1.292 1.486h10c0.825 0 1.407-0.668 1.292-1.486l-0.585-4.185c-0.114-0.817-0.883-1.486-1.708-1.486v0zM25.5 10h-19c-1.1 0-1.918 0.896-1.819 1.992l1.638 18.016c0.1 1.095 1.081 1.992 2.181 1.992h15c1.1 0 2.081-0.896 2.181-1.992l1.638-18.016c0.1-1.095-0.719-1.992-1.819-1.992zM12 28h-3l-1-14h4v14zM18 28h-4v-14h4v14zM23 28h-3v-14h4l-1 14z" fill="#000000"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>

						{/* Option Upload an Image */}
						<div className="option-section option-upload-image">
							<label htmlFor="upload-image" className="option-label">Upload in image:</label>
							<input
								id="upload-image"
								onChange={uploadImageClickHandler}
								type="file"
								name="custom-image"
								accept=".png, .jpg, .jpeg, .gif, .webp"/>
						</div>

						{/* Option Galley Image */}
						<div className="option-section option-image">
							<label className="option-label">Choose an image:</label>
							<div className="gallery-container">
								<button
									type="button"
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}
								>
									{/* <img className="gallery-image gallery-image-1" src="/creative-coding-pages/share-card/images/geo-flower.svg" /> */}
									<img className="gallery-image gallery-image-1" src="/creative-coding-pages/share-card/images/sakura-flower.svg" />
								</button>
								<button
									type="button"
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}
								>
									<img className="gallery-image c" src="/creative-coding-pages/share-card/images/sugar-skull.svg" />
								</button>
								<button
									type="button"
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}
								>
									<img className="gallery-image gallery-image-3" src="/creative-coding-pages/share-card/images/flaming-bunny.png" />
								</button>
							</div>
						</div>
						{/* Share Card Button */}
						<div className="option-section option-share">
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
						{/* <div className="option-section option-share">
							<button
								type="button"
								className="share-button"
								onClick={shareUrlClickHandler}
							>Share Url
							</button>
						</div> */}
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
