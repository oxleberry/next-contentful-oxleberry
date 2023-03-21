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
				<Header headline="Slide Puzzle" alt={true}></Header>
			</main>
		</>
	);
}

export default SlidePuzzle;
