import Head from 'next/head'
import Header from '../../../components/Header'
import { createClient } from 'contentful'


const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

// Generates all the paths (ie):`/comics/comic-one` and `/comics/comic-two`
// paths obj will look something like this:
// paths: [{ params: { slug: 'comic-one' } }, { params: { slug: 'comic-two' } }],
export async function getStaticPaths() {
	const res = await client.getEntries({
		content_type: 'comic'
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

// Next.JS will grab one item at a time:
// getStaticProps will get called for each
// of the paths generated from getStaticPaths
export async function getStaticProps(context) {
	// console.log(context);
	const res = await client.getEntries({
		content_type: 'comic',
		'fields.slug': context.params.slug // Get data that matches this field (will output an array)
	});
	return {
		props: { comic: res.items[0] }
	};
}


export default function Comic({ comic }) {
	const { title, slug, metaDescription, images } = comic.fields;

	return (
		<>
			<Head>
				<title>Oxleberry | Comic</title>
				<meta name="description" content={metaDescription}/>
			</Head>
			<main className={`page-backboard comic-page ${slug}`}>
				<Header headline={title} alt={true}></Header>
				<div className="comic-container">
						{images.map((image, idx) => {
							return (
								<picture key={idx}>
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
