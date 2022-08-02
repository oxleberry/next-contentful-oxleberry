import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { useEffect, useState } from 'react'


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

function randomNumGenerator(maxNum) {
	return Math.floor(Math.random() * maxNum);
};

// create pairs of cards used in gameplay deck
// retuns an array of strings
// ex: ['card-1', 'card-1', 'card-5','card-5', ...]
const createCardsInPlayDeck = () => {
	let cards = [];
	let tempDupCards = [...uniqueCards]; // will duplicate the original array
	for (let i = 0; i < pairsInPlay; i++) {
		const randomIdx = randomNumGenerator(tempDupCards.length);
		const singleCard = tempDupCards.splice(randomIdx, 1);  // removes the random element from the tempDupCards
		const singleCardValue = singleCard[0];
		cards.push(singleCardValue);
		cards.push(singleCardValue);
	};
	return cards;
}


export default function MemoryGame() {
	// States =================
	const [shuffledDeck, setShuffledDeck] = useState([]); // array of strings

	// Helper Functions =================
	// generates randsomly shuffled cards from createCardsInPlayDeck
	function shuffleDeck() {
		let tempDeck = [];
		const cardDeck = createCardsInPlayDeck();
		for (var i = 0; i < (pairsInPlay * 2); i++) {
			const randomIdx = randomNumGenerator(cardDeck.length);
			const singleCard = cardDeck.splice(randomIdx, 1);
			const singleCardValue = singleCard[0];
			tempDeck.push(singleCardValue);
		}
		console.log('tempDeck', tempDeck);
		setShuffledDeck(tempDeck);
	}

	function displayGameCards() {
		const cards = shuffledDeck.map((card, idx) => {
			return (
				<div className={`card-container flip`} title={card} key={idx}>
					<div className="back card"></div>
					<div className={`front card ${card}`}></div>
				</div>
			)
		})
		return cards;
	}

	// Initial Page Load =================
	useEffect(() => {
		createUniqCards();
		shuffleDeck();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


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
