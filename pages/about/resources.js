import Head from 'next/head'
import Link from 'next/link'
import Header from '../../components/Header'
import { createClient } from 'contentful'


// get CMS content =================
const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

export async function getStaticProps() {
	const res = await client.getEntries({ content_type: 'resources' });
	return {
		props: {
			resources: res.items
		}
	}
}


export default function Images({ resources }) {
	const { id, title, images, url } = resources[0].fields;

	return (
		<>
			<Head>
				<title>Oxleberry | Resources</title>
				<meta name="description" content="Oxleberry - Resources"/>
			</Head>
			<main className="page-backboard resource-page">
				<Header headline="Resources" isSubPage={true}></Header>
				<Link href={url}>
					<a className={`link-${id}`}><h2>{title}</h2></a>
				</Link>
				<div className={`images-container images-container-${id}`}>
					{images.map((image, idx) => {
						return (
							<picture key={idx} className={`img-${idx + 1}`}>
								<source srcSet={image.fields.file.url} />
								<img src={image.fields.file.url} alt={image.fields.description} />
							</picture>
						)
					})}
				</div>
			</main>
		</>
	);
}
