import Head from 'next/head'
import Header from '../../components/Header'

export default function ScreenprintDesigner() {
	return (
		<>
			<Head>
				<title>Oxleberry | Screenprint Designer</title>
				<meta name="description" content="Oxleberry Screenprint Designer - Mockup your design on a tee shirt" />
			</Head>
			<main className="full-backboard screenprint-designer-page">
				<Header headline="Screenprint Designer" isSubPage={true}></Header>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			</main>
		</>
	);
}
