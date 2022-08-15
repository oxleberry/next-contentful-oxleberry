import Head from 'next/head'
import Header from '../components/Header'
import PortfolioCard from '../components/PortfolioCard';
import { createClient } from 'contentful'


export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});
	const res = await client.getEntries({ content_type: 'portfolioCard' });
	return {
		props: { portfolioCards: res.items }
	}
}


export default function Home({ portfolioCards }) {
	portfolioCards.sort((a, b) => a.fields.order - b.fields.order);

	return (
		<>
			<Head>
				<title>Oxleberry | Home</title>
				<meta name="description" content="The works of creative coder Sharon Paz."/>
			</Head>
			<main className="page-backboard">
				<Header headline="Coding Project Highlights"></Header>
				<section className="portfolio-cards">
					{portfolioCards.map((card) => {
						return <PortfolioCard key={card.sys.id} card={card}/>
					})}
				</section>
			</main>
		</>
	)
}
