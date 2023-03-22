import Head from 'next/head'
import Header from '../../components/Header'


const SlidePuzzle = () => {
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
					<div className="puzzle-board"></div>
				</section>
			</main>
		</>
	);
}

export default SlidePuzzle;
