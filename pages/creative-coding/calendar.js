import Head from 'next/head'
import Header from '../../components/Header'

export default function calendar() {
	return (
		<>
			<Head>
				<title>Oxleberry | Calendar</title>
				<meta name="description" content="Calendar app using local storage." />
			</Head>
			<main className="full-backboard calendar-page">
				<Header headline="Calendar" isSubPage={true}></Header>
				<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore beatae magnam cum quis! Reprehenderit officiis aliquam sed quas dicta eos quisquam consequatur cumque iure? Officiis nobis in excepturi quam natus?</p>
			</main>
		</>
	);
}
