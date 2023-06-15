import Head from 'next/head'
import Header from '../../components/Header'


// const items = [0,1,2,3,4,5,6,7,8,9];
const itemsPerColumn = Array.from({ length: 10 }, (value, index) => index);


const GridItem = (props) => {
	return (
		<div className={`grid-item ${props.column} ${props.item}`}></div>
	);
}

const GridColumn = (props) => {
	return (
		<>
			{itemsPerColumn.map((item, idx) => (
				<GridItem key={idx} column={props.column} item={`item-${idx + 1}`} />
			))}
		</>
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
						<GridColumn column="column-1"/>
						<GridColumn column="column-2"/>
						<GridColumn column="column-3"/>
						{/* <GridItem column='column-8' item='item-1'/> */}
				</div>
				</section>
			</main>
		</>
	);
}
