import Head from 'next/head'
import Header from '../../components/Header'

export default function GhostPong() {
	return (
		<>
			<Head>
				<title>Oxleberry | Ghost Pong</title>
				<meta name="description" content="Oxleberry Ghost Pong - A variation of the classic Pong game." />
			</Head>
			<main className="full-backboard ghost-pong-page">
				<Header headline="Ghost Pong Game" isSubPage={true}></Header>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
				<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			</main>
		</>
	);
}
