import Head from 'next/head'
import Header from '../../components/Header'

export default function ShareCard() {
	return (
		<>
			<Head>
				<title>Oxleberry | Share Card</title>
				<meta name="description" content="Oxleberry Share Card - Send a custom greeting" />
			</Head>
			<div className="full-backboard share-card-page">
				<Header headline="Share Card" isSubPage={true}></Header>
				<main>

					<section className="share-content-container"></section>
					<section className="options-container"></section>
					<section className="canvas-container"></section>

				</main>
			</div>
		</>
	);
}
