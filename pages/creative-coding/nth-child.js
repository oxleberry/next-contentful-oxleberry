import Head from 'next/head'
import Header from '../../components/Header'


export default function nthChild() {

	return (
		<>
			<Head>
				<title>Oxleberry | nth-child</title>
				<meta name="description" content="Examples using the :nth-child pseudo-class." />
			</Head>
			<main className="full-backboard nth-child-page">
				<Header headline="nth-child Examples" alt={true}></Header>
				<section className="">
				</section>
			</main>
		</>
	);
}
