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


// Helper functions =================
async function playAudio(audioElem) {
	try {
		await new Audio(audioElem).play();
	} catch (err) {
		// console.log('Audio Error', err);
	}
}


// Other Components =================
const Scoreboard = (props) => {
	return (
		<div className={`glass-button score-board ${props.id}`} id={props.id}>
			<p>{props.text}: {props.points} pts</p>
		</div>
	);
}

const Controls = (props) => {
	return (
		<div className="controls-container">
			<ControlButton arrow="up" onControlsClick={props.onControlsClick} />
			<ControlButton arrow="left" onControlsClick={props.onControlsClick} />
			<ControlButton arrow="right" onControlsClick={props.onControlsClick} />
			<ControlButton arrow="down" onControlsClick={props.onControlsClick} />
		</div>
	);
}

const ControlButton = (props) => {
	return (
		<button
			className={`glass-button control-button ${props.arrow}-arrow`}
			id={props.arrow}
			onClick={props.onControlsClick}>
			<svg width="50" height="50" viewBox="-50 -20 300 150">
				<polygon className="triangle"
					fill="#fff"
					stroke="#fff"
					strokeWidth="40"
					strokeLinejoin="round"
					points="100,0 0,100 200,100"
				/>
			</svg>
		</button>
	);
}

const KeyboardGuide = (props) => {
	return (
		<div className="keyboard-guide">
			<p className="label">{props.label} <br />Keyboard&nbsp;Keys:</p>
			<div className="row">
				<span className="arrow">&#8679;</span>
			</div>
			<div className="row">
				<button tabIndex="-1">{props.upKey}</button>
			</div>
			<div className="row">
				<span className="arrow">&#8678;&nbsp;</span>
				<button tabIndex="-1">{props.leftKey}</button>
				<button tabIndex="-1">{props.downKey}</button>
				<button tabIndex="-1">{props.rightKey}</button>
				<span className="arrow">&nbsp;&#8680;</span>
			</div>
			<div className="row">
				<span className="arrow">&#8681;</span>
			</div>
		</div>
	);
}


// Snake Game Component =================
class SnakeGame extends React.Component {
	constructor() {
		super();
		this.state = {
			direction: {
				x: 1, // positive (1) moves right, negative (-1) moves left, (0) does not move on x-axis
				y: 0, // positive (1) moves down, negative (-1) moves up, (0) does not move on y-axis
			},
			score: 0,
			highScore: 0,
			audioScore: 'https://www.kasandbox.org/programming-sounds/retro/laser2.mp3',
			audioLose: 'https://www.kasandbox.org/programming-sounds/retro/rumble.mp3'
		};

		// Variables =================
		this.unitSize = 22;
		this.canvasSize = 17 * this.unitSize; // number needs to be divisible by the unit size
		this.snakePos = {
			x: this.unitSize,
			y: this.unitSize,
		};
		this.snakeTailPos = []; // tracks each tail segment with {x, y} position
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
		// draws the snake tail
		p5.fill(211, 229, 165);
		for (let i = 0; i < this.snakeTailPos.length; i++) {
			p5.strokeWeight(2);
			p5.stroke(152, 168, 102);
			let posX = this.snakeTailPos[i].x;
			let posY = this.snakeTailPos[i].y;
			p5.rect(posX, posY, this.unitSize, this.unitSize);
		};
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

	// return array of objects = [{x: 40, y: 20}, {x: 20, y: 20}]
	increaseSnakeTail() {
		let snakeTail = this.snakeTailPos;
		snakeTail.push({ x: this.snakePos.x, y: this.snakePos.y });
		return snakeTail;
	}

	// update snake tail position in array tracker
	// returns array of objects = [{x: 60, y: 20}, {x: 40, y: 20}, {x: 20, y: 20}]
	moveSnakeTail() {
		let snakeTail = this.snakeTailPos;
		snakeTail.unshift({ x: this.snakePos.x, y: this.snakePos.y }); // adds the latest {x, y} position to the front of the snake's tail array tracker
		return snakeTail;
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

	// generates a random location on the game board
	// returns object = {x: 100, y: 160};
	randomLocation(p5) {
		let x = p5.floor(p5.random((p5.width / this.unitSize) - 2)) * this.unitSize;
		let y = p5.floor(p5.random((p5.height / this.unitSize) - 2)) * this.unitSize;
		x = p5.constrain(x, 0 + this.unitSize, p5.width - this.unitSize * 2);
		y = p5.constrain(y, 0 + this.unitSize, p5.height - this.unitSize * 2);
		return {x, y};
	}

	// checks if snake has collided with itself or a wall
	// returns boolean
	checkSnakeDies(p5) {
		// if snake is only one segment long, no need to check
		if (this.snakeTailPos.length < 2) {
			return false;
		}
		let headX = this.snakePos.x;
		let headY = this.snakePos.y;
		// loops through the tail segments to see if
		// the head position matches any of tail segemnts
		for (let i = 0; i < this.snakeTailPos.length; i++) {
			let tailX = this.snakeTailPos[i].x;
			let tailY = this.snakeTailPos[i].y;
			if (headX === tailX && headY === tailY) {
				return true;
			}
		}
		return false;
	}

	increaseScore() {
		let curScore = this.state.score;
		this.setState(prevState => ({
			...prevState,
			score: curScore + 100,
		}));
	}

	updateScoreBoard() {
		let curScore = this.state.score;
		let curHighScore = this.state.highScore;
		if (curScore > curHighScore) {
			this.setState(prevState => ({
				...prevState,
				highScore: curScore,
			}));
		}
		this.setState(prevState => ({
			...prevState,
			score: 0,
		}));
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
			this.increaseSnakeTail();
			this.foodPos = this.randomLocation(p5);
			this.increaseScore();
			playAudio(this.state.audioScore);
		}
		this.drawFood(p5);
		// move snake
		this.snakeTailPos = this.moveSnakeTail();
		this.snakePos = this.moveSnakeHead(p5);
		// when game is over
		const gameover = this.checkSnakeDies(p5);
		if (gameover) {
			this.updateScoreBoard();
			this.snakeTailPos = [];
			playAudio(this.state.audioLose);
		} else {
			this.snakeTailPos.pop(); // removes the last segment from the snake tail
		}
		// draw snake
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
					<p>Eat the red apple, but don&apos;t hit the sides.</p>
					<Scoreboard id="score-board" text="Score" points={this.state.score}/>
					<Scoreboard id="hi-Score" text="High" points={this.state.highScore}/>

					{/* SNAKE GAME */}
					<Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed}/>

					<div className="controls-section">
						<KeyboardGuide label="Left Handed" upKey="W" downKey="S" leftKey="A" rightKey="D" />
						<Controls onControlsClick={this.updateDirection}/>
						<KeyboardGuide label="Right Handed" upKey="I" downKey="K" leftKey="J" rightKey="L" />
					</div>
				</main>
			</>
		);
	}
}

export default SnakeGame;
