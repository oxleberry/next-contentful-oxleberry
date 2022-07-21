import Head from 'next/head'
import { createClient } from 'contentful'

import Header from '../../components/Header'
import { AboutTile, AboutSocialTile } from '../../components/AboutTile'


export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});

	const res = await client.getEntries({ content_type: 'aboutTile' });

	return {
		props: {
			aboutTiles: res.items
		}
	}
}

export default function About({ aboutTiles }) {
	aboutTiles.sort((a, b) => a.fields.order - b.fields.order);

	return (
		<>
			<Head>
				<title>Oxleberry | About</title>
				<meta name="description" content="Oxleberry About - a collage of interests and activities from the life of Sharon Paz." />
			</Head>
			<main className="page-backboard">
				<Header headline="Sharon Paz"></Header>
				<section className="about-tiles">
					{aboutTiles.map((tile) => {
						return <AboutTile key={tile.sys.id} tile={tile}/>
					})}
					<AboutSocialTile />
				</section>
			</main>
		</>
	);
}
