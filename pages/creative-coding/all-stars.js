import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Header from '../../components/Header'

import { createClient } from 'contentful'


export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});

	const res = await client.getEntries({ content_type: 'allStars' });

	return {
		props: {
			allStarsItems: res.items
		}
	}
}


export default function AllStars({ allStarsItems }) {
	const miitomoImageSlices = allStarsItems.filter((item) => item.fields.isMiitomoSlice);
	const introStarImage = allStarsItems.filter((item) => item.fields.assetsId === 'star');
	const introStarImagePath = introStarImage[0].fields.assets[0].fields;
	const audioPop = allStarsItems.filter((item) => item.fields.assetsId === 'audioPop');
	const audioPopPath = audioPop[0].fields.assets[0].fields;

	// Variables =================
	const numOfImageSlices = 6;
	const numOfCharacters = 5;
	const characterIds = ['a', 'b', 'c', 'd', 'e'];

	// Elements =================
	const soundEffectRef = useRef(null);

	// States =================
	const [allStarId, setAllStarId] = useState([0, 0, 0, 0, 0, 0]);
	const [miitomoClass, setMiitomoClass] = useState('');
	const [miitomoBtn, setMiitomoBtn] = useState('SHOW ALL');
	const [allStarClass, setAllStarClass] = useState('');
	const [allStarBtn, setAllStarBtn] = useState('SHOW STAR');
	const [highlight, setHighlight] = useState('');


	const data = [
		{
			name: "sharon",
			id: characterIds[0],
			random: false
		},
		{
			name: "manuel",
			id: characterIds[1],
			random: false
		},
		{
			name: "silas",
			id: characterIds[2],
			random: false
		},
		{
			name: "tim",
			id: characterIds[3],
			random: false
		},
		{
			name: "sylvia",
			id: characterIds[4],
			random: false
		},
		{
			name: "all-star",
			id: "f",
			random: true
		}
	]


	// Helper Function =================
	function randomIdxGenerator(range) {
		const randomNum = Math.floor(Math.random() * range);
		return randomNum;
	};

	function createRandomAllStar() {
		let tempIds = []
		for (let i = 0; i < numOfImageSlices; i++) {
			const randomIdx = randomIdxGenerator(numOfCharacters);
			tempIds.push(randomIdx)
		}
		setAllStarId(tempIds);
	};

	function getMiitomoImageSlices(miitomo) {
		let imageSlices = [];
		if (miitomo.random) {
			for (let i = 0; i < numOfImageSlices; i++) {
				const allStarIdx = allStarId[i];
				const imagePath = miitomoImageSlices[allStarIdx].fields.assets[i].fields;
				imageSlices.push(
					<li key={`${miitomo.id}${i}`} className={`star${allStarClass}`}>
						<Image
							src={`https:${imagePath.file.url}`}
							width={imagePath.file.details.image.width}
							height={imagePath.file.details.image.height}
							alt={imagePath.description}
							priority />
					</li>
				)
			}
		} else {
			const miitomoIds = miitomoImageSlices.map((items) => items.fields.assetsId);
			const miitomoIdx = miitomoIds.findIndex((miitomoId) => miitomoId === miitomo.id);
			for (let i = 0; i < numOfImageSlices; i++) {
				const imagePath = miitomoImageSlices[miitomoIdx].fields.assets[i].fields;
				imageSlices.push(
					<li key={`${miitomo.id}${i}`} className={`${miitomoClass}`}>
						<Image
							src={`https:${imagePath.file.url}`}
							width={imagePath.file.details.image.width}
							height={imagePath.file.details.image.height}
							alt={imagePath.description}
							priority />
					</li>
				)
			}
		}
		return imageSlices;
	}

	function createMiitomoTiles() {
		const miitomos = data.map((miitomo, idx) => {
			return (
				<ul key={idx}>
					<li id={miitomo.id} className={`title${miitomo.random ? highlight : ''}`}>{miitomo.name}
						<ul className="drop-menu flap-down-motion">
							{getMiitomoImageSlices(miitomo)}
						</ul>
					</li>
					<div className="back-drop">
						<div className="stripe-header"></div>
						<div className="stripe-light"></div>
						<div className="stripe-dark"></div>
						<div className="stripe-light"></div>
						<div className="stripe-dark"></div>
						<div className="stripe-light"></div>
						<div className="stripe-dark last"></div>
					</div>
				</ul>
			)
		})
		return miitomos;
	}


	// Event Handlers =================
	function showClickHandler() {
		(miitomoClass === '') ? setMiitomoClass('show') : setMiitomoClass('');
		(miitomoClass === '') ? setMiitomoBtn('HIDE ALL') : setMiitomoBtn('SHOW ALL');
		(miitomoClass === '') ? setAllStarClass(' show') : setAllStarClass('');
		(miitomoClass === '') ? setAllStarBtn('HIDE STAR') : setAllStarBtn('SHOW STAR');
	}

	function starClickHandler() {
		(allStarClass === '') ? setAllStarClass(' show') : setAllStarClass('');
		(allStarClass === '') ? setAllStarBtn('HIDE STAR') : setAllStarBtn('SHOW STAR');
	}

	function resetClickHandler() {
		createRandomAllStar();
		soundEffectRef.current.play();
		setHighlight(' highlight');
		setTimeout(() => {
			setHighlight('');
		}, 3000);
	}


	// Initial Page Load =================
	useEffect(() => {
		createRandomAllStar();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<>
			<Head>
				<title>Oxleberry | All Stars</title>
				<meta name="description" content="Oxleberry All-Stars - A fun drop curtain style animation reveals each character. Plus a bonus all-star character which is a random mix of everyone." />
			</Head>
			<main className="full-backboard all-stars-page">
				<div className="intro">
					<picture>
						<source srcSet={`https:${introStarImagePath.file.url}`}/>
						<img className="star-small" src={`https:${introStarImagePath.file.url}`} alt={`${introStarImagePath.description}`}/>
					</picture>
					<picture>
						<source srcSet={`https:${introStarImagePath.file.url}`}/>
						<img className="star-large" src={`https:${introStarImagePath.file.url}`} alt={`${introStarImagePath.description}`}/>
					</picture>
					<picture>
						<source srcSet={`https:${introStarImagePath.file.url}`}/>
						<img className="star-small" src={`https:${introStarImagePath.file.url}`} alt={`${introStarImagePath.description}`}/>
					</picture>
					<Header className="title" headline="Oxleberry All-Stars" isSubPage={true}></Header>
					<picture>
						<source srcSet={`https:${introStarImagePath.file.url}`}/>
						<img className="star-small" src={`https:${introStarImagePath.file.url}`} alt={`${introStarImagePath.description}`}/>
					</picture>
					<picture>
						<source srcSet={`https:${introStarImagePath.file.url}`}/>
						<img className="star-large" src={`https:${introStarImagePath.file.url}`} alt={`${introStarImagePath.description}`}/>
					</picture>
					<picture>
						<source srcSet={`https:${introStarImagePath.file.url}`}/>
						<img className="star-small" src={`https:${introStarImagePath.file.url}`} alt={`${introStarImagePath.description}`}/>
					</picture>
				</div>
				<div className="miitomos-container">
					{createMiitomoTiles()}
				</div>
				<div className="buttons-container">
					<button onClick={showClickHandler} className="btn">{miitomoBtn}</button>
					<button onClick={starClickHandler} className="btn">{allStarBtn}</button>
					<button onClick={resetClickHandler} className="btn">RESET</button>
					<audio ref={soundEffectRef} preload="auto" src={`https:${audioPopPath.file.url}`}></audio>
				</div>
			</main>
		</>
	);
}
