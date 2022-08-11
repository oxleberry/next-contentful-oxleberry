import Head from 'next/head'
import Header from '../../../components/Header'
import { createClient } from 'contentful'


const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

// Generates all the paths (ie):`/gallery/comic-stamps`
export async function getStaticPaths() {
	const res = await client.getEntries({
		content_type: 'gallery'
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
		content_type: 'gallery',
		'fields.slug': context.params.slug // Get data that matches this field (will output an array)
	});
	return {
		props: { gallery: res.items[0] }
	};
}


export default function Gallery({ gallery }) {
	const { title, slug, metaDescription, headline, images, description } = gallery.fields;

	return (
		<>
			<Head>
				<title>{`Oxleberry | ${title}`}</title>
				<meta name="description" content={metaDescription}/>
			</Head>
			<main className={`page-backboard gallery-page ${slug}`}>
				<Header headline={headline} alt={true}></Header>
				<div className="gallery-container">
					{images.map((image, idx) => {
						return (
							<picture key={idx}>
							<source srcSet={image.fields.file.url} />
							<img src={image.fields.file.url} alt={image.fields.description} />
						</picture>
						)
					})}
				</div>
				<p className="text">{description}</p>
			</main>
		</>
	);
}
