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
							<input type="number" min="2" max="8" id="cols-input" name="cols-input" className="cols-input" value="4"></input>
						</div>
						<div className="row">
							<label htmlFor="custom-rows-num"># of rows:</label>
							<input type="number" min="2" max="8" id="rows-input" name="rows-input" className="rows-input" value="4"></input>
						</div>
						<div className="row">
							<input id="custom-image" type="file" name="custom-image" accept=".png, .jpg, .jpeg, .gif, .webp"/>
						</div>
					</div>
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
