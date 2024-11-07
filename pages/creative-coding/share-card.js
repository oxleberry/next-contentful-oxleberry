import Head from 'next/head'
import Header from '../../components/Header'

export default function ShareCard() {
	return (
		<>
			<Head>
				<title>Oxleberry | Share Card</title>
				<meta name="description" content="Oxleberry Share Card - Send a custom greeting card" />
			</Head>
			<main className="full-backboard share-card-page">
				<Header headline="Share Card" isSubPage={true}></Header>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			</main>
		</>
	);
}
