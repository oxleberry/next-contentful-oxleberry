import React from 'react';
import { Component } from 'react';
import Head from 'next/head'
import Header from '../../components/Header'

// Will only import `react-p5` on client-side
// This is useful if a component relies on browser APIs like window.
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
import dynamic from 'next/dynamic'
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
	ssr: false,
})


// Other Components =================
const Scoreboard = (props) => {
	return (
		<div className={`scoreboard ${props.id}`} id={props.id}>
			<p>{props.text}: {props.points}</p>
		</div>
	);
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

	movePaddle(p5, isPaused, gameBoardHeight, gameBoardStroke) {
		if (isPaused) {
			this.y += 0;
		} else {
			const topBoundary = gameBoardStroke / 2 + this.height / 2;
			const bottomBoundary = gameBoardHeight - gameBoardStroke / 2 - this.height / 2;
			this.y += this.speedY;
			// constrain = target, top, bottom
			this.y = p5.constrain (this.y, topBoundary, bottomBoundary);
		}
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
		this.startSpeed = 2;
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

	// returns: number (randomly generated a number from, 0-9)
	randomGenerator() {
		const randomNum = Math.floor(Math.random() * 10);
		return randomNum;
	};

	resetGhost(gameBoard) {
		this.x = gameBoard.width/2;
		this.y = gameBoard.height/2;
		this.speedX = this.startSpeed;
		this.speedY = this.startSpeed;
		const randomHorizNum = this.randomGenerator();
		const randomVertNum = this.randomGenerator();
		// randomly sets the direction of ghost puck
		if (randomHorizNum < 5){
			this.speedX *= -1;
		}
		if (randomVertNum < 5){
			this.speedY *= -1;
		}
	}
}


// CONTROL =====================
class ControlButton extends Component {
	constructor() {
		super();
		this.state = {
			isPressed: false,
		};

		this.mousePressed = this.mousePressed.bind(this);
		this.mouseReleased = this.mouseReleased.bind(this);
	}

	mousePressed() {
		const id = `${this.props.player}-${this.props.direction}`
		this.setState(prevState => ({ ...prevState, isPressed: !this.state.isPressed }));
		this.props.onControlsMousePressed(id);
	}

	mouseReleased() {
		const id = `${this.props.player}-${this.props.direction}`
		this.setState(prevState => ({ ...prevState, isPressed: !this.state.isPressed }));
		this.props.onControlsMouseReleased(id);
	}

	render() {
		return (
			<button id={`${this.props.player}-${this.props.direction}`}
				className={`control control-${this.props.direction}${this.state.isPressed? ' is-pressed': ''}`}
				onMouseDown={this.mousePressed}
				onMouseUp={this.mouseReleased}>
				<img className="arrow" src={this.props.image} />{this.state.age}
			</button>
		);
	}
}


// KEYBOARD GUIDE =====================
	// Props:
	// side = string | Example: "left", "right"
	// name = string | Example: "Left", "Right"
	// topKey = string
	// bottomKey = string
	// isHidden = boolean
	class KeyboardGuide extends Component {
		constructor() {
			super();
		}

		render() {
			return (
				<div className={`key-guide-container ${this.props.side}-player-guide${this.props.isHidden ? ' hide': ''}`}>
					<div className="key-guide title">
						<span>{this.props.name} Player Keyboard Keys</span>
					</div>
					<span className="key-guide">{this.props.topKey}</span>
					<span className="key-guide">{this.props.bottomKey}</span>
				</div>
			);
		}
	}


// GAME PLAY =====================
class GhostPong extends React.Component {
	constructor() {
		super();

		this.state = {
			isPaused: false,
			isMuted: false,
			scoreLeftPlayer: 0,
			scoreRightPlayer: 0,
			isMobile: true,
		};

		// Global Variables =================
		this.paddle = {
			distanceFromEdge: 30, // distance paddle is from edge of game board
			width: new Paddle().width, // used for setting stripe placement
			speed: new Paddle().speed, // used for changing directions
			startSpeed: 0
		}
		this.audioPop = null;
		this.audioScore = null;

		this.togglePause = this.togglePause.bind(this);
		this.toggleMute = this.toggleMute.bind(this);
		this.resetGame = this.resetGame.bind(this);
	}


	// Game Play functions =================
	// check and update if the ghost puck hits top or bottom sides of the gameboard
	checkEdges (ghost, gameBoard) {
		const topEdge = (ghost.size/2) + gameBoard.stroke;
		const bottomEdge = gameBoard.height - (ghost.size/2) - gameBoard.stroke;
		const leftEdge = gameBoard.stroke;
		const rightEdge = gameBoard.width - gameBoard.stroke;
		const topEdgeCheck = ghost.y <= topEdge;
		const bottomEdgeCheck = ghost.y >= bottomEdge;
		const leftEdgeCheck = ghost.x <= leftEdge;
		const rightEdgeCheck = ghost.x >= rightEdge;
		if (topEdgeCheck) {
			ghost.y = topEdge + 1; // reposition ghost inbounds, additional measure for not getting stuck out of frame
			ghost.changeVerticalDirection();
			this.getGhostImage(ghost);
		} else if (bottomEdgeCheck) {
			ghost.y = bottomEdge - 1; // reposition ghost inbounds, additional measure for not getting stuck out of frame
			ghost.changeVerticalDirection();
			this.getGhostImage(ghost);
		} else if (leftEdgeCheck) {
			if (!this.state.isMuted) {
				this.audioScore.play();
			}
			this.setState(prevState => ({ ...prevState, scoreRightPlayer: this.state.scoreRightPlayer + 1 }));
			ghost.resetGhost(this.gameBoard);
			this.getGhostImage(ghost);
		} else if (rightEdgeCheck) {
			if (!this.state.isMuted) {
				this.audioScore.play();
			}
			this.setState(prevState => ({ ...prevState, scoreLeftPlayer: this.state.scoreLeftPlayer + 1 }));
			ghost.resetGhost(this.gameBoard);
			this.getGhostImage(ghost);
		}
	}

	checkPaddle(p5, paddle, ghost) {
		// console.log('===================================');
		let ghostEdgeCheck;
		let ghostSpanCheck; // distance that the ghost moves at = (ghost.speedX)

		const ghostLeftEdge = ghost.x - (ghost.size/2);
		const ghostRightEdge = ghost.x + (ghost.size/2);
		const ghostCenterY = ghost.y;
		const ghostTop = ghost.y - (ghost.size/3);
		const ghostBottom = ghost.y + (ghost.size/3);
		const paddleCenterX = paddle.x;
		const paddleTop = paddle.y - (paddle.height/2) - (ghost.size/3);
		const paddleBottom = paddle.y + (paddle.height/2) + (ghost.size/3);

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
			if (!this.state.isMuted) {
				this.audioPop.play();
			}
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

	togglePause(event) {
		this.setState(prevState => ({ ...prevState, isPaused: !this.state.isPaused }));
	}

	toggleMute(event) {
		this.setState(prevState => ({ ...prevState, isMuted: !this.state.isMuted }));
	}

	resetGame(event) {
		if (!this.state.isPaused) {
			this.ghost.resetGhost(this.gameBoard);
			this.getGhostImage(this.ghost);
			this.left.y = this.gameBoard.height/2;
			this.right.y = this.gameBoard.height/2;
			this.setState(prevState => ({ ...prevState, scoreLeftPlayer: 0 }));
			this.setState(prevState => ({ ...prevState, scoreRightPlayer: 0 }));
		}
	}


	// Keyboard event listener =================
	keyPressed = (p5, event) => {
		// move paddle up and down
		if (p5.key === ';') { // up
			this.right.updatePaddleDirection( - this.paddle.speed);
		} else if (p5.key === '.') { // down
			this.right.updatePaddleDirection(this.paddle.speed);
		} else if (p5.key === 's') { // up
			this.left.updatePaddleDirection( - this.paddle.speed);
		} else if (p5.key === 'x') { // down
			this.left.updatePaddleDirection(this.paddle.speed);
		// pause game
		} else if (p5.key === 'p') {
			this.togglePause();
		}
	}

	// stop paddles from moving
	keyReleased = (p5, event) => {
		if (p5.key === ';' || p5.key === '.') {
			this.right.updatePaddleDirection(0);
		} else if  (p5.key === 's' || p5.key === 'x') {
			this.left.updatePaddleDirection(0);
		}
	}

	// Mouse Click event listener =================
	controlMousePressedHandler = (buttonId) => {
		switch (buttonId) {
			case 'left-player-up':
				this.left.updatePaddleDirection( - this.paddle.speed);
				break;
			case 'left-player-down':
				this.left.updatePaddleDirection( this.paddle.speed);
				break;
			case 'right-player-up':
				this.right.updatePaddleDirection( - this.paddle.speed);
				break;
			case 'right-player-down':
				this.right.updatePaddleDirection( this.paddle.speed);
				break;
		}
	}

	controlMouseReleasedHandler = (buttonId) => {
		switch (buttonId) {
			case 'left-player-up':
				this.left.updatePaddleDirection(0);
				break;
			case 'left-player-down':
				this.left.updatePaddleDirection(0);
				break;
			case 'right-player-up':
				this.right.updatePaddleDirection(0);
				break;
			case 'right-player-down':
				this.right.updatePaddleDirection(0);
				break;
		}
	}

	setMobileOff = () => {
		this.setState(prevState => ({ ...prevState, isMobile: false }));
	}


	// p5 Drawing Library functions =================
	setup = (p5, canvasParentRef) => {
		let boardWidth = 360;
		let boardHeight = 280;
		// set gameboard size on larger viewports
		if (window.innerWidth > 800) {
			boardWidth = 600;
			boardHeight = 400;
			this.setMobileOff();
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
		// Audio
		this.audioPop = new Audio('/creative-coding-pages/ghost-pong/audio/pop.mp3');
		this.audioScore = new Audio('/creative-coding-pages/ghost-pong/audio/score.mp3');
	}

	draw = p5 => {
		this.gameBoard.drawGameBoardBg(p5);
		// update paddles
		this.checkPaddle(p5, this.left, this.ghost);
		this.checkPaddle(p5, this.right, this.ghost);
		this.left.movePaddle(p5, this.state.isPaused, this.gameBoard.height, this.gameBoard.stroke);
		this.right.movePaddle(p5, this.state.isPaused, this.gameBoard.height, this.gameBoard.stroke);
		this.left.drawPaddle(p5);
		this.right.drawPaddle(p5);
		// update ghost
		this.checkEdges(this.ghost, this.gameBoard);
		this.ghost.moveGhost(this.state.isPaused);
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
					<div className="score-wrapper">
						<Scoreboard id="score-left-player" text="Left Player" points={this.state.scoreLeftPlayer}/>
						<Scoreboard id="score-right-player" text="Right Player" points={this.state.scoreRightPlayer}/>
					</div>

					{/* Ghost Pong Game */}
					<Sketch setup={this.setup} draw={this.draw} keyPressed={this.keyPressed} keyReleased={this.keyReleased} keyIsDown={this.keyIsDown}/>

					{/* Control Buttons */}
					<div className="game-pad-container">
						<KeyboardGuide side="left" name="Left" topKey="s" bottomKey="x" isHidden={this.state.isMobile}/>
						<div className="game-pad left-player-game-pad">
							<ControlButton
								player="left-player"
								direction="up"
								image="/creative-coding-pages/ghost-pong/images/arrow-up.png"
								onControlsMousePressed={this.controlMousePressedHandler}
								onControlsMouseReleased={this.controlMouseReleasedHandler}/>
							<ControlButton
								player="left-player"
								direction="down"
								image="/creative-coding-pages/ghost-pong/images/arrow-down.png"
								onControlsMousePressed={this.controlMousePressedHandler}
								onControlsMouseReleased={this.controlMouseReleasedHandler}/>
						</div>
						<div className="game-pad right-player-game-pad">
							<ControlButton
								player="right-player"
								direction="up"
								image="/creative-coding-pages/ghost-pong/images/arrow-up.png"
								onControlsMousePressed={this.controlMousePressedHandler}
								onControlsMouseReleased={this.controlMouseReleasedHandler}/>
							<ControlButton
								player="right-player"
								direction="down"
								image="/creative-coding-pages/ghost-pong/images/arrow-down.png"
								onControlsMousePressed={this.controlMousePressedHandler}
								onControlsMouseReleased={this.controlMouseReleasedHandler}/>
						</div>
						<KeyboardGuide side="right" name="Right" topKey=";" bottomKey="." isHidden={this.state.isMobile}/>
					</div>

					{/* Settings */}
					<div className="settings-container">
						<button
							className={`settings-button pause-button${this.state.isPaused? ' is-paused': ''}`}
							onClick={this.togglePause}
						>Pause</button>
						<button
							className={`settings-button reset-button`}
							onClick={this.resetGame}
							disabled={this.state.isPaused}
						>Reset</button>
						<button
							className={`settings-button mute-button`}
							onClick={this.toggleMute}
						>{this.state.isMuted? 'SOUND': 'MUTE'}</button>
					</div>
				</main>
			</>
		);
	}
}

export default GhostPong;
