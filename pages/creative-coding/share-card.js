import Head from 'next/head'
import Header from '../../components/Header'

export default function ShareCard() {
	return (
		<>
			<Head>
				<title>Oxleberry | Share Card</title>
				<meta name="description" content="Oxleberry Share Card - Send a custom greeting" />
			</Head>
			<div className="full-backboard share-card-page">
				<Header headline="Share Card" isSubPage={true}></Header>
				<main>

					<section className="share-content-container">
						<h2 className="hidden">Share Content</h2>
					</section>

					{/* Option Section */}
					<section className="options-container">
						<h2 className="hidden">Options</h2>
						<div className="option option-color">
							<label className="option-label">Choose a color:</label>
						</div>
						<div className="option option-custom-image">
							<label className="option-label">Upload in image:</label>
						</div>
						<div className="option option-text">
							<label className="option-label">Create text:</label>
						</div>
						<div className="option option-image">
							<label className="option-label">Choose an image from the gallery:</label>
						</div>
					</section>

					<section className="canvas-container"></section>

				</main>
			</div>
		</>
	);
}
