import React from 'react';
import Head from 'next/head'
import Header from '../../components/Header'

import { createClient } from 'contentful'

// Will only import `react-p5` on client-side
// This is useful if a component relies on browser APIs like window.
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
	ssr: false,
})


// get CMS content =================
export async function getStaticProps() {
	const client = createClient({
		space: process.env.CONTENTFUL_SPACE_ID,
		accessToken: process.env.CONTENTFUL_ACCESS_KEY
	});
	const res = await client.getEntries({ content_type: 'ghostPong' });
	return {
		props: {
			ghostPongItems: res.items
		}
	}
}


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

	moveGhost(isPaused) {
		if (isPaused) {
			this.x += 0;
			this.y += 0;
		} else {
			this.x += this.speedX;
			this.y += this.speedY;
		}
	}

	changeHorizontalDirection() {
		this.speedX *= -1; // positive value moves down, negative value moves up
	}

	changeVerticalDirection() {
		this.speedY *= -1; // positive value moves right, negative value moves left
	}

	updateGhostImage(img) {
		this.image = img;
	}
}


// GAME PLAY =====================
class FloatingGhost extends React.Component {
	constructor({ ghostPongItems }) {
		super();

		this.state = {
			isPaused: false,
		};

		// Global Variables =================
		this.ghostImage = ghostPongItems.filter((item) => item.fields.assetsId === 'ghost');
		this.ghostImagePaths = this.ghostImage[0].fields.assets.map( image => {
			return {
				...this.ghostImagePaths,
				title: image.fields.title,
				url: image.fields.file.url
			}
		});

		this.ghostSize = new Ghost().size;

		this.togglePause = this.togglePause.bind(this);
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
			ghost.x += 1; // reposition ghost inbounds, additional measure for not getting stuck out of frame
			ghost.y += 1; // reposition ghost inbounds, additional measure for not getting stuck out of frame
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostLeftDown);
		} else if (topEdge && movingRight) {
			ghost.x -= 1; // reposition ghost inbounds
			ghost.y += 1; // reposition ghost inbounds
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostRightDown);
		} else if (bottomEdge && movingLeft) {
			ghost.x += 1; // reposition ghost inbounds
			ghost.y -= 1; // reposition ghost inbounds
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (bottomEdge && movingRight) {
			ghost.x -= 1; // reposition ghost inbounds
			ghost.y -= 1; // reposition ghost inbounds
			ghost.changeVerticalDirection();
			ghost.updateGhostImage(this.ghostRightUp);
		} else if (leftEdge && movingUp) {
			ghost.x += 1; // reposition ghost inbounds
			ghost.y -= 1; // reposition ghost inbounds
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostRightUp);
		} else if (leftEdge && movingDown) {
			ghost.x += 1; // reposition ghost inbounds
			ghost.y -= 1; // reposition ghost inbounds
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostRightDown);
		} else if (rightEdge && movingUp) {
			ghost.x -= 1; // reposition ghost inbounds
			ghost.y += 1; // reposition ghost inbounds
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostLeftUp);
		} else if (rightEdge && movingDown) {
			ghost.x -= 1; // reposition ghost inbounds
			ghost.y -= 1; // reposition ghost inbounds
			ghost.changeHorizontalDirection();
			ghost.updateGhostImage(this.ghostLeftDown);
		}
	}

	togglePause(event) {
		this.setState(prevState => ({ ...prevState, isPaused: !this.state.isPaused }));
	}

	// p5 Drawing Library functions =================
	setup = (p5, canvasParentRef) => {
		let boardWidth = 360;
		let boardHeight = 280;
		// set gameboard size on larger viewports
		if (window.innerWidth > 800) {
			boardWidth = 600;
			boardHeight = 400;
		}
		this.gameBoard = new GameBoard(boardWidth, boardHeight);
		// p5 CANVAS
		p5.createCanvas(this.gameBoard.width, this.gameBoard.height).parent(canvasParentRef);
		p5.frameRate(30);
		p5.background(0); // black
		p5.angleMode(p5.DEGREES);
		p5.rectMode(p5.CENTER);
		p5.imageMode(p5.CENTER);
		// Ghost Images
		this.ghostImagePaths.forEach( image => {
			p5.loadImage(image.url, img => {
				switch (image.title) {
					case 'ghost-left-down':
						this.ghostLeftDown = img;
						break;
					case 'ghost-left-up':
						this.ghostLeftUp = img;
						break;
					case 'ghost-right-down':
						this.ghostRightDown = img;
						this.ghost.image = this.ghostRightDown; // starting ghost image
						break;
					case 'ghost-right-up':
						this.ghostRightUp = img;
						break;
				}
			});
		})
		// Create Ghost = x, y
		this.ghost = new Ghost(
			this.gameBoard.width / 2,
			this.gameBoard.height / 2
		);

		// Event Listener for Fullscreen Canvas for desktop only
		let canvas = document.querySelector('.p5Canvas');
		canvas.addEventListener('dblclick', () => {
			if (!document.fullscreenElement) {
				canvas.requestFullscreen();
			} else {
				document.exitFullscreen();
			}
		});
	}

	draw = p5 => {
		this.gameBoard.drawGameBoardBg(p5);
		this.checkEdges(this.ghost, this.gameBoard);
		this.ghost.moveGhost(this.state.isPaused);
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

					{/* Controls */}
					<div className="settings-container">
						<button
							className={`settings-button pause-button${this.state.isPaused? ' is-paused': ''}`}
							onClick={this.togglePause}
						>PAUSE</button>
					</div>
				</main>
			</>
		);
	}
}

export default FloatingGhost;
