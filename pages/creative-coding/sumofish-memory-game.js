import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { useEffect, useState, useRef } from 'react'
import { createClient } from 'contentful'


// Variables =================
const pairsInPlay = 6;


// get CMS content =================
export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});
	const res = await client.getEntries({ content_type: 'memoryGame' });
	return {
		props: { memoryGameItems: res.items }
	}
}


export default function MemoryGame({ memoryGameItems }) {
	// Assets =================
	const cardBackImages = memoryGameItems.filter((item) => item.fields.id === 'card-back');
	const cardFrontImages = memoryGameItems.filter((item) => item.fields.id === 'card-front');
	const frontImageAssets = cardFrontImages[0].fields.cardImages;

	// States =================
	const [shuffledDeck, setShuffledDeck] = useState([]); // array of strings
	const [firstPick, setFirstPick] = useState(undefined); // single element
	const [matchCounter, setMatchCounter] = useState(0); // number
	const [audioMatch, setAudioMatch] = useState(null);
	const [audioWin, setAudioWin] = useState(null);
	const [audioReset, setAudioReset] = useState(null);

	// Elements =================
	const cardRefs = useRef([]);
	cardRefs.current = [];

	// Helper Functions =================
	function randomNumGenerator(maxNum) {
		return Math.floor(Math.random() * maxNum);
	};

	// create pairs of cards used in gameplay deck
	// retuns an array of objects
	const createCardsInPlayDeck = () => {
		let cards = [];
		let tempDupCards = [...frontImageAssets]; // will duplicate the original array
		for (let i = 0; i < pairsInPlay; i++) {
			const randomIdx = randomNumGenerator(tempDupCards.length);
			const singleCard = tempDupCards.splice(randomIdx, 1);  // removes the random element from the tempDupCards array
			const singleCardValue = singleCard[0];
			cards.push(singleCardValue);
			cards.push(singleCardValue);
		};
		return cards;
	}

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
		setShuffledDeck(tempDeck);
	}

	function displayGameCards() {
		const backBgImage = {backgroundImage: `url(https:${cardBackImages[0].fields.cardImages[0].fields.file.url})`};
		const cards = shuffledDeck.map((card, idx) => {
			const frontBgImage = {backgroundImage: `url(https:${card.fields.file.url})`};
			const title = card.fields.title;
			return (
				<div ref={addToCardRefs} onClick={cardClickHandler} className={`card-container`} key={idx}>
					<div className="back card" style={backBgImage}></div>
					<div className={`front card`} style={frontBgImage} title={title}></div>
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
			const secondCardData = secondCard.lastElementChild.getAttribute('title');
			const firstCardData = firstPick.lastElementChild.getAttribute('title');
			// check if second card flipped is a match and the game is over
			if (firstCardData === secondCardData && matchCounter === (pairsInPlay - 1)) {
				audioWin.volume = 0.2;
				audioWin.play();
			}
			// check if second card flipped is a match
			else if (firstCardData === secondCardData) {
				let tempCounter = matchCounter += 1;
				setMatchCounter(tempCounter);
				audioMatch.volume = 0.2;
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
		audioReset.volume = 0.4;
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
				<Header headline="Sumofish Memory Game" isSubPage={true} ></Header>
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
