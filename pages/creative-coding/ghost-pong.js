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
	constructor(name, x, y, stripePosX, directionY) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = 18;
		this.height = 100;
		this.stripeWidth = 4;
		this.stripePosX = stripePosX;
		this.speed = 8;
		this.speedY = directionY;
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
		this.y += this.speedY;
		let topBoundary = gameBoardStroke / 2 + this.height / 2;
		let bottomBoundary = gameBoardHeight - gameBoardStroke / 2 - this.height / 2;
		// constrain = target, top, bottom
		this.y = p5.constrain (this.y, topBoundary, bottomBoundary);
	}

	updatePaddleDirection(direction) {
		this.speedY = direction;
	}
}


// GHOST PUCK =====================
class GhostPuck {
	constructor (x, y) {
		this.image = null;
		this.size = 50;
		this.x = x;
		this.y = y;
		this.speedX = 2; // positive value moves right, negative value moves left
		this.speedY = 2; // positive value moves down, negative value moves up
		this.incrementSpeed = 2;
	}

	drawGhost(p5) {
		if (this.image) {
			p5.image(this.image, this.x, this.y, this.size, this.size);
		}
	}

	moveGhost() {
		this.x = this.x + this.speedX;
		this.y = this.y + this.speedY;
	}

	changeHorizontalDirection() {
		this.speedX *= -1; // positive value moves down, negative value moves up
	}

	changeVerticalDirection() {
		this.speedY *= -1; // positive value moves right, negative value moves left
	}

	increaseSpeed() {
		if (this.speedX >= 0) {
			this.speedX += this.incrementSpeed;
		} else {
			this.speedX -= this.incrementSpeed;
		}
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
	// check and update if the ghost puck hits top or bottom sides of the gameboard
	checkEdges (ghost, gameBoard) {
		const topEdge = ghost.y <= 0 + ghost.size/2 + gameBoard.stroke;
		const bottomEdge = ghost.y >= gameBoard.height - ghost.size/2 - gameBoard.stroke;
		if (topEdge || bottomEdge) {
			ghost.changeVerticalDirection();
			this.getGhostImage(ghost);
		}
	}

	checkPaddle(p5, paddle, ghost) {
		// console.log('===================================');
		let ghostEdgeCheck;
		let ghostSpanCheck; // distance that the ghost moves at = (ghost.speedX)

		const ghostLeftEdge = ghost.x - (ghost.size / 2);
		const ghostRightEdge = ghost.x + (ghost.size / 2);
		const ghostCenterY = ghost.y;
		const ghostTop = ghost.y - (ghost.size / 3);
		const ghostBottom = ghost.y + (ghost.size / 3);
		const paddleCenterX = paddle.x;
		const paddleTop = paddle.y - (paddle.height) / 2 - (ghost.size / 3);
		const paddleBottom = paddle.y + (paddle.height) / 2 + (ghost.size / 3);

		// find where on the ghost to check based on which paddle is being used
		if (paddle.name === 'right') {
			ghostEdgeCheck = ghostRightEdge >= paddleCenterX;
			ghostSpanCheck = ghostRightEdge <= paddleCenterX + ghost.speedX;
		} else if (paddle.name === 'left') {
			ghostEdgeCheck = ghostLeftEdge <= paddleCenterX;
			ghostSpanCheck = ghostLeftEdge >= paddleCenterX - (-ghost.speedX);
		}

		// checks when ghost hits the paddle target
		if (ghostEdgeCheck && // edge of ghost is past center of paddle
				ghostSpanCheck && // and within 1 unit of a ghost's movement
				ghostBottom >= paddleTop && // and that bottom of ghost is above paddle top
				ghostTop <= paddleBottom) { // and that top of ghost is below paddle bottom

			// p5.map = re-maps a number from one range to another
			// maps the yAngle based on where the ghost hits the paddle
			let yAngle = p5.map (ghostCenterY, paddleTop, paddleBottom, -5, 5);
			ghost.speedY = yAngle;

			ghost.increaseSpeed();
			ghost.changeHorizontalDirection();
			this.getGhostImage(ghost);
			paddle.paddleHit = true;
		}
	}

	getGhostImage(ghost) {
		const movingLeft = ghost.speedX < 0;
		const movingRight = ghost.speedX >= 0;
		const movingUp = ghost.speedY < 0;
		const movingDown = ghost.speedY >= 0;
		if (movingLeft && movingUp) {
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (movingLeft && movingDown) {
			ghost.updateGhostImage(this.ghostLeftDown);
		} else if (movingRight && movingUp) {
			ghost.updateGhostImage(this.ghostRightUp);
		} else if (movingRight && movingDown) {
			ghost.updateGhostImage(this.ghostRightDown);
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
		this.gameBoard = new GameBoard(600, 400); // desktop
		// this.gameBoard = new GameBoard(400, 280); // mobile
		// p5 CANVAS
		p5.createCanvas(this.gameBoard.width, this.gameBoard.height).parent(canvasParentRef);
		p5.frameRate(30);
		p5.background(0); // black
		p5.angleMode(p5.DEGREES);
		p5.rectMode(p5.CENTER);
		p5.imageMode(p5.CENTER);
		// Ghost Images
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-right-up.png", img => {
			this.ghostRightUp = img;
		});
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-right-down.png", img => {
			this.ghostRightDown = img;
			this.ghost.image = this.ghostRightDown; // starting ghost image
		});
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-left-up.png", img => {
			this.ghostLeftUp = img;
		});
		p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-left-down.png", img => {
			this.ghostLeftDown = img;
		});
		// Create Ghost = x, y
		this.ghost = new GhostPuck(
			this.gameBoard.width / 2,
			this.gameBoard.height / 2
		);
		// Create Paddles = name, x, y, stripePosX, directionY
		this.left = new Paddle(
			'left',
			this.paddle.distanceFromEdge,
			this.gameBoard.height / 2,
			this.paddle.distanceFromEdge + this.paddle.width / 2,
			this.paddle.startSpeed
		);
		this.right = new Paddle(
			'right',
			this.gameBoard.width - this.paddle.distanceFromEdge,
			this.gameBoard.height / 2,
			this.gameBoard.width - this.paddle.distanceFromEdge - this.paddle.width / 2,
			this.paddle.startSpeed
		);
	}

	draw = p5 => {
		this.gameBoard.drawGameBoardBg(p5);
		// update paddles
		this.checkPaddle(p5, this.left, this.ghost);
		this.checkPaddle(p5, this.right, this.ghost);
		this.left.movePaddle(p5, this.gameBoard.height, this.gameBoard.stroke);
		this.right.movePaddle(p5, this.gameBoard.height, this.gameBoard.stroke);
		this.left.drawPaddle(p5);
		this.right.drawPaddle(p5);
		// update ghost
		this.checkEdges(this.ghost, this.gameBoard);
		this.ghost.moveGhost();
		this.ghost.drawGhost(p5);
		// draw game boarder
		this.gameBoard.drawGameBoardBorder(p5);
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
