import Head from 'next/head'
import Header from '../../components/Header'


// const rows = [0,1,2,3,4,5,6,7,8,9];
const rows = Array.from({ length: 10 }, (value, index) => index);
const columns = rows;
const examplesData = [
	{
		id: "1",
		title: "All",
		class: "all",
		codeBrief: `:nth-child(n)`,
		code: `.grid-item:nth-child(n) {
  opacity: 1;
}`
	},
	{
		id: "2",
		title: "None",
		class: "none",
		codeBrief: `:nth-child(0)`,
		code: `.grid-item:nth-child(0) {
  opacity: 1;
}`
	},
	{
		id: "3",
		title: "Only first item",
		class: "first",
		codeBrief: `:nth-child(1)`,
		code: `.grid-item:nth-child(1) {
  opacity: 1;
}`
	}
];


const GridItem = (props) => {
	return (
		<div className={`grid-item ${props.column} ${props.item}`}></div>
	);
}


const GridColumn = (props) => {
	return (
		<>
			{rows.map((item, idx) => (
				<GridItem key={`item-${idx}`} column={props.column} item={`item-${idx + 1}`} />
			))}
		</>
	);
}


const Grid = () => {
	return (
		<div className={`grid-container`}>
			{columns.map((item, idx) => (
				<GridColumn key={`column-${idx}`} column={`column-${idx + 1}`} />
			))}
		</div>
	);
}

const Example = (props) => {
	return (
		<section className={`example ${props.class}`}>
			<hr />
			<h2>{props.id}. {props.title}</h2>
			<pre><code>{props.code}</code></pre>
			{/* <pre><code>{props.code}</code></pre> */}
			<Grid />
		</section>
	);
}

const ExampleList = (props) => {
	return (
		<>
			{props.examplesData.map((data) => (
				<Example
					key={`example-${data.id}`}
					id={data.id}
					title={data.title}
					class={data.class}
					codeBrief={data.codeBrief}
					code={data.code}
				/>
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
				<p>Based on <a href="https://www.youtube.com/watch?v=fg7GEN7PbWs&t=46s">Master the :nth-child</a> tutorial video.</p>
				<p>Play around on <a href="https://codepen.io/oxleberry/pen/LYgRwgW">Codepen</a>.</p>
					<ExampleList examplesData={examplesData} />

				{/* <Example
					id="1"
					title="All are selected"
					class="all"
					codeBrief={`:nth-child(n)`}
					code={`.grid-item:nth-child(n) {
  opacity: 1;
}`}/>
				<Example
					id="2"
					title="None are selected"
					class="none"
					codeBrief={`:nth-child(0)`}
					code={`.grid-item:nth-child(0) {
  opacity: 1;
}`}/> */}
				{/* <Grid example="all" /> */}
				{/* <GridColumn name="group-1"/> */}
				{/* <GridItem group='group-8' item='item-1'/> */}
			</main>
		</>
	);
}
