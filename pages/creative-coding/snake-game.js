import Head from 'next/head'
import Header from '../../components/Header'

// Will only import `react-p5` on client-side
// This is useful if a component relies on browser APIs like window.
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
	ssr: false,
})


export default function SnakeGame() {
	const y = 50;
	let direction = '^';

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(500, 400).parent(canvasParentRef)
	}

	const draw = p5 => {
		p5.background(0);
		p5.ellipse(p5.width / 2, y, 70, 70);
		if (y > p5.height) direction = '';
		if (y < 0) {
			direction = '^';
		}
		if (direction === '^') y += 2;
		else y -= 1;
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Snake Game</title>
				<meta name="description" content="Oxleberry Snake Game - the classic Snake Game using p5.js" />
			</Head>
			<main className="full-backboard snake-game-page">
				<Header headline="Snake Game" isSubPage={true}></Header>
				<p>Eat the red apple, but don&apos;t hit the sides. <br />Use keyboard arrows to move the snake.</p>

				{/* SNAKE GAME */}
				<Sketch setup={setup} draw={draw} />
			</main>
		</>
	);
}
