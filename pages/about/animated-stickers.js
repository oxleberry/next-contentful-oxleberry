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
	const { title, stickerImages } = animatedStickers[0].fields;

	return (
		<>
			<Head>
				<title>Oxleberry | Animated Stickers</title>
				<meta name="description" content="Oxleberry Stickers - A short run of iMessage animated stickers that was available for iPhones from 2020-2021." />
			</Head>
			<main className="page-backboard animated-stickers-page">
				<Header headline={title} alt={true}></Header>
				<div className="grid">
					{stickerImages.map((image, idx) => {
						return (
							<picture key={idx} className={`img-${idx + 1}`}>
								<source srcSet={image.fields.file.url} />
								<img
									className="sticker-image"
									src={image.fields.file.url}
									alt={image.fields.description}
								/>
							</picture>
						)
					})}
				</div>
			</main>
		</>
	);
}
