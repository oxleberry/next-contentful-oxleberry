import Head from 'next/head'
import Header from '../../components/Header'

const CreativeCoding = () => {
	return (
		<div>
			<Head>
				<title>Oxleberry | Creative Coding</title>
				<meta name="description" content="Oxleberry Creative Coding - a collection of coding projects, each built to learn and explore front-end development concepts using CSS and Javascript." />
			</Head>
			<main className="page-backboard">
				<Header headline="Creative Coding Projects"></Header>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			</main>
		</div>
	);
}

export default CreativeCoding;
