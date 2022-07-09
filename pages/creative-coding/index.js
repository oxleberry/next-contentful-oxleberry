import Head from 'next/head'
import styles from '../../styles/Home.module.scss'

const CreativeCoding = () => {
	return (
		<div>
			<Head>
				<title>Oxleberry | Creative Coding</title>
				<meta name="description" content="Oxleberry Creative Coding - a collection of coding projects, each built to learn and explore front-end development concepts using CSS and Javascript." />
			</Head>
			<div className={styles.wrapper}>
				<h1>Creative Coding</h1>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			</div>
		</div>
		);
}

export default CreativeCoding;