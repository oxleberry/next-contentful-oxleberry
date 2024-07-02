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
	constructor(x, y, stripePosX, directionY) {
			this.x = x,
			this.y = y,
			this.width = 18,
			this.height = 100,
			this.stripeWidth = 4,
			this.stripePosX = stripePosX,
			this.speed = 8,
			this.directionY = directionY,
			this.paddleHit = false
	}

	drawPaddle(p5) {
		// paddle
		p5.noStroke();
		p5.fill (255);
		p5.rect(this.x, this.y, this.width, this.height);
		// paddle stripe
		if (this.paddleHit === true) {
			p5.fill(255, 211, 198); // light red
			this.stripeWidth = 6;
			this.paddleHit = false;
		} else {
			p5.fill(204, 49, 2); // red
			this.stripeWidth = 4;
		}
		p5.rect(this.stripePosX, this.y, this.stripeWidth, this.height);
	}

	movePaddle(p5, gameBoardHeight, gameBoardStroke) {
		this.y += this.directionY;
		let topBoundary = gameBoardStroke / 2 + this.height / 2;
		let bottomBoundary = gameBoardHeight - gameBoardStroke / 2 - this.height / 2;
		// constrain = target, top, bottom
		this.y = p5.constrain (this.y, topBoundary, bottomBoundary);
	}

	updatePaddleDirection(direction) {
		this.directionY = direction;
	}
}


class GhostPong extends React.Component {
	constructor() {
		super();

		// Variables =================
		const ghostSize = 50;
		this.gameBoard = {
			width: (ghostSize * 17 - ghostSize / 2), // theory - board cannot be exact multiple of ghost size, else ghost can get stuck in sides
			height: (ghostSize * 11 - ghostSize / 2), // theory - baord cannot be exact multiple of ghost size, else ghost can get stuck in sides
			stroke: 6,
		}
		this.ghost = {
			image: null,
			size: ghostSize,
			x: this.gameBoard.width / 2,
			y: this.gameBoard.height / 2,
			speed: 2,
			directionX: 2,
			directionY: 2,
		}
		this.paddle = {
			x: 30, // distance paddle is from edge of game board
			width: new Paddle().width, // used for setting stripe placement
			speed: new Paddle().speed, // used for changing directions
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
		this.ghost.x = this.ghost.x + this.ghost.directionX;
		this.ghost.y = this.ghost.y + this.ghost.directionY;
	}

	changeVerticalDirection() {
		this.ghost.directionY *= -1;
	}

	changeHorizontalDirection() {
		this.ghost.directionX *= -1;
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
		const movingLeftToRight = this.ghost.directionX === this.ghost.speed;
		const movingRightToLeft = this.ghost.directionX === (-1 * this.ghost.speed);
		const movingUpToDowm = this.ghost.directionY === this.ghost.speed;
		const movingDownToUp = this.ghost.directionY === (-1 * this.ghost.speed);

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


	// Game play functions
	checkPaddle(paddle) {
		// console.log('===================================');

		let ghostCenterX = this.ghost.x;
		let ghostCenterY = this.ghost.y;
		let paddleRightEdge = paddle.x + paddle.width / 2 + this.ghost.size / 3;
		let paddleLeftEdge = paddle.x - paddle.width / 2 - this.ghost.size / 3;
		let paddleTop = paddle.y - paddle.height / 2;
		let paddleBottom = paddle.y + paddle.height / 2;
		// when center of ghost hits edge of paddles (paddles factor in ghost size)
		if (ghostCenterX >= paddleLeftEdge && // ghost is past left edge of paddle
		ghostCenterX <= paddleRightEdge && // ghost is past right edge of paddle
		ghostCenterY >= paddleTop && // ghost is below paddle top
		ghostCenterY <= paddleBottom) { // ghost is above paddle bottom
		
			// console.log('paddle', paddle.x);
			// console.log('paddleRightEdge', paddleRightEdge);
			// console.log('paddleLeftEdge', paddleLeftEdge);
			// console.log('ghostX', this.ghost.x);
			// console.log('ghostY', this.ghost.y);
			// console.log('paddleY', paddle.y);
			// console.log('paddleTop', paddleTop);
			// console.log('paddleBottom', paddleBottom);
			// console.log('this.gameBoard.height', this.gameBoard.height);
			// console.log('HIT');

			paddle.paddleHit = true;
		}
	}


	// Keyboard event listener =================
	// move paddle up and down
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

	// stop paddles from moving
	keyReleased = (p5, event) => {
		if (p5.keyCode === 186 || p5.keyCode === 190) { // keycode = ; or .
			this.right.updatePaddleDirection(0);
		} else if  (p5.keyCode === 83 || p5.keyCode === 88) { // keycode = s or x
			this.left.updatePaddleDirection(0);
		}
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

		this.checkPaddle(this.left);
		this.checkPaddle(this.right);
		this.left.drawPaddle(p5);
		this.right.drawPaddle(p5);
		this.left.movePaddle(p5, this.gameBoard.height, this.gameBoard.stroke);
		this.right.movePaddle(p5, this.gameBoard.height, this.gameBoard.stroke);

		this.moveGhost();
		this.checkEdges(p5);
		this.drawGhost(p5);
		this.drawGameBoardBorder(p5);
		// p5.noLoop();
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