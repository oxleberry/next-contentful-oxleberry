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
			if (this.ghostRightUp) {
				p5.image(this.ghostRightUp, this.ghostXPos, this.ghostYPos, this.ghostSize, this.ghostSize);
			}
		}

		moveGhost() {
			this.ghostXPos = this.ghostXPos + this.xSpeed;
			this.ghostYPos = this.ghostYPos + this.ySpeed;
		}

		// p5 Drawing Library functions =================
		setup = (p5, canvasParentRef) => {
			p5.createCanvas(this.canvasSizeWidth, this.canvasSizeHeight).parent(canvasParentRef);
			p5.frameRate(30);
			p5.background(0); // black
			p5.angleMode(p5.DEGREES);
			p5.rectMode(p5.CENTER);
			p5.imageMode(p5.CENTER);

			p5.loadImage("/creative-coding-pages/ghost-pong/images/ghost-right-up.png", img => {
				this.ghostRightUp = img;
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
