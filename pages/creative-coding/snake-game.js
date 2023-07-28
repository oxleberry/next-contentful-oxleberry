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
	const unitSize = 20
	const canvasSize = 17 * unitSize;  // number needs to be divisible by the unit size
	let snakeX = unitSize;
	let snakeY = unitSize;
	let xSpeed = 1;
	let ySpeed = 0;
	let foodX = unitSize * 8;
	let foodY = unitSize * 8;


	function drawGameBoard(p5) {
		p5.background(220); // lt grey
		p5.stroke(144, 186, 204); // blue
		p5.strokeWeight(4);
		p5.fill(30); // soft black
		p5.rect((unitSize - 2), (unitSize - 2), (p5.width - unitSize * 2) + 4, (p5.height - unitSize * 2) + 4);
		// p5.noStroke();
	}


	// update snake movement
	function updateSnake(p5) {
		// SNAKES HEAD
		// movement of head by 1 unit to the next position
		snakeX = snakeX + xSpeed * unitSize;
		snakeY = snakeY + ySpeed * unitSize;
		// constrains the head position so the snake cannot go out of the game board
		snakeX = p5.constrain(snakeX, 0 + unitSize, p5.width - unitSize * 2);
		snakeY = p5.constrain(snakeY, 0 + unitSize, p5.height - unitSize * 2);
	}

	function drawSnake(p5) {
		// draws the Snake Head
		p5.stroke(152, 168, 102);
		p5.fill(211, 229, 165);
		p5.rect(snakeX, snakeY, unitSize, unitSize);
	}

	// draws the food
	function foodLocation(p5) {
		p5.strokeWeight(2);
		p5.stroke(163, 56, 37);
		p5.fill(209, 82, 60);
		p5.rect (foodX, foodY, unitSize, unitSize);
	}


	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(canvasSize, canvasSize).parent(canvasParentRef);
		p5.frameRate(8);
		drawGameBoard(p5);
		drawSnake(p5);
	}

	const draw = p5 => {
		drawGameBoard(p5);
		foodLocation(p5);
		updateSnake(p5);
		drawSnake(p5);
	}


	return (
		<>
			<Head>
				<title>Oxleberry | Snake Game</title>
				<meta name="description" content="Oxleberry Snake Game - The Classic Snake Game using p5.js" />
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
