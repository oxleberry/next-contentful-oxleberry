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


// export default function GhostPong() {
class GhostPong extends React.Component {
	constructor() {
		super();

		// Variables =================
		this.canvasSizeWidth = 800;
		this.canvasSizeHeight = 480;
		this.gameBoardStrokeSize = 6;
		this.currentGhost;
		this.ghostSize = 50;
		this.ghostXPos = this.canvasSizeWidth / 2;
		this.ghostYPos = this.canvasSizeHeight / 2;
		this.xSpeed = 2;
		this.ySpeed = 2;
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
			p5.strokeWeight (this.gameBoardStrokeSize * 2);
			p5.rect(p5.width/2, p5.height/2, this.canvasSizeWidth, this.canvasSizeHeight);
		}

		drawGhost(p5) {
			if (this.currentGhost) {
				p5.image(this.currentGhost, this.ghostXPos, this.ghostYPos, this.ghostSize, this.ghostSize);
			}
		}

		moveGhost() {
			this.ghostXPos = this.ghostXPos + this.xSpeed;
			this.ghostYPos = this.ghostYPos + this.ySpeed;
		}

		checkEdges (p5) {
			if (this.ghostYPos > p5.height - this.ghostSize/2 - this.gameBoardStrokeSize // at the bottom edge
				&& this.xSpeed === 2){ // ghost moving from left to right
				this.ySpeed *= -1;
				this.currentGhost = this.ghostRightUp;
			} else if (this.ghostYPos > p5.height - this.ghostSize/2 - this.gameBoardStrokeSize // at the bottom edge
				&& this.xSpeed === -2){ // ghost moving from right to left
				this.ySpeed *= -1;
				this.currentGhost = this.ghostLeftUp;
			} else if (this.ghostYPos < 0 + this.ghostSize/2 + this.gameBoardStrokeSize // at the top edge
				&& this.xSpeed === 2){ // ghost moving from left to right
				this.ySpeed *= -1;
				this.currentGhost = this.ghostRightDown;
			} else if (this.ghostYPos < 0 + this.ghostSize/2 + this.gameBoardStrokeSize// at the top edge
				&& this.xSpeed === -2){ // ghost moving from right to left
				this.ySpeed *= -1;
				this.currentGhost = this.ghostLeftDown;
			} else if (this.ghostXPos > p5.width - this.ghostSize/2 - this.gameBoardStrokeSize // at the right edge
				&& this.ySpeed === 2){ // ghost moving from up to down
				this.xSpeed = this.xSpeed * -1;
				this.currentGhost = this.ghostLeftDown;
			} else if (this.ghostXPos > p5.width - this.ghostSize/2 - this.gameBoardStrokeSize // at the right edge
				&& this.ySpeed === -2){ // ghost moving from down to up
				this.xSpeed = this.xSpeed * -1;
				this.currentGhost = this.ghostLeftUp;
			} else if (this.ghostXPos < 0 + this.ghostSize/2 + this.gameBoardStrokeSize // at the left edge
				&& this.ySpeed === 2){ // ghost moving from up to down
				this.xSpeed = this.xSpeed * -1;
				this.currentGhost = this.ghostRightDown;
			} else if (this.ghostXPos < 0 + this.ghostSize/2 + this.gameBoardStrokeSize // at the left edge
				&& this.ySpeed === -2){ // ghost moving from down to up
				this.xSpeed = this.xSpeed * -1;
				this.currentGhost = this.ghostRightUp;
			}
		}

		// p5 Drawing Library functions =================
		setup = (p5, canvasParentRef) => {
			p5.createCanvas(this.canvasSizeWidth, this.canvasSizeHeight).parent(canvasParentRef);
			p5.frameRate(30);
			p5.background(0); // black
			p5.angleMode(p5.DEGREES);
			p5.rectMode(p5.CENTER);
			p5.imageMode(p5.CENTER);
			// Images
			p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-right-up.png", img => {
				this.ghostRightUp = img;
				this.currentGhost = this.ghostRightUp; // starting ghost image
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
