import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
		<div>
			<Head>
				<title>Oxleberry | Home</title>
				<meta name="description" content="The works of creative coder Sharon Paz."/>
			</Head>
			<main className={styles.container}>
				<h1>Coding Project Highlights</h1>
			</main>
		</div>
  )
}
