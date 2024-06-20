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


class GhostPong extends React.Component {
	constructor() {
		super();

		// Variables =================
		this.gameBoard = {
			width: 800,
			height: 480,
			stroke: 6
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

	moveGhost() {
		this.ghost.x = this.ghost.x + this.direction.x;
		this.ghost.y = this.ghost.y + this.direction.y;
	}

	checkEdges (p5) {
		if (this.ghost.y > p5.height - this.ghost.size/2 - this.gameBoard.stroke // at the bottom edge
			&& this.direction.x === this.speed){ // ghost moving from left to right
			this.direction.y *= -1;
			this.ghost.image = this.ghostRightUp;
		} else if (this.ghost.y > p5.height - this.ghost.size/2 - this.gameBoard.stroke // at the bottom edge
			&& this.direction.x === (-1 * this.speed)){ // ghost moving from right to left
			this.direction.y *= -1;
			this.ghost.image = this.ghostLeftUp;
		} else if (this.ghost.y < 0 + this.ghost.size/2 + this.gameBoard.stroke // at the top edge
			&& this.direction.x === this.speed){ // ghost moving from left to right
			this.direction.y *= -1;
			this.ghost.image = this.ghostRightDown;
		} else if (this.ghost.y < 0 + this.ghost.size/2 + this.gameBoard.stroke// at the top edge
			&& this.direction.x === (-1 * this.speed)){ // ghost moving from right to left
			this.direction.y *= -1;
			this.ghost.image = this.ghostLeftDown;
		} else if (this.ghost.x > p5.width - this.ghost.size/2 - this.gameBoard.stroke // at the right edge
			&& this.direction.y === this.speed){ // ghost moving from up to down
			this.direction.x = this.direction.x * -1;
			this.ghost.image = this.ghostLeftDown;
		} else if (this.ghost.x > p5.width - this.ghost.size/2 - this.gameBoard.stroke // at the right edge
			&& this.direction.y === (-1 * this.speed)){ // ghost moving from down to up
			this.direction.x = this.direction.x * -1;
			this.ghost.image = this.ghostLeftUp;
		} else if (this.ghost.x < 0 + this.ghost.size/2 + this.gameBoard.stroke // at the left edge
			&& this.direction.y === this.speed){ // ghost moving from up to down
			this.direction.x = this.direction.x * -1;
			this.ghost.image = this.ghostRightDown;
		} else if (this.ghost.x < 0 + this.ghost.size/2 + this.gameBoard.stroke // at the left edge
			&& this.direction.y === (-1 * this.speed)){ // ghost moving from down to up
			this.direction.x = this.direction.x * -1;
			this.ghost.image = this.ghostRightUp;
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
	}

	draw = p5 => {
		this.drawGameBoardBg(p5);
		this.moveGhost();
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
					<Sketch setup={this.setup} draw={this.draw} />
				</main>
			</>
		);
	}
}

export default GhostPong;
