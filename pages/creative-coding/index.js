import Head from 'next/head'
import { createClient } from 'contentful'

import Header from '../../components/Header'
import CreativeCard from '../../components/CreativeCard'


export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});

	const res = await client.getEntries({ content_type: 'creativeCard' });

	return {
		props: {
			creativeCards: res.items
		}
	}
}

export default function CreativeCoding({ creativeCards }) {

	// console.log(creativeCards)
	creativeCards.sort((a, b) => a.fields.order - b.fields.order);

	return (
		<>
			<Head>
				<title>Oxleberry | Creative Coding</title>
				<meta name="description" content="Oxleberry Creative Coding - a collection of coding projects, each built to learn and explore front-end development concepts using CSS and Javascript." />
			</Head>
			<main className="page-backboard">
				<Header headline="Creative Coding Projects"></Header>
				<section className="creative-cards">
					{creativeCards.map((card) => {
						return <CreativeCard key={card.sys.id} card={card}/>
					})}
				</section>
			</main>
		</>
	);
}
