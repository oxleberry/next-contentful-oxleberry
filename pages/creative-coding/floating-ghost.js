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


// GHOST PUCK =====================
class Ghost {
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
class FloatingGhost extends React.Component {
	constructor() {
		super();

		// Global Variables =================
		this.ghostSize = new Ghost().size;
	}


	// Game Play functions =================
	// check and update if the ghost puck hits any sides of the gameboard
	checkEdges (ghost, gameBoard) {
		const topEdge = ghost.y < 0 + ghost.size/2 + gameBoard.stroke;
		const bottomEdge = ghost.y > gameBoard.height - ghost.size/2 - gameBoard.stroke;
		const leftEdge = ghost.x < 0 + ghost.size/2 + gameBoard.stroke;
		const rightEdge = ghost.x > gameBoard.width - ghost.size/2 - gameBoard.stroke;
		const movingUp = ghost.speedY < 0;
		const movingDown = ghost.speedY > 0;
		const movingLeft = ghost.speedX < 0;
		const movingRight = ghost.speedX > 0;
		if (topEdge && movingLeft) {
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostLeftDown);
		} else if (topEdge && movingRight) {
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostRightDown);
		} else if (bottomEdge && movingLeft) {
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (bottomEdge && movingRight) {
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostRightUp);
		} else if (leftEdge && movingUp) {
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostRightUp);
		} else if (leftEdge && movingDown) {
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostRightDown);
		} else if (rightEdge && movingUp) {
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (rightEdge && movingDown) {
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostLeftDown);
		}
	}

	// p5 Drawing Library functions =================
	setup = (p5, canvasParentRef) => {
    // Create GameBoard = width, height
		this.gameBoard = new GameBoard(800, 550); // desktop
		// this.gameBoard = new GameBoard(380, 280); // mobile
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
		this.ghost = new Ghost(
			this.gameBoard.width / 2,
			this.gameBoard.height / 2
		);
	}

	draw = p5 => {
		this.gameBoard.drawGameBoardBg(p5);
		this.ghost.moveGhost();
		this.checkEdges(this.ghost, this.gameBoard);
		this.ghost.drawGhost(p5);
		this.gameBoard.drawGameBoardBorder(p5);
	}


	render() {
		return (
			<>
				<Head>
					<title>Oxleberry | Ghost Pong</title>
					<meta name="description" content="Oxleberry Floating Ghost" />
				</Head>
				<main className="full-backboard ghost-pong-page">
					<Header headline="Floating Ghost" isSubPage={true}></Header>

					{/* Floating Ghost */}
					<Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed} keyReleased={this.keyReleased} />
				</main>
			</>
		);
	}
}

export default FloatingGhost;
