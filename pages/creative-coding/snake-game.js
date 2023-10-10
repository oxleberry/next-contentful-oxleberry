import Head from 'next/head'
import Script from 'next/script' // for adding JS library
import Header from '../../components/Header'


export default function SnakeGame() {
	return (
		<>
			<Head>
				<title>Oxleberry | Snake Game</title>
				<meta name="description" content="Oxleberry Snake Game - the classic Snake Game using p5.js" />
			</Head>
			<Script src="https://cdn.jsdelivr.net/npm/react-p5@1.3.35/build/index.min.js" />
			<main className="full-backboard snake-game-page">
				<Header headline="Snake Game" isSubPage={true}></Header>
				<p>Eat the red apple, but don&apos;t hit the sides. <br />Use keyboard arrows to move the snake.</p>

				{/* SNAKE GAME */}
				<div id="snake-game-canvas"></div>
			</main>
		</>
	);
}
