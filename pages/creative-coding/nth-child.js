import Head from 'next/head'
import Header from '../../components/Header'


const GridItem = (props) => {
	return (
		<div className={`grid-item ${props.column} ${props.item}`}></div>
	);
}


export default function nthChild() {

	return (
		<>
			<Head>
				<title>Oxleberry | nth-child</title>
				<meta name="description" content="Examples using the :nth-child pseudo-class." />
			</Head>
			<main className="full-backboard nth-child-page">
				<Header headline="nth-child Examples" alt={true}></Header>
				<section className="example example-01">
					<div className="grid-container">
						<GridItem column='column-8' item='item-1'/>
				</div>
				</section>
			</main>
		</>
	);
}
