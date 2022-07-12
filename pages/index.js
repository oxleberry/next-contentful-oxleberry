import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

export default function Home() {
	return (
		<div>
			<Head>
				<title>Oxleberry | Home</title>
				<meta name="description" content="The works of creative coder Sharon Paz."/>
			</Head>
			<main className="page-backboard">
				<Header headline="Coding Project Highlights"></Header>
			</main>
		</div>
	)
}
