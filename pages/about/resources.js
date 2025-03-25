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
	resources.sort((a, b) => a.fields.order - b.fields.order);

	return (
		<>
			<Head>
				<title>Oxleberry | Resources</title>
				<meta name="description" content="Oxleberry - Resources"/>
			</Head>
			<main className="page-backboard resource-page">
				<Header headline="Resources" isSubPage={true}></Header>
				{resources.map ((item, idx) => {
					const { id, title, images, audioFiles, url } = item.fields;
					return (
						<div key={idx} className={`resource-container resource-container-${id}`}>
							<Link href={url}>
								<a className={`link-${id}`}><h2>{title}</h2></a>
							</Link>
							{images ?
								<div className="images-container">
									{images.map((image, idx) => {
										return (
											<picture key={idx} className={`img-${idx + 1}`}>
												<source srcSet={image.fields.file.url} />
												<img src={image.fields.file.url} alt={image.fields.description} />
											</picture>
										)
									})}
								</div>
							: null}
							{audioFiles ?
								<div className="audio-container">
									<span>Audio files</span>
									{audioFiles.map((audio, idx) => <audio key={idx} src={audio.fields.file.url}></audio>)}
								</div>
							: null}
						</div>
					)
				})}
			</main>
		</>
	);
}
