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


// PADDLE =====================
class Paddle {
	constructor(x, y, stripePosX, currentSpeedY) {
		this.paddle = {
			x: x,
			y: y,
			width: 18,
			height: 100,
			stripeWidth: 4,
			stripePosX: stripePosX,
			speed: 8,
			currentSpeedY: currentSpeedY
		}
	}

	drawPaddle(p5) {
		// paddle
		p5.noStroke();
		p5.fill (255);
		p5.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
		// paddle stripe
		p5.fill(204, 49, 2); // red
		p5.rect(this.paddle.stripePosX, this.paddle.y, this.paddle.stripeWidth, this.paddle.height);
	}

	movePaddle(p5, speed) {
		this.paddle.y += this.paddle.currentSpeedY;
	}

	updatePaddleDirection(speed) {
		this.paddle.currentSpeedY = speed;
	}
}


class GhostPong extends React.Component {
	constructor() {
		super();

		// Variables =================
		this.gameBoard = {
			width: 800,
			height: 480,
			stroke: 6,
		}
		this.ghost = {
			image: null,
			size: 50,
			x: this.gameBoard.width / 2,
			y: this.gameBoard.height / 2
		}
		this.speed = 2;
		this.direction = {
			x: this.speed,
			y: this.speed
		}
		this.paddle = {
			x: 30, // distance paddle is from edge of game board
			width: new Paddle().paddle.width, // used for setting stripe placement
			speed: new Paddle().paddle.speed, // used for changing directions
			startSpeed: 0
		}
	}

	drawGameBoardBg(p5) {
		p5.background(0); // black
		p5.stroke(30); // soft black
		p5.strokeWeight (4);
		p5.line (p5.width/2, 0, p5.width/2, p5.height);
	}

	drawGameBoardBorder(p5) {
		p5.noFill (0);
		p5.stroke (90); // grey
		p5.strokeWeight (this.gameBoard.stroke * 2);
		p5.rect(p5.width/2, p5.height/2, this.gameBoard.width, this.gameBoard.height);
	}

	drawGhost(p5) {
		if (this.ghost.image) {
			p5.image(this.ghost.image, this.ghost.x, this.ghost.y, this.ghost.size, this.ghost.size);
		}
	}

	// GHOST functions
	moveGhost() {
		this.ghost.x = this.ghost.x + this.direction.x;
		this.ghost.y = this.ghost.y + this.direction.y;
	}

	changeVerticalDirection() {
		this.direction.y *= -1;
	}

	changeHorizontalDirection() {
		this.direction.x *= -1;
	}

	updateGhostImage(img) {
		this.ghost.image = img;
	}

	// check and update if the ghost puck hits any sides of the gameboard
	checkEdges (p5) {
		const bottomEdge = this.ghost.y > p5.height - this.ghost.size/2 - this.gameBoard.stroke;
		const topEdge = this.ghost.y < 0 + this.ghost.size/2 + this.gameBoard.stroke;
		const rightEdge = this.ghost.x > p5.width - this.ghost.size/2 - this.gameBoard.stroke;
		const leftEdge = this.ghost.x < 0 + this.ghost.size/2 + this.gameBoard.stroke;
		const movingLeftToRight = this.direction.x === this.speed;
		const movingRightToLeft = this.direction.x === (-1 * this.speed);
		const movingUpToDowm = this.direction.y === this.speed;
		const movingDownToUp = this.direction.y === (-1 * this.speed);

		if (bottomEdge && movingLeftToRight){
			this.changeVerticalDirection();
			this.updateGhostImage(this.ghostRightUp);
		} else if (bottomEdge && movingRightToLeft){
			this.changeVerticalDirection();
			this.updateGhostImage(this.ghostLeftUp);
		} else if (topEdge && movingLeftToRight){
			this.changeVerticalDirection();
			this.updateGhostImage(this.ghostRightDown);
		} else if (topEdge && movingRightToLeft){
			this.changeVerticalDirection();
			this.updateGhostImage(this.ghostLeftDown);
		} else if (rightEdge && movingUpToDowm){
			this.changeHorizontalDirection();
			this.updateGhostImage(this.ghostLeftDown);
		} else if (rightEdge && movingDownToUp){
			this.changeHorizontalDirection();
			this.updateGhostImage(this.ghostLeftUp);
		} else if (leftEdge && movingUpToDowm){
			this.changeHorizontalDirection();
			this.updateGhostImage(this.ghostRightDown);
		} else if (leftEdge && movingDownToUp){
			this.changeHorizontalDirection();
			this.updateGhostImage(this.ghostRightUp);
		}
	}


	// Keyboard event listener =================
	keyPressed = (p5, event) => {
		if (p5.keyCode === 186) { // keycode = ;
			this.right.updatePaddleDirection( - this.paddle.speed);
		} else if (p5.keyCode === 190) { // keycode = .
			this.right.updatePaddleDirection(this.paddle.speed);
		} else if (p5.keyCode === 83) { // keycode = s
			this.left.updatePaddleDirection( - this.paddle.speed);
		} else if (p5.keyCode === 88) { // keycode = x
			this.left.updatePaddleDirection(this.paddle.speed);
		}
	}

	keyReleased = (p5, event) => {
		this.left.updatePaddleDirection(0);
		this.right.updatePaddleDirection(0);
	}


	// p5 Drawing Library functions =================
	setup = (p5, canvasParentRef) => {
		p5.createCanvas(this.gameBoard.width, this.gameBoard.height).parent(canvasParentRef);
		p5.frameRate(30);
		p5.background(0); // black
		p5.angleMode(p5.DEGREES);
		p5.rectMode(p5.CENTER);
		p5.imageMode(p5.CENTER);
		// Images
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-right-up.png", img => {
			this.ghostRightUp = img;
			this.ghost.image = this.ghostRightUp; // starting ghost image
		});
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-right-down.png", img => {
			this.ghostRightDown = img;
		});
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-left-up.png", img => {
			this.ghostLeftUp = img;
		});
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-left-down.png", img => {
			this.ghostLeftDown = img;
		});
		// Create Paddles = x, y, stripePosX
		this.left = new Paddle(
			this.paddle.x,
			this.gameBoard.height / 2, 
			this.paddle.x + this.paddle.width / 2,
			this.paddle.startSpeed);
		this.right = new Paddle(
			this.gameBoard.width - this.paddle.x,
			this.gameBoard.height / 2,
			this.gameBoard.width - this.paddle.x - this.paddle.width / 2,
			this.paddle.startSpeed);
	}

	draw = p5 => {
		this.drawGameBoardBg(p5);
		this.left.drawPaddle(p5);
		this.right.drawPaddle(p5);
		this.left.movePaddle(p5, this.paddle.startSpeed);
		this.right.movePaddle(p5, this.paddle.startSpeed);

		// this.moveGhost();
		this.checkEdges(p5);
		this.drawGhost(p5);
		this.drawGameBoardBorder(p5);
	}


	render() {
		return (
			<>
				<Head>
					<title>Oxleberry | Ghost Pong</title>
					<meta name="description" content="Oxleberry Ghost Pong - A variation of the classic Pong game." />
				</Head>
				<main className="full-backboard ghost-pong-page">
					<Header headline="Ghost Pong Game" isSubPage={true}></Header>

					{/* Ghost Pong Game */}
					<Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed} keyReleased={this.keyReleased} />
				</main>
			</>
		);
	}
}

export default GhostPong;
