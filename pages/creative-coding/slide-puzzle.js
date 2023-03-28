import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'


export default function SlidePuzzle() {
	// Variables =================
	const blankTile = 'tile-blank';

	// States =================
	const [solvedBoard, setSolvedBoard] = useState([]); // array of object tiles in solved board order
	const [puzzleBoard, setPuzzleBoard] = useState([]); // array of object tiles for tracking the position of the tiles on the board
	const [colsCount, setColsCount] = useState(4);
	const [rowsCount, setRowsCount] = useState(4);


	// ============================
	// Setup Functions
	// ============================
	// Setup tiles based on amount of cols & rows
	function updatePuzzleBoard() {
		const tileNames = createEmptyTiles();
		const tiles = createTilesData(tileNames);
		setSolvedBoard(tiles);
		setPuzzleBoard(tiles);
	}

	// Create tiles to fill the board
	// returns: array of tile names
	function createEmptyTiles() {
		let newTileNames = [];
		const totalNumTiles = colsCount * rowsCount;
		for (let i = 1; i < totalNumTiles; i++) {
			newTileNames.push(`tile-${i}`);
		}
		// create a blank tile
		newTileNames.push(blankTile);
		return newTileNames;
	}

	// Create tiles with styles data based on puzzle settings
	// parameters: tileNames = array of strings
	// returns: array of tile objects
	function createTilesData(tileNames) {
		const tiles = tileNames.map((tile, idx) => {
			const colSize = colsCount * 100;
			const rowSize = rowsCount * 100;
			const colStep = 100 / (colsCount - 1);
			const rowStep = 100 / (rowsCount - 1);
			const horizPos = colStep * (idx % colsCount);
			const vertPos = rowStep * (Math.floor(idx / colsCount));
			return (
				{
					key: {idx},
					name: tile,
					width: `calc(400px / ${colsCount})`,
					height: `calc(400px / ${rowsCount})`,
					backgroundSize: `${colSize}% ${rowSize}%`,
					backgroundPosition: `${horizPos}% ${vertPos}%`
				}
			)
		});
		return tiles;
	}

	// returns: button elements to be displayed
	function displayTiles() {
		const tiles = puzzleBoard.map((tile, idx) => {
			return (
				<button key={idx} className={`tile ${tile.name}`} id={idx}
					style={{
						width: tile.width,
						height: tile.height,
						backgroundSize: tile.backgroundSize,
						backgroundPosition: tile.backgroundPosition
					}}>
				</button>
			)
		});
		return tiles;
	}


	// =================================
	// Custom Settings Event Listeners
	// =================================
	function colHandler(event) {
		setColsCount(event.target.value);
	}

	function rowHandler(event) {
		setRowsCount(event.target.value);
	}


	// ============================
	// Event Listeners
	// ============================
	// Custom settings updates
	useEffect(() => {
		updatePuzzleBoard();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colsCount, rowsCount]);


	return (
		<>
			<Head>
				<title>Oxleberry | Slide Puzzle</title>
				<meta name="description" content="Oxleberry Slide Puzzle - A customizable slide puzzle game. Slide the tiles to match the original image." />
			</Head>
			<main className="full-backboard slide-puzzle-page">
				<section className="intro">
					<div className="text-block">
						<Header headline="Slide Puzzle" alt={true}></Header>
						<p className="description">Slide the tiles to restore the original image. Customize the puzzle by updating the setting levels and uploading your own image!</p>
						<p className="description">This game has been adapted from The Coding Train - <a href="https://www.youtube.com/watch?v=uQZLzhrzEs4">Coding Challenge 165</a> tutorial video.</p>
					</div>
					<div className="puzzle-settings">
						<div className="row">
							<label htmlFor="shuffle-level">Shuffle difficulty:&nbsp;</label>
							<input type="range" id="shuffle-level" name="shuffle-level" className="shuffle-level" min="10" max="500" value="10"></input>
						</div>
						<div className="row">
							<label htmlFor="cols-input">Columns:&nbsp;&nbsp;</label>
							<input onChange={colHandler} type="number" min="2" max="8" id="cols-input" name="cols-input" className="cols-input" value={colsCount}></input>
						</div>
						<div className="row">
							<label htmlFor="rows-input">Rows:&nbsp;&nbsp;</label>
							<input onChange={rowHandler} type="number" min="2" max="8" id="rows-input" name="rows-input" className="rows-input" value={rowsCount}></input>
						</div>
						<div className="row">
							<input id="custom-image" type="file" name="custom-image" accept=".png, .jpg, .jpeg, .gif, .webp"/>
						</div>
					</div>
				</section>

				<section className="slide-puzzle-container">
					<div className="reference-image"></div>
					<div className="puzzle-board" style={{gridTemplateColumns: `repeat(${colsCount}, 1fr)`}}>
						{displayTiles()}
					</div>
				</section>
			</main>
		</>
	);
}
