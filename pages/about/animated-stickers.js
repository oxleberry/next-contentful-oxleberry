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


// Sticker components =================
const StickerImage = ({ stickerImage }) => {
	const { title, order, image, imageType, url } = stickerImage.fields;
	return (
		<picture id={order} className={image.fields.title}>
			<source srcSet={image.fields.file.url} />
			<img
				className={imageType}
				src={image.fields.file.url}
				alt={image.fields.description}
			/>
		</picture>
	);
}


export default function animatedStickers({ animatedStickers }) {
	animatedStickers.sort((a, b) => a.fields.order - b.fields.order);
	const stickerImages = animatedStickers.filter((images) => images.fields.imageType[0] === 'sticker-image');
	const appImages = animatedStickers.filter((images) => images.fields.imageType[0] === 'app-image');

	// console.log(animatedStickers);
	// console.log(stickerImages);
	// console.log(appImages);

	return (
		<>
			<Head>
				<title>Oxleberry | Animated Stickers</title>
				<meta name="description" content="Oxleberry Stickers - A short run of iMessage animated stickers that was available for iPhones from 2020-2021." />
			</Head>
			<main className="page-backboard animated-stickers-page">
				<Header headline="Oxleberry Stickers" alt={true}></Header>
				{/* Grid for Sticker Images */}
				<div className="grid">
					{stickerImages.map((stickerImage) => {
						return <StickerImage key={stickerImage.sys.id} stickerImage={stickerImage}/>
					})}
				</div>

				<hr />
				<p className="description">A short run of iMessage animated stickers that was available for iPhones from 2020-2021.</p>
				{/* App Images */}
				{appImages.map((appImage) => {
					return <StickerImage key={appImage.sys.id} stickerImage={appImage}/>
				})}
			</main>
		</>
	);
}
