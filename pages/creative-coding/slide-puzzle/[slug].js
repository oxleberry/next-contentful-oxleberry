/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Script from 'next/script' // for adding JS library
import Link from 'next/link'
import { useRouter } from 'next/router';
import Header from '../../../components/Header'
import { useEffect, useState, useRef } from 'react'
import { createClient } from 'contentful'


// get CMS content =================
const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

// Generates all the paths
export async function getStaticPaths() {
	const res = await client.getEntries({
		content_type: 'slidePuzzle'
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
		content_type: 'slidePuzzle',
		'fields.slug': context.params.slug // Get data that matches this field (will output an array)
	});
	return {
		props: { slidePuzzle: res.items[0] }
	};
}


export default function SlidePuzzle({ slidePuzzle }) {
	// Variables =================
	const { image, variantPuzzleUrl, imgWidth, imgHeight } = slidePuzzle.fields;  // data from CMS
	const blankTile = 'tile-blank';
	const router = useRouter();

	// Elements =================
	const puzzleImageRef = useRef(null);
	const puzzleBgColorLoaded = '#0a0a0a';

	// States =================
	const [solvedBoard, setSolvedBoard] = useState([]); // array of object tiles in solved board order
	const [puzzleBoard, setPuzzleBoard] = useState([]); // array of object tiles for tracking the position of the tiles on the board
	const [shuffleLevel, setShuffleLevel] = useState(50); // set at easiest level (number of shuffles)
	const [colsInput, setColsInput] = useState(4);
	const [colsCount, setColsCount] = useState(4);
	const [displayCols, setdisplayCols] = useState(4); // used to avoid double updates from 'colsCount' in gridTemplateColumns
	const [rowsInput, setRowsInput] = useState(4);
	const [rowsCount, setRowsCount] = useState(4);
	const [puzzleImage, setPuzzleImage] = useState(getImage());
	const [puzzleWidth, setPuzzleWidth] = useState(getPuzzleWidth());
	const [puzzleHeight, setPuzzleHeight] = useState(getPuzzleHeight());
	const [puzzleBgColor, setPuzzleBgColor] = useState('transparent');
	const [pageHasChanged, setPageHasChanged] = useState(false);


	// ============================
	// Setup Functions
	// ============================
	// Grab data from CMS
	function getImage() { return image.fields.file.url };
	function getPuzzleWidth() { return imgWidth };
	function getPuzzleHeight() { return imgHeight };


	// Setup tiles based on amount of cols & rows
	function updatePuzzleBoard() {
		const tileNames = createEmptyTiles();
		const tiles = createTilesData(tileNames);
		setSolvedBoard(tiles);
		const shuffledTiles = shuffleTiles(tiles, shuffleLevel);
		setPuzzleBoard(shuffledTiles);
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
			if (tile.name === 'tile-blank') {
				return (
					<button key={idx} className={`tile ${tile.name}`} id={idx} name={tile.name} tabIndex="-1"></button>
				)
			} else {
				return (
					<button key={idx} className={`tile ${tile.name}`} id={idx} name={tile.name} tabIndex="-1"
						onClick={tileClickHandler}
						style={{
							backgroundSize: tile.backgroundSize,
							backgroundPosition: tile.backgroundPosition,
							backgroundImage: `url(${puzzleImage})`
						}}>
					</button>
				)
			}
		});
		return tiles;
	}

	function setPuzzleContainerSize() {
		let updatePuzzleWidth;
		let updatePuzzleHeight;
		const border = 20;
		// if coming from slide-puzzle variant page, then needs to reset width and height
		if (pageHasChanged) {
			updatePuzzleWidth = getPuzzleWidth();
			updatePuzzleHeight = getPuzzleHeight();
			setPageHasChanged(false);
		} else {
			updatePuzzleWidth = puzzleImageRef.current.offsetWidth;
			updatePuzzleHeight = puzzleImageRef.current.offsetHeight;
		}
		// if image hasn't loaded yet, initial page load
		if (updatePuzzleWidth === 0) {
			return;
		}
		updatePuzzleWidth += border;
		updatePuzzleHeight += border;
		setPuzzleWidth(updatePuzzleWidth);
		setPuzzleHeight(updatePuzzleHeight);
	}


	// ============================
	// Shuffle Functions
	// ============================
	// parameters: board = array of tile objects, numOfTimes = number
	// returns: array of tile objects
	function shuffleTiles(board, numOfTimes) {
		let updateBoard = board;
		for (let i = 0; i < numOfTimes; i++) {
			updateBoard = randomMove(updateBoard);
		}
		// if random generator creates a solved puzzleboard, then manually swap last two tiles
		if (puzzleBoard.length > 0) {
			const isMatch = compareArrays(board, updateBoard);
			if (isMatch) {
				const lastTile = board.length - 1;
				const secondLastTile = board.length - 2;
				updateBoard = swap(board, lastTile, secondLastTile, false);
			}
		}
		return updateBoard;
	}

	// parameters: range = number (top range for random generator)
	// returns: number (randomly generated number)
	function randomGenerator(range) {
		const randomNum = Math.floor(Math.random() * range);
		return randomNum;
	};

	// Converts (tile row & col position) to (board index)
	// parameters: number, number, number (tile row position, number of columns, tile col position)
	// returns: number (index in board array)
	function findTileIdx(tileRowPos, cols, tileColPos) {
		return (tileRowPos * cols) + tileColPos;
	}

	// Randomly swap tiles based on blank tile's position, used for shuffling board
	// parameters: tempBoard = array of tile objects
	function randomMove(tempBoard) {
		const blankIdx = findBlankTile(tempBoard);
		const blankPos = findTilePosition(blankIdx);
		const blankRowPos = blankPos.row;
		const blankColPos = blankPos.col;
		const lastRow = rowsCount - 1;
		const lastCol = colsCount - 1;
		let tileRowPos = blankRowPos; // defaults to blank tile
		let tileColPos = blankColPos; // defaults to blank tile
		const randomizer = Math.floor(randomGenerator(10));
		// randomly move horizontally
		if (randomizer % 2 === 0) {
			tileRowPos = pickRandomTile(randomizer, blankRowPos, lastRow);
		// randomly move vertically
		} else {
			tileColPos = pickRandomTile(randomizer, blankColPos, lastCol);
		}
		const randomTileIdx = findTileIdx(tileRowPos, colsCount, tileColPos);
		let updateBoard = swap(tempBoard, blankIdx, randomTileIdx, false);
		return updateBoard;
	}

	// Randomly chooses adjacent tile for swapping, used for shuffling board
	// parameters: number, number, number (random number, tile (row/col) position, last row/col) position)
	// returns: number (next tile position to swap tile with)
	function pickRandomTile(randomVal, blankPos, lastEdgePos) {
		let tilePos;
		// if at ending edge, move up or left
		if (blankPos === lastEdgePos) {
			tilePos = blankPos - 1;
			// if at beginning edge, move down or right
		} else if (blankPos === 0) {
			tilePos = blankPos + 1;
		// inner pieces, move randomly
		} else {
			if (randomVal <= 4) {
				tilePos = blankPos + 1;
			} else {
				tilePos = blankPos - 1;
			}
		}
		return tilePos;
	}


	// =================================
	// Custom Settings Event Listeners
	// =================================
	function shuffleHandler(event) {
		let shuffledTiles;
		const newBoard = [...solvedBoard];
		const buttonId = event.target.id;
		let updateShuffleLevel = shuffleLevel;
		// update difficulty level from custom settings
		if (buttonId === 'shuffle-level') {
			const updateShuffleLevel = event.target.value;
			setShuffleLevel(updateShuffleLevel);
		}
		shuffledTiles = shuffleTiles(newBoard, updateShuffleLevel);
		setPuzzleBoard(shuffledTiles);
	}

	function colRowHandler(event) {
		let value = event.target.value;
		let name = event.target.name;
		if (value === '') {
			if (name === 'cols-input') {
				setColsInput(value);
			} else if (name === 'rows-input') {
				setRowsInput(value);
			}
		} else if (value < 2 || value > 8) {
			// skip if outside the min & mix limit
			return;
		}
		else {
			// updates valid input
			value = +value; // + converts a string to a number
			if (name === 'cols-input') {
				setColsInput(value);
				setColsCount(value);
			} else if (name === 'rows-input') {
				setRowsInput(value);
				setRowsCount(value);
			}
		}
	}


	// Custom image uploads
	function imageHandler(event) {
		let imageFile;
		let reader;
		let newImage;
		imageFile = event.target.files[0];
		if(!imageFile.type.match('image.*')) {
			alert("This file is not a unsupported image file");
			return;
		}
		reader = new FileReader();
		reader.addEventListener('load', (function() {
			return function(event) {
				newImage = event.target.result;
				setPuzzleImage(newImage);
				updatePuzzleBoard();
			};
		})(imageFile), false);
		reader.readAsDataURL(imageFile);
	}


	// =================================================
	// Game Play Functions & Tile Click Event Listener
	// =================================================
	function tileClickHandler(event) {
		const tileId = event.currentTarget.id;
		move(tileId);
	}

	// parameters: board = array of tile objects
	// returns: number (index number of 'tile-blank' array)
	function findBlankTile(board) {
		const blankTileIdx = board.findIndex(tile => tile.name === blankTile);
		return blankTileIdx;
	}

	// Converts (board tracking index) to (tile row & col position)
	// parameters: number (tile id)
	// returns: object (tilePosition.row, tilePosition.col)
	function findTilePosition(id) {
		const tileRowPosition = Math.floor(id / colsCount);
		const tileColPosition = id % colsCount;
		return {
			row: tileRowPosition,
			col: tileColPosition
		};
	}

	// Swap two elements in an array
	// parameters: board: array of tile objects,
	// 						 idx1: number,
	// 						 idx2: number,
	//						 isPublic: boolean
	// returns: updated array of tile objects
	function swap(board, idx1, idx2, isPublic) {
		const updateBoard = [...board];
		const temp = updateBoard[idx1];
		updateBoard[idx1] = updateBoard[idx2];
		updateBoard[idx2] = temp;
		if (isPublic) {
			setPuzzleBoard(updateBoard);
		}
		return updateBoard;
	}

	// Move selected tile with blank tile if move is valid
	function move(tileId) {
		const blankIdx = findBlankTile(puzzleBoard);
		const isNeighbor = checkNeighbor(tileId, blankIdx);
		if (isNeighbor) {
			swap(puzzleBoard, tileId, blankIdx, true);
		}
	}

	// Check if it is a valid piece to move
	// parameters: tileId = number, blankIdx = number
	// returns: boolean
	function checkNeighbor(tileId, blankIdx) {
		// (for keyboard presses) checks if neightbor is outside of the board
		if (tileId < 0 || tileId > puzzleBoard.length - 1) {
			return false;
		}
		const tilePos = findTilePosition(tileId);
		const tileRowPos = tilePos.row;
		const tileColPos = tilePos.col;
		const blankPos = findTilePosition(blankIdx);
		const blankRowPos = blankPos.row;
		const blankColPos = blankPos.col;
		// checks if selected tile is not the same row or column as blank tile
		if (tileRowPos !== blankRowPos && tileColPos!== blankColPos) {
			return false;
		}
		// checks if selected tile is in a 1 row/col away (in either direction) from blank tile
		if (Math.abs(tileRowPos - blankRowPos) == 1 || Math.abs(tileColPos - blankColPos) == 1) {
			return true;
		}
		// skips if it's the same spot
		return false;
	};


	// ============================
	// Win Functions
	// ============================
	// Check if two arrays match
	// parameters: arr1 = array of objects, arr2 = array of objects
	// returns: boolean
	function compareArrays(arr1, arr2) {
		return arr1.every((element, idx) => element === arr2[idx]);
	}

	// Display confetti from JS Confetti library: https://github.com/loonywizard/js-confetti
	function displayWin() {
		const jsConfetti = new JSConfetti();
		jsConfetti.addConfetti({
			confettiColors: [
				'#f94144', '#f3722c', '#ffbe0b', '#8ac926', '#027bce', '#662e9b', '#f26ca7'
			],
			confettiRadius: 4.5,
			confettiNumber: 800,
		});
	};

	function checkSolved() {
		if (puzzleBoard.length > 0) {
			const isMatch = compareArrays(solvedBoard, puzzleBoard);
			if (isMatch) {
				displayWin();
			}
		}
	};


	// ============================
	// Key Press Event Listeners
	// ============================
	function keyPressHander(event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		const blankIdx = findBlankTile(puzzleBoard);
		let nextTileIdx;
		if (event.key === 's' || event.key === 'k') {
			nextTileIdx = blankIdx - colsCount;
		} else if (event.key === 'w' || event.key === 'i') {
			nextTileIdx = blankIdx + colsCount;
		} else if (event.key === 'd' || event.key === 'l') {
			nextTileIdx = blankIdx - 1;
		} else if (event.key === 'a' || event.key === 'j') {
			nextTileIdx = blankIdx + 1;
		}
		move(nextTileIdx);
	};


	// ======================================
	// Slide Puzzle Variant Page Route Handlers
	// ======================================
	// Update image after route has change
	// Any image update will trigger setPuzzleContainerSize to be updated
	function routeChangeHandler() {
		const updateImage = getImage();
		setPuzzleImage(updateImage);
		updatePuzzleBoard();
	}

	// Track if link within slide-puzzle sub-page has been clicked
	function pageClickHandler() {
		setPageHasChanged(true);
	}


	// ============================
	// Event Listeners
	// ============================
	// Initial page load
	useEffect(() => {
		// add puzzle background after image has been loaded
		setPuzzleBgColor(puzzleBgColorLoaded);
	}, []);

	// Custom settings updates
	useEffect(() => {
		updatePuzzleBoard();
		setdisplayCols(colsCount);
	}, [colsCount]);
	useEffect(() => updatePuzzleBoard(), [rowsCount]);
	useEffect(() => setPuzzleContainerSize(), [puzzleImage]);

	// Check if game is solved
	useEffect(() => checkSolved(), [puzzleBoard]);

	// Window event listeners
	useEffect(() => {
		window.addEventListener('resize', setPuzzleContainerSize);
		// clean up function, remove event listener
		return () => {
			window.removeEventListener('resize', setPuzzleContainerSize);
		}
	}, []);

	// Keyboard event listeners
	useEffect(() => {
		window.addEventListener('keydown', keyPressHander);
		// clean up function, remove event listener
		return () => {
			window.removeEventListener('keydown', keyPressHander);
		}
	}, [keyPressHander, colsCount]);

	// Resetting state after navigation within same parent route
	// https://nextjs.org/docs/pages/api-reference/functions/use-router#resetting-state-after-navigation
	useEffect(() => {
		router.events.on('routeChangeComplete', routeChangeHandler)
		return () => {
			router.events.off('routeChangeComplete', routeChangeHandler)
		};
	}, [router.query.slug]);


	return (
		<>
			<Head>
				<title>Oxleberry | Slide Puzzle</title>
				<meta name="description" content="Oxleberry Slide Puzzle - A customizable slide puzzle game. Slide the tiles to match the original image." />
			</Head>
			<Script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js" />
			<main className="full-backboard slide-puzzle-page">
				<section className="intro">
					<div className="text-block">
						<Header headline="Slide Puzzle" alt={true}></Header>
						<p className="description">Slide the tiles to restore the original image. Customize the puzzle by updating the setting levels and uploading your own image!</p>
						<p className="description">This game has been adapted from The Coding Train - <a href="https://www.youtube.com/watch?v=uQZLzhrzEs4">Coding Challenge 165</a> tutorial video.</p>
					</div>

					<div className="puzzle-settings">
						<p className="label">
							<span>&#9734;  </span>Customize Puzzle
							<span>  <Link href={variantPuzzleUrl}><a onClick={pageClickHandler} className="link-hidden">&#9734;</a></Link></span>
						</p>
						<hr />
						<div className="row">
							<label htmlFor="cols-input">Columns:&nbsp;&nbsp;</label>
							<input onChange={colRowHandler} type="number" min="2" max="8" id="cols-input" name="cols-input" className="cols-input" value={colsInput}></input>
							<small className="info">&nbsp;&nbsp;(2-8)</small>
						</div>
						<div className="row">
							<label htmlFor="rows-input">Rows:&nbsp;&nbsp;</label>
							<input onChange={colRowHandler} type="number" min="2" max="8" id="rows-input" name="rows-input" className="rows-input" value={rowsInput}></input>
							<small className="info">&nbsp;&nbsp;(2-8)</small>
						</div>
						<div className="row">
							<label htmlFor="shuffle-level">Shuffle Difficulty:&nbsp;</label>
							<input onChange={shuffleHandler} type="range" min="10" max="500" id="shuffle-level" name="shuffle-level" className="shuffle-level" value={shuffleLevel}></input>
						</div>
						<hr />
						<div className="row custom-image-label">
							<label htmlFor="custom-image">Upload Image:</label>
						</div>
						<div className="row">
							<input id="custom-image" onChange={imageHandler} type="file" name="custom-image" accept=".png, .jpg, .jpeg, .gif, .webp"/>
						</div>
						<hr className="mobile-view" />
						<div className="row mobile-view">
							<button onClick={shuffleHandler} id="reshuffle-mobile" className="reshuffle">reshuffle</button>
						</div>
					</div>

					<div className="keyboard-guide">
						<p className="label">Keyboard&nbsp;Keys:</p>
						<div className="row">
							<span className="arrow">&#8679;</span>
						</div>
						<div className="row">
							<button tabIndex="-1">I</button>
						</div>
						<div className="row">
							<span className="arrow">&#8678;&nbsp;</span>
							<button tabIndex="-1">J</button>
							<button tabIndex="-1">K</button>
							<button tabIndex="-1">L</button>
							<span className="arrow">&nbsp;&#8680;</span>
						</div>
						<div className="row">
							<span className="arrow">&#8681;</span>
						</div>
						<hr />
						<div className="row">
							<button onClick={shuffleHandler} id="reshuffle" className="reshuffle">reshuffle</button>
						</div>
					</div>
				</section>

				<section className="slide-puzzle-container">
					<div className="reference-image">
						<picture>
							<source srcSet={puzzleImage} />
							<img ref={puzzleImageRef} src={puzzleImage} alt="puzzle art" />
						</picture>
					</div>

					<div className="puzzle-board"
						style={{
							gridTemplateColumns: `repeat(${displayCols}, 1fr)`,
							maxWidth: `100%`,
							width: `${puzzleWidth}px`,
							height: `${puzzleHeight}px`,
							background: puzzleBgColor,
							border: `10px solid ${puzzleBgColor}`
						}}>
						{displayTiles()}
					</div>
				</section>
			</main>
		</>
	);
}
