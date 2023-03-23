import Head from 'next/head'
import Header from '../../components/Header'


export default function SlidePuzzle() {
	// Variables =================
	const solvedBoard = [
		'tile-1',
		'tile-2',
		'tile-3',
		'tile-4',
		'tile-5',
		'tile-6',
		'tile-7',
		'tile-8',
		'tile-9',
		'tile-10',
		'tile-11',
		'tile-12',
		'tile-13',
		'tile-14',
		'tile-15',
		'tile-blank'
	];

	// Tracking the board tiles in play
	let puzzleBoard = [...solvedBoard]; // will duplicate the original array


	// ============================
	// Setup Functions
	// ============================
	// returns: button elements to be displayed
	function displayTiles() {
		const tilePieces = puzzleBoard.map((tileName, idx) => {
			return (
				<button key={idx} className={`tile ${tileName}`} id={idx}></button>
			)
		});
		return tilePieces;
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Slide Puzzle</title>
				<meta name="description" content="Oxleberry Slide Puzzle - A customizable slide puzzle game. Slide the tiles to match the original image." />
			</Head>
			<main className="full-backboard slide-puzzle-page">
				<section className="intro">
					<Header headline="Slide Puzzle" alt={true}></Header>
					<p className="description">Slide the tiles to restore the original image. Customize the puzzle by updating the setting levels and uploading your own image!</p>
					<p className="description">This game has been adapted from The Coding Train - <a href="https://www.youtube.com/watch?v=uQZLzhrzEs4">Coding Challenge 165</a> tutorial video.</p>
				</section>
				<section className="slide-puzzle-container">
					<div className="reference-image"></div>
					<div className="puzzle-board">
						{displayTiles()}
					</div>
				</section>
			</main>
		</>
	);
}
