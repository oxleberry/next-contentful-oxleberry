import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { useState, useRef } from 'react'
import { createClient } from 'contentful'


const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

// Generates all the paths (ie):`/screenprint-breakdown/teotihuacan`
export async function getStaticPaths() {
	const res = await client.getEntries({
		content_type: 'screenprintBreakdown'
	});
	const paths = res.items.map(item => {
		return {
			params: { slug: item.fields.slug }
		}
	});
	return {
		paths: paths,
		fallback: false // if path does not exist will show 404 page
	};
}

// Grabs data for each page
export async function getStaticProps(context) {
	const res = await client.getEntries({
		content_type: 'screenprintBreakdown',
		'fields.slug': context.params.slug // Get data that matches this field (will output an array)
	});
	return {
		props: { screenprints: res.items[0] }
	};
}


export default function ScreenprintBreakdown({ screenprints }) {
	const {
		title,
		slug,
		introImage,
		introDescription,
		inkColors,
		sepImageAll,
		sepImageLayers,
		halftoneImageAll,
		halftoneImageLayers
	} = screenprints.fields;


	// States =================
	const [printOrder, setPrintOrder] = useState(0); // number

	// Elements =================
	const sepInkRefs = useRef([]);
	sepInkRefs.current = [];
	const halftoneInkRefs = useRef([]);
	halftoneInkRefs.current = [];
	const sepTileRefs = useRef([]);
	sepTileRefs.current = [];
	const halftoneTileRefs = useRef([]);
	halftoneTileRefs.current = [];

	// store Separation Ink Button elements
	function addSepInkRefs(sepInkRef) {
		if (sepInkRef && !sepInkRefs.current.includes(sepInkRef)) {
			sepInkRefs.current.push(sepInkRef);
		}
	}

	// store Halftone Ink Button elements
	function addHalftoneInkRefs(halftoneInkRef) {
		if (halftoneInkRef && !halftoneInkRefs.current.includes(halftoneInkRef)) {
			halftoneInkRefs.current.push(halftoneInkRef);
		}
	}

	// store Separation Tiles elements
	function addSepTileRefs(sepTileRef) {
		if (sepTileRef && !sepTileRefs.current.includes(sepTileRef)) {
			sepTileRefs.current.push(sepTileRef);
		}
	}

	// store Halftone Tiles elements
	function addHalftoneTileRefs(halftoneTileRef) {
		if (halftoneTileRef && !halftoneTileRefs.current.includes(halftoneTileRef)) {
			halftoneTileRefs.current.push(halftoneTileRef);
		}
	}


	// Helper Functions =================
	// animate active ink button
	function setInkBtn(inkButtons, event) {
		inkButtons.current.forEach(btn => {
			if (event.target.getAttribute('order') === btn.getAttribute('order')) {
				btn.classList.add('is-pressed');
			}
		});
	}

	// clear out ink button
	function clearInkBtn(inkButtons) {
		inkButtons.current.forEach(ink => {
			ink.classList.remove('is-pressed');
		});
	}

	// find image that corresponds to ink
	function setTileImage(tiles, num, imageLayers) {
		const layer = imageLayers.filter((item) => item.fields.title.includes(num));
		tiles.current[printOrder].setAttribute('style', `background-image: url(https:${layer[0].fields.file.url}`);
		tiles.current[printOrder].classList.add('slide-right');
	}

	// clear out tile image
	function clearImage(tiles) {
		tiles.current.forEach(tile => {
			// left slide animation
			if (tile.classList.contains('slide-right')) {
				tile.classList.remove('slide-right');
				tile.classList.add('slide-left');
			}
			// delay clearing image till after left slide animation
			setTimeout(() => {
				tile.removeAttribute('style');
				tile.classList.remove('slide-left');
			}, 1510);
		});
	}


	// Event Handlers =================
	function inkBtnClickHandler(event) {
		// if ink button has already been pressed, do nothing
		if (event.target.classList.contains('is-pressed')) {
			return;
		}
		const inkNum = event.target.getAttribute('order');
		setInkBtn(sepInkRefs, event);
		setInkBtn(halftoneInkRefs, event);
		setTileImage(sepTileRefs, inkNum, sepImageLayers);
		setTileImage(halftoneTileRefs, inkNum, halftoneImageLayers);
		const nextOrderNum = printOrder + 1;
		setPrintOrder(nextOrderNum);
	}

	function resetClickHandler() {
		clearImage(sepTileRefs);
		clearImage(halftoneTileRefs);
		clearInkBtn(sepInkRefs);
		clearInkBtn(halftoneInkRefs);
		setPrintOrder(0);
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Screenprint</title>
				<meta name="description" content="Oxleberry Screenprint Breakdown - an interactive visual breakdown of a design by examining the color separation."/>
			</Head>
			<main className={`full-backboard screenprint-breakdown-page ${slug}`}>
				<div className="screenprint-breakdown-container">
				<Header headline={`${title} - Screenprint Breakdown`} alt={true}></Header>

					{/* Intro */}
					<section className="intro">
						<h2>Printed Tee</h2>
						<div className="outer-wrapper">
							<div className="inner-border">
								<div className="content-container row">
									<div className="text-block">
										<p dangerouslySetInnerHTML={{__html: introDescription}} />
									</div>
									<div className="image-block">
										<div className="intro-image" style={{backgroundImage: `url(https:${introImage.fields.file.url})`}}></div>
									</div>
								</div>
							</div>
						</div>
					</section>


					{/* Color Separations */}
					<section className="color-separation">
						<h2>Color Separation</h2>
						<p className="instructions">Color Separation is the process of breaking down a design into 12 or less colors to be used for the screen printing. Below is an interactive visual breakdown of a color separated design. <br /><br /><strong>Click</strong> the ink colors button below. The order in which you press down the buttons will represent the order in which the colors are printed in. Experiment with the print order!</p>
						<div className="outer-wrapper">
							<div className="ink-block row">
								{/* Ink buttons */}
								{inkColors.map((color, idx) =>
									<button key={`sep-ink-${idx}`} ref={addSepInkRefs} onClick={inkBtnClickHandler} className={`ink-label ink-${idx + 1}`} order={idx + 1}>{color}</button>
								)}
								<button onClick={resetClickHandler} className="reset-label">reset</button>
							</div>
							<div className="sep-block inner-border">
								<div className="content-container row">
									<div className="left-col">
										{/* Separation tiles */}
										{sepImageLayers.map((layer, idx) =>
											<div key={`sep-tile-${idx}`} ref={addSepTileRefs} className={`tile`}></div>
										)}
										<div className="tile sep-image-all" style={{backgroundImage: `url(https:${sepImageAll.fields.file.url})`}}></div>
									</div>
									<div className="right-col">
										<div className="tile"></div>
									</div>
								</div>
							</div>
						</div>
					</section>


					{/* Halftone Closeup */}
					<section className="halftone-closeup">
						<h2>Halftone Closeup</h2>
							<div className="outer-wrapper">
								<div className="ink-block row">
									{/* Ink buttons */}
									{inkColors.map((color, idx) =>
										<button key={`sep-ink-${idx}`} ref={addHalftoneInkRefs} onClick={inkBtnClickHandler} className={`ink-label ink-${idx + 1}`} order={idx + 1}>{color}</button>
									)}
									<button onClick={resetClickHandler} className="reset-label">reset</button>
								</div>
								<div className="halftone-block row inner-border">
									<div className="left-col">
										{/* Halftone tiles */}
										{halftoneImageLayers.map((item, idx) =>
											<div key={`halftone-tile-${idx}`} ref={addHalftoneTileRefs} className={`tile`}></div>
										)}
										<div className="tile halftone-image-all" style={{backgroundImage: `url(https:${halftoneImageAll.fields.file.url})`}}></div>
									</div>
									<div className="right-col">
										<div className="tile"></div>
									</div>
								</div>
							</div>
					</section>


					{/* Overview */}
					<section className="overview">
						<h2>Overview</h2>
						<div className="outer-wrapper">
							<div className="ink-block row">
								<span className="overview-label ink-label ink-all"> all </span>
								{/* Ink labels */}
								{inkColors.map((color, idx) =>
									<span key={`overview-label-${idx}`} className={`overview-label ink-label ink-${idx + 1}`}>{color}</span>
								)}
							</div>
							<div className="overview-block row inner-border">
								<div className="tile-container">
									<div className="tile" style={{backgroundImage: `url(https:${sepImageAll.fields.file.url})`}}></div>
								</div>
								{/* Overview tiles */}
								{sepImageLayers.map((layer, idx) =>
									<div key={`overview-tile-${idx}`} className="tile-container">
										<div className="tile" style={{backgroundImage: `url(https:${layer.fields.file.url})`}}></div>
									</div>
								)}
							</div>
						</div>
					</section>


					{/* Nav to other design links */}
					<nav className="more-designs-nav">
						<ul>
							<li className="label">SEE MORE DESIGNS:</li>
							<li><Link href="/screenprint-breakdown/hrb/"><a>Hrb</a></Link></li>
							<li className="deactive">Teo</li>
							<li><Link href="/screenprint-breakdown/gor/"><a>Gor</a></Link></li>
							<li><Link href="/screenprint-breakdown/kis/"><a>Kis</a></Link></li>
						</ul>
					</nav>


				</div>
			</main>
		</>
	);
}
