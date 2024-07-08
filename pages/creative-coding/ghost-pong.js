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


// GAME BOARD =====================
class GameBoard {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.stroke = 6;
	}

	drawGameBoardBg(p5) {
		p5.background(0); // black
		p5.stroke(30); // soft black
		p5.strokeWeight (4);
		p5.line (p5.width / 2, 0, p5.width / 2, p5.height);
	}

	drawGameBoardBorder(p5) {
		p5.noFill (0);
		p5.stroke (90); // grey
		p5.strokeWeight (this.stroke * 2);
		p5.rect(p5.width / 2, p5.height / 2, this.width, this.height);
	}
}


// PADDLE =====================
class Paddle {
	constructor(x, y, stripePosX, directionY) {
		this.x = x;
		this.y = y;
		this.width = 18;
		this.height = 100;
		this.stripeWidth = 4;
		this.stripePosX = stripePosX;
		this.speed = 8;
		this.directionY = directionY;
		this.paddleHit = false;
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


// GHOST PUCK =====================
class GhostPuck {
	constructor (image, x, y) {
		this.image = image;
		this.size = 50;
		this.x = x;
		this.y = y;
		this.speed = 2;
		this.directionX = 2;
		this.directionY = 2;
	}

	drawGhost(p5) {
		if (this.image) {
			p5.image(this.image, this.x, this.y, this.size, this.size);
		}
	}

	moveGhost() {
		this.x = this.x + this.directionX;
		this.y = this.y + this.directionY;
	}

	changeVerticalDirection() {
		this.directionY *= -1;
	}

	changeHorizontalDirection() {
		this.directionX *= -1;
	}

	updateGhostImage(img) {
		this.image = img;
	}
}


// GAME PLAY =====================
class GhostPong extends React.Component {
	constructor() {
		super();

		// Global Variables =================
		this.ghostSize = new GhostPuck().size;
		this.paddle = {
			distanceFromEdge: 30, // distance paddle is from edge of game board
			width: new Paddle().width, // used for setting stripe placement
			speed: new Paddle().speed, // used for changing directions
			startSpeed: 0
		}
	}


	// Game Play functions =================
	// check and update if the ghost puck hits any sides of the gameboard
	checkEdges (ghost, gameBoard) {
		const bottomEdge = ghost.y > gameBoard.height - ghost.size/2 - gameBoard.stroke;
		const topEdge = ghost.y < 0 + ghost.size/2 + gameBoard.stroke;
		const rightEdge = ghost.x > gameBoard.width - ghost.size/2 - gameBoard.stroke;
		const leftEdge = ghost.x < 0 + ghost.size/2 + gameBoard.stroke;
		const movingLeftToRight = ghost.directionX === ghost.speed;
		const movingRightToLeft = ghost.directionX === (-1 * ghost.speed);
		const movingUpToDowm = ghost.directionY === ghost.speed;
		const movingDownToUp = ghost.directionY === (-1 * ghost.speed);

		if (bottomEdge && movingLeftToRight){
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostRightUp);
		} else if (bottomEdge && movingRightToLeft){
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (topEdge && movingLeftToRight){
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostRightDown);
		} else if (topEdge && movingRightToLeft){
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostLeftDown);
		} else if (rightEdge && movingUpToDowm){
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostLeftDown);
		} else if (rightEdge && movingDownToUp){
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (leftEdge && movingUpToDowm){
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostRightDown);
		} else if (leftEdge && movingDownToUp){
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostRightUp);
		}
	}

	checkPaddle(paddle, ghost) {
		// console.log('===================================');
		let ghostCenterX = ghost.x;
		let ghostCenterY = ghost.y;
		let paddleRightEdge = paddle.x + paddle.width / 2 + ghost.size / 3;
		let paddleLeftEdge = paddle.x - paddle.width / 2 - ghost.size / 3;
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
			// console.log('ghostX', ghost.x);
			// console.log('ghostY', this.ghost.y);
			// console.log('paddleY', paddle.y);
			// console.log('paddleTop', paddleTop);
			// console.log('paddleBottom', paddleBottom);
			// console.log('this.gameBoard.height', this.gameBoard.height);
			// console.log('HIT');
			paddle.paddleHit = true;
		}
	}

	test() {
		console.log('===================================');
		console.log('this.gameBoard', this.gameBoard);
		console.log('this.left', this.left);
		console.log('this.right', this.right);
		console.log('this.ghost', this.ghost);
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
		// Create GameBoard = width, height
		// refactor settings
		this.gameBoard = new GameBoard(
			(this.ghostSize * 17 - this.ghostSize / 2), // theory - board cannot be exact multiple of ghost size, else ghost can get stuck in sides
			this.ghostSize * 11 - this.ghostSize / 2 // theory - board cannot be exact multiple of ghost size, else ghost can get stuck in sides
		);
		// p5 CANVAS
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
		// Create Ghost = image, x, y
		this.ghost = new GhostPuck(
			this.ghostRightUp,
			this.gameBoard.width / 2,
			this.gameBoard.height / 2
		);
		// Create Paddles = x, y, stripePosX, directionY
		this.left = new Paddle(
			this.paddle.distanceFromEdge,
			this.gameBoard.height / 2, 
			this.paddle.distanceFromEdge + this.paddle.width / 2,
			this.paddle.startSpeed
		);
		this.right = new Paddle(
			this.gameBoard.width - this.paddle.distanceFromEdge,
			this.gameBoard.height / 2,
			this.gameBoard.width - this.paddle.distanceFromEdge - this.paddle.width / 2,
			this.paddle.startSpeed
		);
	}

	draw = p5 => {
		this.gameBoard.drawGameBoardBg(p5);

		this.checkPaddle(this.left, this.ghost);
		this.checkPaddle(this.right, this.ghost);
		this.left.drawPaddle(p5);
		this.right.drawPaddle(p5);
		this.left.movePaddle(p5, this.gameBoard.height, this.gameBoard.stroke);
		this.right.movePaddle(p5, this.gameBoard.height, this.gameBoard.stroke);

		// this.test();
		this.ghost.moveGhost();
		this.checkEdges(this.ghost, this.gameBoard);
		this.ghost.drawGhost(p5);
		this.gameBoard.drawGameBoardBorder(p5);
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
