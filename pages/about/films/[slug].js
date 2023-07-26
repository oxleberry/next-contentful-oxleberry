import Head from 'next/head'
import Link from 'next/link'
import { createClient } from 'contentful'
import Header from '../../../components/Header'


const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

// Generates all the paths (ie):`about/films/dobble`
export async function getStaticPaths() {
	const res = await client.getEntries({
		content_type: 'film'
	});
	const paths = res.items.map(item => {
		return {
			params: { slug: item.fields.slug }
		}
	});
	return {
		paths: paths,
		fallback: false // if path does not exist will show 404 page
	};
}

// Grabs data for each page
export async function getStaticProps(context) {
	const res = await client.getEntries({
		content_type: 'film',
		'fields.slug': context.params.slug // Get data that matches this field (will output an array)
	});
	return {
		props: { film: res.items[0] }
	};
}


export default function Film({ film }) {
	const { title, slug, metaDescription, videoUrl, description, ctaPrevious, ctaNext } = film.fields;

	return (
		<>
			<Head>
				<title>Oxleberry | Film</title>
				<meta name="description" content={metaDescription}/>
			</Head>
			<main className={`page-backboard film-page ${slug}`}>
				<div className="header-film-nav">
					<Link href={`${ctaPrevious}`}><a><div className="cta-arrow cta-arrow-previous"></div></a></Link>
					<Header headline={title} isSubPage={true}></Header>
					<Link href={ctaNext}><a><div className="cta-arrow"></div></a></Link>
				</div>
				<div className="films-container">
					<iframe
						src={videoUrl}
						title={title}
						allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
					/>
				</div>
				<div className="description" dangerouslySetInnerHTML={{__html: description}}></div>
			</main>
		</>
	);
}
