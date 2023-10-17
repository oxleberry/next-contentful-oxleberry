import React from 'react';
import Head from 'next/head'
import Header from '../../components/Header'

// Will only import `react-p5` on client-side
// This is useful if a component relies on browser APIs like window.
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
	ssr: false,
})


class SnakeGame extends React.Component {
	constructor() {
		super();
		this.state = {
			direction: {
				x: 1, // positive (1) moves right, negative (-1) moves left, (0) does not move on x-axis
				y: 0, // positive (1) moves down, negative (-1) moves up, (0) does not move on y-axis
			}
		};


		// Variables =================
		this.unitSize = 22;
		this.canvasSize = 17 * this.unitSize; // number needs to be divisible by the unit size
		this.snakePos = {
			x: this.unitSize,
			y: this.unitSize,
		};
		this.foodPos = {
			x: this.unitSize * 8,
			y: this.unitSize * 8
		};
	}


	// Game Functions =================
	drawGameBoard(p5) {
		p5.background(220); // lt grey
		p5.stroke(144, 186, 204); // blue
		p5.strokeWeight(4);
		p5.fill(30); // soft black
		p5.rect((this.unitSize - 2), (this.unitSize - 2), (p5.width - this.unitSize * 2) + 4, (p5.height - this.unitSize * 2) + 4);
	}

	drawSnake(p5) {
		// draws the snake head
		p5.stroke(152, 168, 102);
		p5.fill(211, 229, 165);
		p5.rect(this.snakePos.x, this.snakePos.y, this.unitSize, this.unitSize);
	}

	drawFood(p5) {
		p5.strokeWeight(2);
		p5.stroke(163, 56, 37);
		p5.fill(209, 82, 60);
		p5.rect (this.foodPos.x, this.foodPos.y, this.unitSize, this.unitSize);
	}

	// update snake head position
	// returns object = {x: 20, y: 20};
	moveSnakeHead(p5) {
		// movement of head by 1 unit to the next position
		let x = this.snakePos.x + this.state.direction.x * this.unitSize;
		let y = this.snakePos.y + this.state.direction.y * this.unitSize;
		// constrains the position so the snake cannot go out of the game board
		x = p5.constrain(x, 0 + this.unitSize, p5.width - this.unitSize * 2);
		y = p5.constrain(y, 0 + this.unitSize, p5.height - this.unitSize * 2);
		return {x, y};
	}

	// checks if snake is at food location
	// returns boolean
	checkSnakeAtFoodLocation(p5) {
		// dist: calcualates the distance between 2 points
		let distance = p5.dist(this.snakePos.x, this.snakePos.y, this.foodPos.x, this.foodPos.y);
		if (distance < 10) {
			return true;
		} else {
			return false;
		}
	}

	updateDirection = (event, dir) => {
		const direction = event.target.id || dir;
		let x; // x = positive (1) moves right, negative (-1) moves left, (0) does not move on x-axis
		let y; // y = positive (1) moves down, negative (-1) moves up, (0) does not move on y-axis
		switch (direction) {
			case 'up':
				x = 0;
				y = -1;
				break;
			case 'down':
				x = 0;
				y = 1;
				break;
			case 'left':
				x = -1;
				y = 0;
				break;
			case 'right':
				x = 1;
				y = 0;
				break;
		}
		this.setState(prevState => ({
			...prevState,
			direction: {
				x: x,
				y: y
			}
		}));
	}

	// Keyboard event listener =================
	keyPressed = (p5, event) => {
		if (p5.keyCode === 87 || p5.keyCode === 38 || p5.keyCode === 73) { // W - UP ARROW - I
			this.updateDirection(event, "up");
		} else if (p5.keyCode === 83 || p5.keyCode === 40 || p5.keyCode === 75) { // S - DOWN ARROW - K
			this.updateDirection(event, "down");
		} else if (p5.keyCode === 65 || p5.keyCode === 37 || p5.keyCode === 74) { // A - LEFT ARROW - J
			this.updateDirection(event, "left");
		} else if (p5.keyCode === 68 || p5.keyCode === 39 || p5.keyCode === 76) { // D - RIGHT ARROW - L
			this.updateDirection(event, "right");
		}
	}


	// p5 Drawing Library functions =================
	setup = (p5, canvasParentRef) => {
		p5.createCanvas(this.canvasSize, this.canvasSize).parent(canvasParentRef);
		p5.frameRate(8);
		this.drawGameBoard(p5);
		this.drawSnake(p5);
		this.drawFood(p5);
	};

	draw = p5 => {
		this.drawGameBoard(p5);
		// when snake reaches food
		const eatFood = this.checkSnakeAtFoodLocation(p5);
		if (eatFood) {
			console.log('EAT');
		}
		this.drawFood(p5);
		// move snake
		this.snakePos = this.moveSnakeHead(p5);
		this.drawSnake(p5);
	};


	render() {
		return (
			<>
				<Head>
					<title>Oxleberry | Snake Game</title>
					<meta name="description" content="Oxleberry Snake Game - The classic Snake Game using p5.js" />
				</Head>
				<main className="full-backboard snake-game-page">
					<Header headline="Snake Game" isSubPage={true}></Header>
					<p>Eat the red apple, but don&apos;t hit the sides. <br />Use keyboard arrows to move the snake.</p>

					{/* SNAKE GAME */}
					<Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed}/>
				</main>
			</>
		);
	}
}

export default SnakeGame;
