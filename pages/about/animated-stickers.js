import Head from 'next/head'
import Header from '../../components/Header'


export default function animatedSticker() {
	return (
		<>
			<Head>
				<title>Oxleberry | Animated Stickers</title>
				<meta name="description" content="Oxleberry Stickers - A short run of iMessage animated stickers that was available for iPhones from 2020-2021." />
			</Head>
			<main className="page-backboard animated-stickers-page">
				<Header headline="Oxleberry Stickers" alt={true}></Header>
				<picture>
					<source srcSet="/animated-stickers/blue-monster-chomp-animation.gif" />
					<img className="sticker-image" src="/animated-stickers/blue-monster-chomp-animation.gif" alt="animated sticker" />
				</picture>
			</main>
		</>
	);
}
