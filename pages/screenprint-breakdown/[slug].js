import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { useState, useRef } from 'react'


const data = [
	{
		color: "ub"
	},
	{
		color: "7532"
	},
	{
		color: "468"
	},
	{
		color: "174"
	},
	{
		color: "wht"
	}
]


export default function ScreenprintBreakdown() {
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


	// Event Handlers =================
	function inkBtnClickHandler(event) {
		console.log('click');
		console.log('event.target', event.target);
		// if ink button has already been pressed, do nothing
		if (event.target.classList.contains('is-pressed')) {
			return;
		}
		sepInkRefs.current.forEach(ink => {
			if (event.target.getAttribute('order') === ink.getAttribute('order')) {
				ink.classList.add('is-pressed');
			}
		});
		halftoneInkRefs.current.forEach(ink => {
			if (event.target.getAttribute('order') === ink.getAttribute('order')) {
				ink.classList.add('is-pressed');
			}
		});

		// set and track image
		const inkNum = event.target.getAttribute('order');
		sepTileRefs.current[printOrder].classList.add(`sep-image-${inkNum}`);
		sepTileRefs.current[printOrder].setAttribute('tile', `sep-image-${inkNum}`);
		halftoneTileRefs.current[printOrder].classList.add(`halftone-image-${inkNum}`);
		halftoneTileRefs.current[printOrder].setAttribute('tile', `halftone-image-${inkNum}`);
		sepTileRefs.current[printOrder].classList.add('slide-right');
		halftoneTileRefs.current[printOrder].classList.add('slide-right');

		// set print order
		const nextOrderNum = printOrder + 1;
		setPrintOrder(nextOrderNum);
	}

	function resetClickHandler() {
		console.log('reset');
		sepTileRefs.current.forEach(tile => {
			// slide left animation
			if (tile.classList.contains('slide-right')) {
				tile.classList.remove('slide-right');
				tile.classList.add('slide-left');
			}
			// delay clearing image to view slide left animation
			setTimeout(() => {
				if (tile.getAttribute('tile') != null) {
					const imageId = tile.getAttribute('tile');
					tile.classList.remove(imageId);
					tile.setAttribute('tile', null);
					tile.classList.remove('slide-left');
				}
			}, 1510);
		});
		halftoneTileRefs.current.forEach(tile => {
			// slide left animation
			if (tile.classList.contains('slide-right')) {
				tile.classList.remove('slide-right');
				tile.classList.add('slide-left');
			}
			// delay clearing image to view slide left animation
			setTimeout(() => {
				if (tile.getAttribute('tile') != null) {
					const imageId = tile.getAttribute('tile');
					tile.classList.remove(imageId);
					tile.setAttribute('tile', null);
					tile.classList.remove('slide-left');
				}
			}, 1510);
		});

		// clear out ink button status
		sepInkRefs.current.forEach(ink => {
			ink.classList.remove('is-pressed');
		});
		halftoneInkRefs.current.forEach(ink => {
			ink.classList.remove('is-pressed');
		});

		setPrintOrder(0);
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Screenprint</title>
				<meta name="description" content="Oxleberry Screenprint Breakdown - an interactive visual breakdown of a design by examining the color separation."/>
			</Head>
			<main className={`full-backboard screenprint-breakdown-page`}>
				<div className="screenprint-breakdown-container">
					<Header headline="Teotihuacán Screenprint Breakdown" alt={true}></Header>


					{/* Intro */}
					<section className="intro">
						<h2>Printed Tee</h2>
						<div className="outer-wrapper">
							<div className="inner-border">
								<div className="content-container row">
									<div className="text-block">
										<p>Design from the De Young Museum. <br />Color Separations by Oxleberry.</p>
									</div>
									<div className="image-block">
										<div className="intro-image"></div>
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
								{data.map((item, idx) =>
									<button key={`sep-ink-${idx}`} ref={addSepInkRefs} onClick={inkBtnClickHandler} className={`ink-label ink-${idx + 1}`} order={idx + 1}>{item.color}</button>
								)}
								<button onClick={resetClickHandler} className="reset-label">reset</button>
							</div>
							<div className="sep-block inner-border">
								<div className="content-container row">
									<div className="left-col">
										{/* Separation tiles */}
										{data.map((item, idx) =>
											<div key={`sep-tile-${idx}`} ref={addSepTileRefs} className={`tile`} tile={null}></div>
										)}
										<div className="tile sep-image-all"></div>
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
									{data.map((item, idx) =>
										<button key={`halftone-ink-${idx}`} ref={addHalftoneInkRefs} onClick={inkBtnClickHandler} className={`ink-label ink-${idx + 1}`} order={idx + 1}>{item.color}</button>
									)}
									<button onClick={resetClickHandler} className="reset-label">reset</button>
								</div>
								<div className="halftone-block row inner-border">
									<div className="left-col">
										{/* Halftone tiles */}
										{data.map((item, idx) =>
											<div key={`halftone-tile-${idx}`} ref={addHalftoneTileRefs} className={`tile`} tile={null}></div>
										)}
										<div className="tile halftone-image-all"></div>
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
								<span className="overview-label ink-label ink-all">all</span>
								<span className="overview-label ink-label ink-1">ub</span>
								<span className="overview-label ink-label ink-2">7532</span>
								<span className="overview-label ink-label ink-3">468</span>
								<span className="overview-label ink-label ink-4">174</span>
								<span className="overview-label ink-label ink-5">wht</span>
							</div>
							<div className="overview-block row inner-border">
								<div className="tile-container">
									<div className="tile sep-image-all"></div>
								</div>
								<div className="tile-container">
									<div className="tile sep-image-1"></div>
								</div>
								<div className="tile-container">
									<div className="tile sep-image-2"></div>
								</div>
								<div className="tile-container">
									<div className="tile sep-image-3"></div>
								</div>
								<div className="tile-container">
									<div className="tile sep-image-4"></div>
								</div>
								<div className="tile-container">
									<div className="tile sep-image-5"></div>
								</div>
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
