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
	return (
		<section className={`example ${props.class}`}>
			<hr />
			<h2>{props.id} - {props.name}</h2>
			<pre><code>{props.codeBrief}</code></pre>
			{/* <pre><code>{props.code}</code></pre> */}
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

				<Example
					id="1"
					name="All"
					class="all"
					codeBrief={`:nth-child(n)`}
					code={`.grid-item:nth-child(n) {
  opacity: 1;
}`}/>
				<Example
					id="2"
					name="None"
					class="none"
					codeBrief={`:nth-child(0)`}
					code={`.grid-item:nth-child(0) {
  opacity: 1;
}`}/>
				{/* <Grid example="all" /> */}
				{/* <GridColumn name="group-1"/> */}
				{/* <GridItem group='group-8' item='item-1'/> */}
			</main>
		</>
	);
}
