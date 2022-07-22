import Head from 'next/head'
import Image from 'next/image'
import Header from '../../components/Header'


export default function AllStars() {
	// Variables =================
	const numOfImageSlices = 6;
	const numOfCharacters = 5;
	const characterIds = ['a', 'b', 'c', 'd', 'e'];

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
	function getMiitomoImageSlices(miitomo) {
		let imageSlices = [];
			for (let i = 1; i <= numOfImageSlices; i++) {
				imageSlices.push(<li key={`${miitomo.id}${i}`}><Image src={`/creative-coding-pages/all-stars/${miitomo.id}${i}.png`} width={150} height={42} alt="miitomo piece" priority /></li>)
			}
		return imageSlices;
	}

	function createMiitomoTiles() {
		const miitomos = data.map((miitomo, idx) => {
			return (
				<ul key={idx}>
					<li id={miitomo.id} className='title'>{miitomo.name}
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


	return (
		<>
			<Head>
				<title>Oxleberry | All Stars</title>
				<meta name="description" content="Oxleberry All-Stars - A fun drop curtain style animation reveals each character. Plus a bonus all-star character which is a random mix of everyone." />
			</Head>
			<main className="full-backboard all-stars-page">
				<div className="intro">
					<picture>
						<source srcSet="/creative-coding-pages/all-stars/star.png"/>
						<img className="star-small" src="/creative-coding-pages/all-stars/star.png" alt="star"/>
					</picture>
					<picture>
						<source srcSet="/creative-coding-pages/all-stars/star.png"/>
						<img className="star-large" src="/creative-coding-pages/all-stars/star.png" alt="star"/>
					</picture>
					<picture>
						<source srcSet="/creative-coding-pages/all-stars/star.png"/>
						<img className="star-small" src="/creative-coding-pages/all-stars/star.png" alt="star"/>
					</picture>
					<Header className="title" headline="Oxleberry All-Stars" alt={true}></Header>
					<picture>
						<source srcSet="/creative-coding-pages/all-stars/star.png"/>
						<img className="star-small" src="/creative-coding-pages/all-stars/star.png" alt="star"/>
					</picture>
					<picture>
						<source srcSet="/creative-coding-pages/all-stars/star.png"/>
						<img className="star-large" src="/creative-coding-pages/all-stars/star.png" alt="star"/>
					</picture>
					<picture>
						<source srcSet="/creative-coding-pages/all-stars/star.png"/>
						<img className="star-small" src="/creative-coding-pages/all-stars/star.png" alt="star"/>
					</picture>
				</div>
				<div className="miitomos-container">
					{createMiitomoTiles()}
				</div>
				<div className="buttons-container">
					<button className="btn">SHOW ALL</button>
					<button className="btn">SHOW STAR</button>
					<button className="btn">RESET</button>
				</div>
			</main>
		</>
	);
}
