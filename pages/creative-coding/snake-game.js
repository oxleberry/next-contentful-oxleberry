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
	let snakePos = {
		x: unitSize,
		y: unitSize,
	};
	let snakeTailPos = []; // tracks each tail segment with {x, y} position
	let direction = {
		x: 1, // positive (1) moves right, negative (-1) moves left, (0) does not move on x-axis
		y: 0, // positive (1) moves down, negative (-1) moves up, (0) does not move on y-axis
	};
	let foodPos = {
		x: unitSize * 8,
		y: unitSize * 8
	};


	// Game Functions =================
	function drawGameBoard(p5) {
		p5.background(220); // lt grey
		p5.stroke(144, 186, 204); // blue
		p5.strokeWeight(4);
		p5.fill(30); // soft black
		p5.rect((unitSize - 2), (unitSize - 2), (p5.width - unitSize * 2) + 4, (p5.height - unitSize * 2) + 4);
	}

	function drawSnake(p5) {
		// draws the snake tail
		p5.fill(211, 229, 165);
		for (let i = 0; i < snakeTailPos.length; i++) {
			p5.strokeWeight(2);
			p5.stroke(152, 168, 102);
			let posX = snakeTailPos[i].x;
			let posY = snakeTailPos[i].y;
			p5.rect(posX, posY, unitSize, unitSize);
		};
		// draws the snake head
		p5.stroke(152, 168, 102);
		p5.fill(211, 229, 165);
		p5.rect(snakePos.x, snakePos.y, unitSize, unitSize);
	}

	function drawFood(p5) {
		p5.strokeWeight(2);
		p5.stroke(163, 56, 37);
		p5.fill(209, 82, 60);
		p5.rect (foodPos.x, foodPos.y, unitSize, unitSize);
	}

	// update snake head position
	// returns object = {x: 20, y: 20};
	function moveSnakeHead(p5) {
		// movement of head by 1 unit to the next position
		let x = snakePos.x + direction.x * unitSize;
		let y = snakePos.y + direction.y * unitSize;
		// constrains the position so the snake cannot go out of the game board
		x = p5.constrain(x, 0 + unitSize, p5.width - unitSize * 2);
		y = p5.constrain(y, 0 + unitSize, p5.height - unitSize * 2);
		return {x, y};
	}

	// return array of objects = [{x: 40, y: 20}, {x: 20, y: 20}]
	function increaseSnakeTail() {
		let snakeTail = snakeTailPos;
		snakeTail.push({ x: snakePos.x, y: snakePos.y });
		return snakeTail;
	}

	// update snake tail position in array tracker
	// returns array of objects = [{x: 60, y: 20}, {x: 40, y: 20}, {x: 20, y: 20}]
	function moveSnakeTail() {
		let snakeTail = snakeTailPos;
		snakeTail.unshift({ x: snakePos.x, y: snakePos.y }); // adds the latest {x, y} position to the front of the snake's tail array tracker
		return snakeTail;
	}

	// checks if snake is at food location
	// returns boolean
	function checkSnakeAtFoodLocation(p5) {
		// dist: calcualates the distance between 2 points
		let distance = p5.dist(snakePos.x, snakePos.y, foodPos.x, foodPos.y);
		if (distance < 10) {
			return true;
		} else {
			return false;
		}
	}

	// generates a random location on the game board
	// returns object = {x: 100, y: 160};
	function randomLocation(p5) {
		let x = p5.floor(p5.random((p5.width / unitSize) - 2)) * unitSize;
		let y = p5.floor(p5.random((p5.height / unitSize) - 2)) * unitSize;
		x = p5.constrain(x, 0 + unitSize, p5.width - unitSize * 2);
		y = p5.constrain(y, 0 + unitSize, p5.height - unitSize * 2);
		return {x, y};
	}

	// checks if snake has collided with itself or a wall
	// returns boolean
	function checkSnakeDies(p5) {
		// loops through the tail segments to see if
		// the head position matches any of tail segemnts
		let headX = snakePos.x;
		let headY = snakePos.y;
		for (let i = 0; i < snakeTailPos.length; i++) {
			let tailX = snakeTailPos[i].x;
			let tailY = snakeTailPos[i].y;
			if (headX === tailX && headY === tailY) {
				return true;
			}
		}
		return false;
	}


	// Keyboard eventlistener =================
	function keyPressed(p5, event) {
		// x = positive (1) moves right, negative (-1) moves left, (0) does not move on x-axis
		// y = positive (1) moves down, negative (-1) moves up, (0) does not move on y-axis
		if (p5.keyCode === 87 || p5.keyCode === 38 || p5.keyCode === 73) { // W or UP ARROW or I
			direction = { x: 0, y: -1 };
		} else if (p5.keyCode === 83 || p5.keyCode === 40 || p5.keyCode === 75) { // S or DOWN ARROW or K
			direction = { x: 0, y: 1 };
		} else if (p5.keyCode === 68 || p5.keyCode === 39 || p5.keyCode === 76) { // D or RIGHT ARROW or J
			direction = { x: 1, y: 0 };
		} else if (p5.keyCode === 65 || p5.keyCode === 37 || p5.keyCode === 74) { // A or LEFT ARROW or L
			direction = { x: -1, y: 0 };
		}
	}


	// p5 Functions =================
	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(canvasSize, canvasSize).parent(canvasParentRef);
		p5.frameRate(8);
		drawGameBoard(p5);
		drawSnake(p5);
		drawFood(p5);
	}

	const draw = p5 => {
		drawGameBoard(p5);

		const eatFood = checkSnakeAtFoodLocation(p5);
		if (eatFood) {
			increaseSnakeTail();
			foodPos = randomLocation(p5);
		}
		drawFood(p5);

		snakeTailPos = moveSnakeTail();
		snakePos = moveSnakeHead(p5);
		const gameover = checkSnakeDies(p5);
		if (gameover) {
			snakeTailPos = [];
		} else {
			snakeTailPos.pop(); // removes the last segment from the snake tail
		}

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
