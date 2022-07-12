import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

const About = () => {
	return (
		<div>
			<Head>
				<title>Oxleberry | About</title>
				<meta name="description" content="Oxleberry About - a collage of interests and activities from the life of Sharon Paz." />
			</Head>
			<main className="page-backboard">
				<Header headline="Sharon Paz"></Header>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<picture>
					<source srcSet="/oxle-icon.gif" />
					<img src="/oxle-icon.gif" alt="Oxleberry logo - three little monsters" />
				</picture>
				<br />
				<Image src="/oxle-icon.gif" width={291} height={100} alt="Oxleberry logo - three little monsters"/>
			</main>
		</div>
	);
}

export default About;
