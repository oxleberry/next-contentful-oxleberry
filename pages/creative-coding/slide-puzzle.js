import Head from 'next/head'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'


export default function SlidePuzzle() {
	// Variables =================
	const blankTile = 'tile-blank';
	const easyShuffle = 10;
	const hardShuffle = 500;

	// Elements =================
	const puzzleImageRef = useRef(null);

	// States =================
	const [solvedBoard, setSolvedBoard] = useState([]); // array of object tiles in solved board order
	const [puzzleBoard, setPuzzleBoard] = useState([]); // array of object tiles for tracking the position of the tiles on the board
	const [colsCount, setColsCount] = useState(4);
	const [rowsCount, setRowsCount] = useState(4);
	const [puzzleImage, setPuzzleImage] = useState("/slide-puzzle/narwhal-static.jpg");
	const [puzzleWidth, setPuzzleWidth] = useState(426);


	// ============================
	// Setup Functions
	// ============================
	// Setup tiles based on amount of cols & rows
	function updatePuzzleBoard() {
		const tileNames = createEmptyTiles();
		const tiles = createTilesData(tileNames);
		setSolvedBoard(tiles);
		const shuffledTiles = shuffleTiles(tiles, easyShuffle);
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
					<button key={idx} className={`tile ${tile.name}`} id={idx} name={tile.name}></button>
				)
			} else {
				return (
					<button key={idx} className={`tile ${tile.name}`} id={idx} name={tile.name}
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
		const imageWidth = puzzleImageRef.current.offsetWidth;
		const border = 20;
		const puzzleWidth = imageWidth + border;
		setPuzzleWidth(puzzleWidth);
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
	function colHandler(event) {
		setColsCount(event.target.value);
	}

	function rowHandler(event) {
		setRowsCount(event.target.value);
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
	// Key Press Event Listeners
	// ============================
	// eslint-disable-next-line react-hooks/exhaustive-deps
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


	// ============================
	// Event Listeners
	// ============================
	// Initial page load
	useEffect(() => {
		setPuzzleContainerSize();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Custom settings updates
	useEffect(() => {
		updatePuzzleBoard();
		setPuzzleContainerSize();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [colsCount, rowsCount, puzzleImage]);

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
	}, [keyPressHander]);


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
							<input id="custom-image" onChange={imageHandler} type="file" name="custom-image" accept=".png, .jpg, .jpeg, .gif, .webp"/>
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
							gridTemplateColumns: `repeat(${colsCount}, 1fr)`,
							width: `${puzzleWidth}px`
						}}>
						{displayTiles()}
					</div>
				</section>
			</main>
		</>
	);
}
