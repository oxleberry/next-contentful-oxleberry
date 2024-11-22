import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'

export default function ScreenprintDesigner() {
	const borderWidth = 8;
	const seedGarmentStyleData = [
		{
			id: 1,
			name: 'Adult',
			value: 'adult-tee',
			isActive: true
		},
		{
			id: 2,
			name: 'Womens',
			value: 'womens-tee',
			isActive: false
		},
		{
			id: 3,
			name: 'Onesie',
			value: 'onesie',
			isActive: false
		}
	]

	const seedGarmentColorData = [
		{
			id: 1,
			name: 'black',
			value: '#1d1d1d',
			isActive: true
		},
		{
			id: 2,
			name: 'red',
			value: '#d41b02',
			isActive: false
		},
		{
			id: 3,
			name: 'gold',
			value: '#ffaa00',
			isActive: false
		},
		{
			id: 4,
			name: 'olive',
			value: '#5f6e1f',
			isActive: false
		},
		{
			id: 5,
			name: 'navy',
			value: '#022c59',
			isActive: false
		},
		{
			id: 6,
			name: 'pink',
			value: '#ffade2',
			isActive: false
		},
		{
			id: 7,
			name: 'charcoal',
			value: '#4d4b49',
			isActive: false
		},
		{
			id: 8,
			name: 'tan',
			value: '#cbb699',
			isActive: false
		},
		{
			id: 9,
			name: 'grey',
			value: '#bfbebb',
			isActive: false
		},
		{
			id: 10,
			name: 'white',
			value: '#fff',
			isActive: false
		}
	]

	const seedFilterData = [
		{
			id: 1,
			name: 'None',
			value: 'normal',
			isActive: true
		},
		{
			id: 2,
			name: 'Lighten',
			value: 'lighten',
			isActive: false
		},
		{
			id: 3,
			name: 'Darken',
			value: 'darken',
			isActive: false
		},
		{
			id: 4,
			name: 'Multiply',
			value: 'multiply',
			isActive: false
		},
		{
			id: 5,
			name: 'Screen',
			value: 'screen',
			isActive: false
		},
		{
			id: 6,
			name: 'Overlay',
			value: 'overlay',
			isActive: false
		},
		{
			id: 7,
			name: 'Hard Light',
			value: 'hard-light',
			isActive: false
		},
		{
			id: 8,
			name: 'Luminosity',
			value: 'luminosity',
			isActive: false
		},
		{
			id: 9,
			name: 'Grayscale',
			value: 'grayscale(100%)',
			isActive: false
		}
	]

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
	const [designZIndex, setDesignZIndex] = useState(-1);
	const [filterButtons, setFilterButtons] = useState(seedFilterData);
	const [designs, setDesigns] = useState([]);
	/* =========================
		designs = [{
			id: number
			path: string
			posX: number
			posY: number
			width: number
			rotate: number
			filter: string
			grayscale: string
			borderRadius: number
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

	function roundedCornersClickHandler(event) {
		let currentDesign = getCurrentDesign();
		let increment = 20;
		let updateBorderRadius;
		// update rounded corners value of current design
		if (event.target.id == "decrease") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					// if border radius is at zero, no need to decrease further
					if (design.borderRadius == 0) {
						return design;
					} else {
						updateBorderRadius = design.borderRadius - increment;
						return { ...design, borderRadius: updateBorderRadius };
					}
				} else {
					return design;
				}
			}));
		} else if (event.target.id == "increase") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					updateBorderRadius = design.borderRadius + increment;
					return { ...design, borderRadius: updateBorderRadius };
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
		// remove all filters status
		setFilterButtons(filterButtons.map(filter => {
			return { ...filter, isActive: false };
		}));
	}

	function filterClickHandler(event) {
		let currentDesign = getCurrentDesign();
		if (event.target.value == "grayscale(100%)") {
			// update grayscale of current design, reset filter style of current design
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					return { ...design, filter: 'normal', grayscale: event.target.id };
				} else {
					return design;
				}
			}));
		} else {
			// update filter style of current design, reset grayscale of current design
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					return { ...design, filter: event.target.id, grayscale: 'initial' };
				} else {
					return design;
				}
			}));
		}
		// update current filter button to be active
		setFilterButtons(filterButtons.map(filter => {
			if (filter.value == event.target.value) {
				return { ...filter, isActive: true };
			} else {
				return { ...filter, isActive: false };
			}
		}));
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
					filter: 'normal',
					grayscale: 'initial',
					borderRadius: 0,
					zIndex: nextZIndex
				}
			]
		);
		// clear target element
		setCurDragElem(null);
		// reset filter buttons to default filter
		setFilterButtons(filterButtons.map(filter => {
			if (filter.value == 'normal') {
				return { ...filter, isActive: true };
			} else {
				return { ...filter, isActive: false };
			}
		}));
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
		let galleryImagePath = event.target.firstElementChild.src;
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
		let designFilter;
		let designGrayscale;
		let nextZIndex = designZIndex + 1;
		setDesignZIndex(nextZIndex);
		// set current design to top z-index
		// set all other designs to not be draggable
		setDesigns(designs.map((design, idx) => {
			if (design.id == event.target.id) { // find unique item
				designFilter = design.filter;
				designGrayscale = design.grayscale;
				return { ...design, zIndex: nextZIndex }; // update current design
			} else {
				return { ...design, dragClass: 'no-drag' }; // update all other items
			}
		}));
		// update filter buttons
		if (designGrayscale == "grayscale(100%)") {
			// set filter buttons to grayscale button
			setFilterButtons(filterButtons.map(filter => {
				if (filter.value == designGrayscale) {
					return { ...filter, isActive: true };
				} else {
					return { ...filter, isActive: false };
				}
			}));
		} else {
			// set filter buttons to filter type of current design
			setFilterButtons(filterButtons.map(filter => {
				if (filter.value == designFilter) {
					return { ...filter, isActive: true };
				} else {
					return { ...filter, isActive: false };
				}
			}));
		}
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
				<title>Oxleberry | Screenprint Designer</title>
				<meta name="description" content="Oxleberry - Screenprint Designer" />
			</Head>
			<div className="full-backboard screenprint-designer-page">
				<Header headline="Screenprint Designer" isSubPage={true}></Header>
				<main>

					{/* Design layout container */}
					<section className="design-layout-section">
						<div
							className="design-layout-container"
							ref={dragContainerRef}
							onDragOver={event => dragOverHandler(event, false)}
							onDrop={event => dragDropHandler(event, false)}
							style={{background: garmentColor, borderWidth: `${borderWidth}px`}}
						>
							<h2 className="hidden">Design layout workspace</h2>
							<img className="tee-image" src={`/creative-coding-pages/share-card/images/${garmentStyle}.png`} alt="screenprint designer workspace"/>
							{designs.map((design, idx) =>
								<div
									className={`design-image-wrapper ${design.dragClass}`}
									key={idx}
									id={design.id}
									draggable
									ref={(el) => (designRefs.current[idx] = el)}
									style={{
										left: design.posX,
										top: design.posY,
										width: design.width,
										mixBlendMode: design.filter,
										filter: design.grayscale,
										zIndex: design.zIndex
									}}
									>
									<img
										src={design.path}
										alt=""
										id={design.id}
										className={`design-image design-${idx} ${design.dragClass}`}
										draggable
										onDragStart={event => dragStartHandler(event, false)}
										style={{
											transform: `rotate(${design.rotate}deg)`,
											width: design.width,
											borderRadius: `${design.borderRadius}px`
										}}
									/>
								</div>
							)}
						</div>
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						{/* Option - Garment style */}
						<div className="option-section option-garment-style">
							<legend className="option-label">Garment style:</legend>
							{seedGarmentStyleData.map((garment, idx) =>
								<div key={idx} className="option-garment">
									<input
										id={garment.value}
										className="custom-garment"
										name="custom-garment"
										type="radio"
										value={garment.value}
										defaultChecked={garment.isActive}
										onChange={garmentStyleHandler}
									/>
									<label htmlFor={garment.value} className="option-label">{garment.name}</label>
								</div>
							)}
						</div>

						{/* Option Pick a Color */}
						<div className="option-section option-garment-color">
							<legend className="option-label">Garment color:</legend>
							{seedGarmentColorData.map((color, idx) =>
								<div key={idx} className="option-color">
									<input
										id={`color-${color.name}`}
										className={`color-${color.name}`}
										name="color-selector"
										type="radio"
										value={color.value}
										defaultChecked={color.isActive}
										onChange={garmentColorHandler}
										style={{background: color.value}}
									/>
									<label htmlFor={`color-${color.name}`} className="option-label">{color.name}</label>
								</div>
							)}
							<div className="option-color">
								<input
									id="color-custom"
									className="color-custom"
									name="color-custom"
									type="color"
									defaultValue="#9daec1"
									onChange={garmentColorHandler}
								/>
								<label htmlFor="custom-color" className="option-label">Custom</label>
							</div>
						</div>

						<div className="option-section sub-section-container images-section">
							{/* Option Upload an Image */}
							<div className="sub-divider">
								<div className="option-sub-section option-upload-image">
									<label htmlFor="upload-image" className="option-label">Upload an image:</label>
									<input
										id="upload-image"
										onChange={uploadImageClickHandler}
										type="file"
										name="custom-image"
										accept=".png, .jpg, .jpeg, .gif, .webp"/>
								</div>
							</div>
							{/* Option Galley Image */}
							<div className="sub-divider">
								<div className="option-sub-section option-image-gallery">
									<label className="option-label">Choose an image:</label>
									<div className="gallery-container">
										<button
											type="button"
											className="gallery-image-button"
											onClick={galleryClickHandler}
											aria-label="flower design">
											<img className="gallery-image gallery-image-1" src="/creative-coding-pages/share-card/images/sakura-flower.svg" />
										</button>
										<button
											type="button"
											className="gallery-image-button"
											onClick={galleryClickHandler}
											aria-label="sugar skull design">
											<img className="gallery-image gallery-image-2" src="/creative-coding-pages/share-card/images/sugar-skull.svg" />
										</button>
										<button
											type="button"
											className="gallery-image-button"
											onClick={galleryClickHandler}
											aria-label="flaming bunny design">
											<img className="gallery-image gallery-image-3" src="/creative-coding-pages/share-card/images/flaming-bunny.png" />
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="option-section sub-section-container art-manipulation-section">
							{/* Option Size */}
							<div className="sub-divider">
								<div className="option-sub-section option-size">
									<label className="option-label">Art size:</label>
									<div className="row">
										<button
											id="minus"
											className="option-button"
											onClick={sizeClickHandler}
											aria-label="decrease art size"
										>-</button>
										<button
											id="plus"
											className="option-button"
											onClick={sizeClickHandler}
											aria-label="increase art size"
										>+</button>
									</div>
								</div>
							</div>
							{/* Option Rotate */}
							<div className="sub-divider">
								<div className="option-sub-section option-rotate">
									<label className="option-label">Rotate Art:</label>
									<div className="row">
										<button
											id="rotate-left"
											className="option-button"
											onClick={rotateClickHandler}
											aria-label="rotate art left">
											<svg className="rotate-icon rotate-left-icon" viewBox="0 0 500 500">
												<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
											</svg>
										</button>
										<button
											id="rotate-right"
											className="option-button"
											onClick={rotateClickHandler}
											aria-label="rotate art right">
											<svg className="rotate-icon rotate-right-icon" viewBox="0 0 500 500">
												<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
											</svg>
										</button>
									</div>
								</div>
							</div>
							{/* Option Rounded Corners */}
							<div className="sub-divider">
								<div className="option-sub-section option-border-radius">
									<label className="option-label">Rounded Corners:</label>
									<div className="row">
										<button
											id="decrease"
											className="option-button"
											onClick={roundedCornersClickHandler}
											aria-label="decrease rounded corners"
										>-</button>
										<button
											id="increase"
											className="option-button"
											onClick={roundedCornersClickHandler}
											aria-label="increase rounded corners"
										>+</button>
									</div>
								</div>
							</div>
							{/* Option Delete */}
							<div className="sub-divider">
								<div className="option-sub-section option-delete">
									<label className="option-label">Delete:</label>
									<button
										id="delete"
										className="option-button"
										onClick={deleteClickHandler}
										aria-label="delete art">
										<svg className="delete-icon" viewBox="0 0 32 32">
											<path d="M25 4h-18c-1.657 0-3 1.343-3 3v1h24v-1c0-1.657-1.343-3-3-3zM19.76 2l0.441 3.156h-8.402l0.441-3.156h7.52zM20 0h-8c-0.825 0-1.593 0.668-1.708 1.486l-0.585 4.185c-0.114 0.817 0.467 1.486 1.292 1.486h10c0.825 0 1.407-0.668 1.292-1.486l-0.585-4.185c-0.114-0.817-0.883-1.486-1.708-1.486v0zM25.5 10h-19c-1.1 0-1.918 0.896-1.819 1.992l1.638 18.016c0.1 1.095 1.081 1.992 2.181 1.992h15c1.1 0 2.081-0.896 2.181-1.992l1.638-18.016c0.1-1.095-0.719-1.992-1.819-1.992zM12 28h-3l-1-14h4v14zM18 28h-4v-14h4v14zM23 28h-3v-14h4l-1 14z" fill="#000000"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>

						{/* Option Filters */}
						<div className="option-section option-filters">
							<label className="option-label">Filters:</label>
							<div className="option-filter-list">
								{filterButtons.map((filter, idx) =>
									<button
										key={idx}
										id={filter.value}
										className={`option-button-filter${filter.isActive ? ' active' : ''}`}
										value={filter.value}
										onClick={filterClickHandler}>
											{filter.name}
									</button>
								)}
							</div>
						</div>

						{/* Share Card Button */}
						<div className="option-section option-share">
							<button
								type="button"
								className="share-button"
								onClick={shareCardClickHandler}
							>Create Share Card
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
