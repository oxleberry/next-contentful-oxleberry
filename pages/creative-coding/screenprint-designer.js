import Head from 'next/head'
import Header from '../../components/Header'
import html2canvas from '../../js/lib/html2canvas'
import checkChromeBrowser from '../../js/utilities/checkChromeBrowser'
import { useEffect, useState, useRef } from 'react'
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


export default function ScreenprintDesigner({ screenprintDesignerItems }) {
	// Assets & CMS Content =================
	const garmentStylesItems = screenprintDesignerItems.filter((item) => item.fields.id === 'garmentStyles');
	const garmentStylesData = garmentStylesItems[0].fields.json.garmentStyles;
	const garmentStylesImages = garmentStylesItems[0].fields.images;
	const galleryImagesItems = screenprintDesignerItems.filter((item) => item.fields.id === 'galleryImagesScreenprintDesigner');
	const galleryImagesImages = galleryImagesItems[0].fields.images;
	const garmentColorsItems = screenprintDesignerItems.filter((item) => item.fields.id === 'garmentColors');
	const garmentColorsData = garmentColorsItems[0].fields.json.garmentColors;
	const currentGarmentColor = garmentColorsData.filter((item) => item.isActive === true);
	const currentGarmentStyle = garmentStylesData.filter((item) => item.isActive === true);
	const filtersItems = screenprintDesignerItems.filter((item) => item.fields.id === 'filters');
	const filtersData = filtersItems[0].fields.json.filters;

	// States =================
	const [garmentStyle, setGarmentStyle] = useState(currentGarmentStyle[0].value);
	const [garmentColor, setGarmentColor] = useState(currentGarmentColor[0].value);
	const [startCursorPos, setStartCursorPos] = useState({ x: null, y: null});
	const [curDragElem, setCurDragElem] = useState(null);
	const [designIdx, setDesignIdx] = useState(-1);
	const [designZIndex, setDesignZIndex] = useState(-1);
	const [filterButtons, setFilterButtons] = useState(filtersData);
	const [designs, setDesigns] = useState([]);
	const [isChromeBrowser, setIsChromeBrowser] = useState(false);
	/* =========================
		designs = [{
			id: number
			path: string
			posX: number
			posY: number
			width: number
			rotate: number
			filter: string
			grayscale: string // NOTE: grayscale does not work on Safari canvas
			borderRadius: number
			dragClass: string, ex: 'draggable', 'no-drag'
			zIndex: number
		}]
	========================= */

	// Variables =================
	const borderWidth = 8;
	let currentGarmentImage = garmentStylesImages.filter((item) => item.fields.title == garmentStyle);

	// Elements =================
	const shareFileRef = useRef(null);
	const dragContainerRef = useRef(null);
	let designRefs = useRef([null]);


	// Functions =================
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
					// cap the border radius to half the image width, , no need to increase further
					if (design.borderRadius > design.width / 2) {
						return design;
					} else {
						updateBorderRadius = design.borderRadius + increment;
						return { ...design, borderRadius: updateBorderRadius };
					}
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
					// posX: 95,
					// posY: 70,
					// width: 90,
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
		const designsByZindexOrder = designs.map((design) => {
			if (design.id == event.target.id) { // find unique item
				designFilter = design.filter;
				designGrayscale = design.grayscale;
				return { ...design, zIndex: nextZIndex }; // update current design
			} else {
				return { ...design, dragClass: 'no-drag' }; // update all other items
			}
		});
		// reorder by z-index, for drawing the correct order on to the canvas
		designsByZindexOrder.sort((a,b) => a.zIndex - b.zIndex);
		setDesigns(designsByZindexOrder);
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
	function createCanvas(width, height) {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext('2d');
		context.save(); // Save the current state
		context.fillStyle = garmentColor;
		context.fillRect(0, 0, width, height);
		context.restore(); // Restore to the state saved by the most recent call to save()
		// shareFileRef.current.prepend(canvas); // display canvas for testing
		return canvas;
	}

	function drawGarmentToCanvas(canvas, canvasHeight) {
		const tee = document.querySelector(".tee-image");
		const teeWidth = tee.getBoundingClientRect().width;
		const teeHeight = tee.getBoundingClientRect().height;
		const teeOffsetHeight = ((teeHeight - canvasHeight) / 2) * -1;
		const context = canvas.getContext('2d');
		context.drawImage(tee, 0, teeOffsetHeight, teeWidth, teeHeight);
	}

	function rotateDesign(context, design, imageWidth, imageHeight) {
		const centerX = (imageWidth / 2) + design.posX;
		const centerY = (imageHeight / 2) + design.posY;
		context.translate(centerX, centerY);
		context.rotate((design.rotate * Math.PI) / 180);
		context.translate(-centerX, -centerY);
	}

	function applyFilter(context, design) {
		// context.globalCompositeOperation = 'overlay'; // not an exact match
		// context.filter = "grayscale(1)"; // NOTE: does not work on Safari
		context.globalCompositeOperation = design.filter;
	}

	function drawRoundedCorners(context, design, imageWidth, imageHeight) {
		const left = design.posX;
		const top = design.posY;
		const width = imageWidth + left;
		const height = imageHeight + top;
		let cornerRadius = design.borderRadius;
		// cap the rounded corner to half the image width or height (whichever is smaller)
		if (cornerRadius > imageWidth / 2 || cornerRadius > imageHeight / 2) {
			let maxBorderRadius = Math.min(imageWidth / 2, imageHeight / 2);
			cornerRadius = maxBorderRadius;
		}
		context.beginPath();
		context.moveTo(cornerRadius, top);
		context.arcTo(width, top, width, height, cornerRadius);
		context.arcTo(width, height, left, height, cornerRadius);
		context.arcTo(left, height, left, top, cornerRadius);
		context.arcTo(left, top, width, top, cornerRadius);
		context.closePath();
		context.clip();
	}

	function drawDesignsToCanvas(canvas) {
		designRefs.current.map(((designElement, idx) => {
			const image = designElement.firstElementChild;
			const imageWidth = designElement.getBoundingClientRect().width;
			const imageHeight = designElement.getBoundingClientRect().height;
			const design = designs[idx];
			const context = canvas.getContext('2d');
			context.save();
			rotateDesign(context, design, imageWidth, imageHeight);
			applyFilter(context, design);
			drawRoundedCorners(context, design, imageWidth, imageHeight);
			context.drawImage(image, design.posX, design.posY, imageWidth, imageHeight);
			context.restore();
		}))
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
		// NOTE: html2canvas can't bring in filters, also has problem with SVGs
		// html2canvas(document.querySelector("#capture")).then(canvas => {
		// 	document.body.appendChild(canvas); // view test in browser
		// 	shareFile(canvas);
		// });
		const canvasWidth = 584;
		const canvasHeight = 682;
		const canvas = createCanvas(canvasWidth, canvasHeight);
		drawDesignsToCanvas(canvas);
		drawGarmentToCanvas(canvas, canvasHeight);
		shareFile(canvas);
	}


	// Initial Page Load =================
	useEffect(() => {
		const isChrome = checkChromeBrowser();
		setIsChromeBrowser(isChrome);
	}, []);


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
							id="capture"
							ref={dragContainerRef}
							onDragOver={event => dragOverHandler(event, false)}
							onDrop={event => dragDropHandler(event, false)}
							style={{background: garmentColor, borderWidth: `${borderWidth}px`}}
						>
							<h2 className="hidden">Design layout workspace</h2>
							<img className="tee-image" src={`https:${currentGarmentImage[0].fields.file.url}`} alt="screenprint designer workspace" crossOrigin='anonymous'/>
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
										crossOrigin='anonymous'
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
							{garmentStylesData.map((garment, idx) =>
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
							{garmentColorsData.map((color, idx) =>
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
									<label htmlFor="upload-image" className="option-label">Upload your image:</label>
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
										><span className="minus-icon">-</span></button>
										<button
											id="plus"
											className="option-button"
											onClick={sizeClickHandler}
											aria-label="increase art size"
										><span className="plus-icon">+</span></button>
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
										><span className="minus-icon">-</span></button>
										<button
											id="increase"
											className="option-button"
											onClick={roundedCornersClickHandler}
											aria-label="increase rounded corners"
										><span className="plus-icon">+</span></button>
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
						{/* Do not show on Chrome, share navigator is not supported */}
						{isChromeBrowser
						?
							""
						:
							<div className="option-section option-share">
								<button
									type="button"
									className="share-button"
									onClick={shareCardClickHandler}
								>Share Design
								</button>
							</div>
						}
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
