import Head from 'next/head'
import Header from '../../components/Header'


// const items = [0,1,2,3,4,5,6,7,8,9];
const itemsPerColumn = Array.from({ length: 10 }, (value, index) => index);
const columns = itemsPerColumn;


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

const Grid = () => {
	return (
		<div className={`grid-container`}>
			{columns.map((item, idx) => (
				<GridColumn key={idx} column={`column-${idx + 1}`} />
			))}
		</div>
	);
}

const Example = (props) => {
	const code = `.grid-item:nth-child(${props.code}) {
  opacity: 1;
}`
	return (
		<section className={`example ${props.example}`}>
			<hr />
			<p>#1 - All</p>
			<pre><code>{code}</code></pre>
			<Grid />
		</section>
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
				<Example example="all" code="n"/>
				{/* <Grid example="all" /> */}
				{/* <GridColumn name="group-1"/> */}
				{/* <GridItem group='group-8' item='item-1'/> */}
			</main>
		</>
	);
}
