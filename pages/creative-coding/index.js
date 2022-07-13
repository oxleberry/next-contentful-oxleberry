import Head from 'next/head'
import Header from '../../components/Header'
import CreativeCard from '../../components/CreativeCard';

const CreativeCoding = () => {
	return (
		<div>
			<Head>
				<title>Oxleberry | Creative Coding</title>
				<meta name="description" content="Oxleberry Creative Coding - a collection of coding projects, each built to learn and explore front-end development concepts using CSS and Javascript." />
			</Head>
			<main className="page-backboard">
				<Header headline="Creative Coding Projects"></Header>
				<section className="creative-cards">
					<CreativeCard />
					<CreativeCard />
					<CreativeCard />
					<CreativeCard />
					<CreativeCard />
					<CreativeCard />
					<CreativeCard />
					<CreativeCard />
				</section>
			</main>
		</div>
	);
}

export default CreativeCoding;