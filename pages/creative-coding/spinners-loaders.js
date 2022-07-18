import Head from 'next/head'
import Header from '../../components/Header'

import { createClient } from 'contentful'


export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});

	const res = await client.getEntries({ content_type: 'spinnersLoaders' });

	return {
		props: {
			spinnersLoaders: res.items
		}
	}
}


export default function SpinnersLoaders({ spinnersLoaders }) {
	function getBgImage(id) {
		let bgImage;
		spinnersLoaders.forEach((item) => {
			if (item.fields.id === id) {
				bgImage = {backgroundImage: `url(https:${item.fields.image.fields.file.url})`};
			}
		});
		return bgImage;
	}

	return (
		<>
			<Head>
				<title>Oxleberry | Spinners and Loaders</title>
				<meta name="description" content="Oxleberry Spinners and Loaders using CSS animations." />
			</Head>
			<main className="full-backboard spinners-loaders-page">
				<Header headline="Spinners and Loaders" alt={true}></Header>
				<div className="spinners-wrapper">
					<h2> SPINNERS </h2>
					<div className="spinner sp-spinner1">
						<div className="innerCirc"></div>
					</div>
					<div className="spinner spinner-2">
						<p className="loadingText A">loading</p>
						<p className="loadingText B">.</p>
						<p className="loadingText C">.</p>
						<p className="loadingText D">.</p>
					</div>
					<div className="spinner sp-spinner3"></div>
					<div className="spinner spinner-4"></div>
					<div className="spinner spinner-5"></div>
					<div className="spinner spinner-6">
						<span></span><span></span><span></span>
					</div>
				</div>

				<div className="loaders-wrapper">
					<h2> LOADERS </h2>
					<div className="load-cont">
						<div className="loader2">
							<div className="tree-monster">
								<span className="image" style={getBgImage('tree-monster')}></span>
							</div>
						</div>
						<br />
						<div className="loader3">
							<div className="ghost">
								<span className="image" style={getBgImage('ghost')}></span>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
