import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'


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
	const [firstPick, setFirstPick] = useState(undefined); // single element
	const [matchCounter, setMatchCounter] = useState(0); // number
	const [audioMatch, setAudioMatch] = useState(null)
	const [audioWin, setAudioWin] = useState(null)
	const [audioReset, setAudioReset] = useState(null)

	// Elements =================
	const cardRefs = useRef([]);
	cardRefs.current = [];

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
				<div ref={addToCardRefs} onClick={cardClickHandler} className={`card-container`} title={card} key={idx}>
					<div className="back card"></div>
					<div className={`front card ${card}`}></div>
				</div>
			)
		})
		return cards;
	}

	// store Card elements
	function addToCardRefs(cardRef) {
		if (cardRef && !cardRefs.current.includes(cardRef)) {
			cardRefs.current.push(cardRef);
		}
	}


	// Event Handlers =================
	function cardClickHandler(event) {
		// checks to see if a card is flipped, before flipping or keeping face up
		if (event.currentTarget.classList.contains('flip')){
			return; // ends function, does not proceed with evaluation
		} else {
			event.currentTarget.classList.add('flip');
		}
		// Evaluates match //
		// tracks first picked card
		if (firstPick === undefined) {
			const firstCard = event.currentTarget;
			setFirstPick(firstCard);
		// evaluates second card
		} else {
			const secondCard = event.currentTarget;
			const secondCardData = event.currentTarget.getAttribute('title');
			const firstCardData = firstPick.getAttribute('title');
			// check if second card flipped is a match and the game is over
			if (firstCardData === secondCardData && matchCounter === (pairsInPlay - 1)) {
				console.log("YOU WON");
				audioWin.play();
			}
			// check if second card flipped is a match
			else if (firstCardData === secondCardData) {
				console.log("MATCH");
				let tempCounter = matchCounter += 1;
				setMatchCounter(tempCounter);
				audioMatch.play();
			}
			// no match - flip cards back over
			else {
				setTimeout(() => {
					firstPick.classList.remove('flip');
					secondCard.classList.remove('flip');
				}, 1000);
			}
			// untracks first card to check the next match
			setFirstPick(undefined);
		}
	}

	// resets the game, with all new images randomly generated
	function resetClickHandler() {
		console.log("RESET");
		audioReset.play();
		setMatchCounter(0);
		// flips over all of the cards to the back side
		const allCards = cardRefs.current;
		allCards.forEach((item) => {
			item.classList.remove('flip');
		});
		// sets delay so new cards images are not visible
		// before they are fully turned over
		setTimeout(() => {
			shuffleDeck();
		}, 1000);
	}


	// Initial Page Load =================
	useEffect(() => {
		createUniqCards();
		shuffleDeck();
		// audio api can't be run on the server, this will only be called on client
		setAudioMatch(new Audio('https://www.kasandbox.org/programming-sounds/rpg/hit-whack.mp3'));
		setAudioWin(new Audio('https://www.kasandbox.org/programming-sounds/retro/coin.mp3'));
		setAudioReset(new Audio('https://www.kasandbox.org/programming-sounds/rpg/giant-yah.mp3'));
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
					<button onClick={resetClickHandler} className="btn-reset">RESET</button>
				</section>
			</main>
		</>
	)
}
