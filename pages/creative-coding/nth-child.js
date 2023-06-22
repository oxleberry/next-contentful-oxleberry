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
	},
	{
		id: "4",
		title: "Only fifth item",
		class: "fifth",
		codeBrief: `:nth-child(5)`,
		code: `.grid-item:nth-child(5) {
  opacity: 1;
}`
	},
	{
		id: "5",
		title: "Even",
		class: "even",
		codeBrief: `:nth-child(even)`,
		code: `.grid-item:nth-child(even) {
  opacity: 1;
}`
	},
	{
		id: "6",
		title: "Odd",
		class: "odd",
		codeBrief: `:nth-child(odd)`,
		code: `.grid-item:nth-child(odd) {
  opacity: 1;
}`
	},
	{
		id: "7",
		title: "Every third",
		class: "thirds",
		codeBrief: `:nth-child(3n)`,
		code: `.grid-item:nth-child(3n) {
  opacity: 1;
}`
	},
	{
		id: "8",
		title: "Every third, offset by 4",
		class: "thirds-offset-4",
		codeBrief: `:nth-child(3n + 4)`,
		code: `.grid-item:nth-child(3n + 4) {
  opacity: 1;
}`
	},
	{
		id: "9",
		title: "Every third, offset by 21",
		class: "thirds-offset-21",
		codeBrief: `:nth-child(3n + 21)`,
		code: `.grid-item:nth-child(3n + 21) {
  opacity: 1;
}`
	},
	{
		id: "10",
		title: "Every item 5 and above",
		class: "five-above",
		codeBrief: `:nth-child(n + 5)`,
		code: `.grid-item:nth-child(n + 5) {
  opacity: 1;
}`
	},
	{
		id: "11",
		title: "Every item 5 and below",
		class: "five-below",
		codeBrief: `:nth-child(-n + 5)`,
		code: `.grid-item:nth-child(-n + 5) {
  opacity: 1;
}`
	},
	{
		id: "12",
		title: "Range 4-7",
		class: "range-4-7",
		codeBrief: `:nth-child(n + 4):nth-child(-n + 7)`,
		code: `.grid-item:nth-child(n + 4):nth-child(-n + 7) {
  opacity: 1;
}`
	},
	{
		id: "13",
		title: "Range 53-58",
		class: "range-53-58",
		codeBrief: `:nth-child(n + 53):nth-child(-n + 58)`,
		code: `.grid-item:nth-child(n + 53):nth-child(-n + 58) {
  opacity: 1;
}`
	},
	{
		id: "14",
		title: "Fifth from the end",
		class: "fifth-from-end",
		codeBrief: `:nth-last-child(5)`,
		code: `.grid-item:nth-last-child(5) {
  opacity: 1;
}`
	},
	{
		id: "15",
		title: "Every third from the end",
		class: "thirds-from-end",
		codeBrief: `:nth-last-child(3n)`,
		code: `.grid-item:nth-last-child(3n) {
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
			<pre><code>{props.codeBrief}</code></pre>
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
			</main>
		</>
	);
}
