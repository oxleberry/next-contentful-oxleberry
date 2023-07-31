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
	// Variables =================
	const unitSize = 20
	const canvasSize = 17 * unitSize;  // number needs to be divisible by the unit size
	let snakeX = unitSize;
	let snakeY = unitSize;
	let directionX = 1; // positive (1) moves right, negative (-1) moves left, (0) does not move on x-axis
	let directionY = 0; // positive (1) moves down, negative (-1) moves up, (0) does not move on y-axis
	let foodX = unitSize * 8;
	let foodY = unitSize * 8;


	// Game Functions =================
	function drawGameBoard(p5) {
		p5.background(220); // lt grey
		p5.stroke(144, 186, 204); // blue
		p5.strokeWeight(4);
		p5.fill(30); // soft black
		p5.rect((unitSize - 2), (unitSize - 2), (p5.width - unitSize * 2) + 4, (p5.height - unitSize * 2) + 4);
		// p5.noStroke();
	}


	// checks if snake is at food location
	function eatFood(p5) {
		// console.log('snakeX, snakeY', snakeX, snakeY);
		// dist: calcualates the distance between 2 points
		let distance = p5.dist(snakeX, snakeY, foodX, foodY);
		if (distance < 10) {
			console.log('EAT');
		} else{
			console.log('Not at apple position');
		}
	}

	// update snake position
	function updateSnake(p5) {
		// SNAKES HEAD
		// movement of head by 1 unit to the next position
		snakeX = snakeX + directionX * unitSize;
		snakeY = snakeY + directionY * unitSize;
		// constrains the position so the snake cannot go out of the game board
		snakeX = p5.constrain(snakeX, 0 + unitSize, p5.width - unitSize * 2);
		snakeY = p5.constrain(snakeY, 0 + unitSize, p5.height - unitSize * 2);
	}

	function drawSnake(p5) {
		// draws the Snake head
		p5.stroke(152, 168, 102);
		p5.fill(211, 229, 165);
		p5.rect(snakeX, snakeY, unitSize, unitSize);
	}

	// draws the food at location
	function drawFood(p5) {
		p5.strokeWeight(2);
		p5.stroke(163, 56, 37);
		p5.fill(209, 82, 60);
		p5.rect (foodX, foodY, unitSize, unitSize);
	}

	function updateDirection(x, y) {
		directionX = x;
		directionY = y;
	}

	// Keyboard eventlistener
	function keyPressed(p5, event) {
		if (p5.keyCode === 87 || p5.keyCode === 38 || p5.keyCode === 73) { // W or UP ARROW or I
			updateDirection(0, -1);
		} else if (p5.keyCode === 83 || p5.keyCode === 40 || p5.keyCode === 75) { // S or DOWN ARROW or K
			updateDirection(0, 1);
		} else if (p5.keyCode === 68 || p5.keyCode === 39 || p5.keyCode === 76) { // D or RIGHT ARROW or J
			updateDirection(1, 0);
		} else if (p5.keyCode === 65 || p5.keyCode === 37 || p5.keyCode === 74) { // A or LEFT ARROW or L
			updateDirection(-1, 0);
		}
	}


	// p5 Functions
	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(canvasSize, canvasSize).parent(canvasParentRef);
		p5.frameRate(8);
		drawGameBoard(p5);
		drawSnake(p5);
	}

	const draw = p5 => {
		drawGameBoard(p5);
		eatFood(p5)
		drawFood(p5);
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
				<Sketch setup={setup} draw={draw} keyPressed={keyPressed} />
			</main>
		</>
	);
}
