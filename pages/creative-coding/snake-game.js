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


class SnakeGame extends React.Component {
	constructor() {
		super();

		// Variables =================
		this.unitSize = 22;
		this.canvasSize = 17 * this.unitSize; // number needs to be divisible by the unit size
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

	drawFood(p5) {
		p5.strokeWeight(2);
		p5.stroke(163, 56, 37);
		p5.fill(209, 82, 60);
		p5.rect (this.foodPos.x, this.foodPos.y, this.unitSize, this.unitSize);
	}


	// p5 Drawing Library functions =================
	setup = (p5, canvasParentRef) => {
		p5.createCanvas(this.canvasSize, this.canvasSize).parent(canvasParentRef);
		p5.frameRate(8);
		this.drawGameBoard(p5);
		this.drawFood(p5);
	};

	draw = p5 => {
		this.drawGameBoard(p5);
		this.drawFood(p5);
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
					<p>Eat the red apple, but don&apos;t hit the sides. <br />Use keyboard arrows to move the snake.</p>

					{/* SNAKE GAME */}
					<Sketch setup={this.setup} draw={this.draw} />
				</main>
			</>
		);
	}
}

export default SnakeGame;
