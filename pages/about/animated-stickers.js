import Head from 'next/head'
import { createClient } from 'contentful'
import Header from '../../components/Header'


// get CMS content =================
const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

export async function getStaticProps() {
	const res = await client.getEntries({ content_type: 'animatedStickers' });
	return {
		props: {
			animatedStickers: res.items
		}
	}
}


export default function animatedSticker({ animatedStickers }) {
	// const { title, stickerImages, appDescription, appImages } = animatedStickers[0].fields;
	animatedStickers.sort((a, b) => a.fields.order - b.fields.order);
	console.log(animatedStickers);

	return (
		<>
			<Head>
				<title>Oxleberry | Animated Stickers</title>
				<meta name="description" content="Oxleberry Stickers - A short run of iMessage animated stickers that was available for iPhones from 2020-2021." />
			</Head>
			<main className="page-backboard animated-stickers-page">
				<Header headline="Oxleberry Stickers" alt={true}></Header>
				{/* Sitckers Grid */}
				<div className="grid">
					{animatedStickers.map((image, idx) => {
						return (
							<picture key={idx} className={`img-${idx + 1}`}>
								<source srcSet={image.fields.image.fields.file.url} />
								<img
									className="sticker-image"
									src={image.fields.image.fields.file.url}
									alt={image.fields.image.fields.description}
								/>
							</picture>
						)
					})}
				</div>

				<hr />
				<p className="description">A short run of iMessage animated stickers that was available for iPhones from 2020-2021.</p>
				{/* {appImages.map((image, idx) => {
					return (
						<picture key={idx} className={`img-${idx + 1}`}>
							<source srcSet={image.fields.file.url} />
							<img
								className="app-image"
								src={image.fields.file.url}
								alt={image.fields.description}
							/>
						</picture>
					)
				})} */}
			</main>
		</>
	);
}
