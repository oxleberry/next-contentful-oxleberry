import Head from 'next/head'
import Image from 'next/image'
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
					<source srcSet="/oxle-icon.gif" />
					<img src="/oxle-icon.gif" alt="Oxleberry logo - three little monsters" />
				</picture>
				<br />
				<Image src="/oxle-icon.gif" width={291} height={100} alt="Oxleberry logo - three little monsters"/>
			</main>
		</>
	);
}
