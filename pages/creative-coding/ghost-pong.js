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
		this.canvasSizeWidth = 400;
		this.canvasSizeHeight = 280;
		this.gameBoardStrokeSize = 6;
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

		setup = (p5, canvasParentRef) => {
			p5.createCanvas(this.canvasSizeWidth, this.canvasSizeHeight).parent(canvasParentRef);
			p5.frameRate(30);
			p5.background(0); // black
			p5.angleMode(p5.DEGREES);
			p5.rectMode(p5.CENTER);
			p5.imageMode(p5.CENTER);
		}

		draw = p5 => {
			this.drawGameBoardBg(p5);
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
