import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'


// Variables =================
const numUniqCards = 14;
const pairsInPlay = 6;
let uniqueCards = []; // once created, original list is not to be mutated

// Helper Functions =================
// create original array of possible cards
function createUniqCards() {
	for (var i = 1; i <= numUniqCards; i++) {
		uniqueCards.push("card-" + [i]);
	}
};
createUniqCards();


export default function MemoryGame() {

	function displayGameCards() {
		const cards = uniqueCards.map((card, idx) => {
			return (
				<div className={`card-container flip`} key={idx}>
					<div className="back card"></div>
					<div className={`front card ${card}`}></div>
				</div>
			)
		})
		return cards;
	}

	return (
		<>
			<Head>
				<title>Oxleberry | Memory Game</title>
				<meta name="description" content="Oxleberry Memory Game - art courtesy of Sumofish."/>
			</Head>
			<main className="full-backboard sumofish-memory-game-page">
				<Header headline="Sumofish Memory Game" alt={true} ></Header>
				<p className="description">Find the matching pairs and uncover all the tiles! <br />
					<Link href="https://www.sumofish.net/"><a target="_blank">Art courtesy of <strong>SUMOFISH<sup>&reg;</sup></strong></a></Link>
				</p>
				<section className="game-container">
					<div className="game-board">
						{displayGameCards()}
					</div>
					<button className="btn-reset">RESET</button>
				</section>
			</main>
		</>
	)
}