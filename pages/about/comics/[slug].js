import Head from 'next/head'
import Header from '../../../components/Header'


export default function comic() {
	return (
		<>
			<Head>
				<title>Oxleberry | Comic</title>
				<meta name="description" content="Comic Description"/>
			</Head>
			<main className={`page-backboard comic-page little-super-hero-boy`}>
				<Header headline="Comic Title" alt={true}></Header>
				<div className="comic-container">
						<picture>
							<source srcSet="/about-pages/comics/little-super-hero-boy/lshb-comic-1.gif" />
							<img src="/about-pages/comics/little-super-hero-boy/lshb-comic-1.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/little-super-hero-boy/lshb-comic-2.gif" />
							<img src="/about-pages/comics/little-super-hero-boy/lshb-comic-2.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/little-super-hero-boy/lshb-comic-3.gif" />
							<img src="/about-pages/comics/little-super-hero-boy/lshb-comic-3.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/little-super-hero-boy/lshb-comic-4.gif" />
							<img src="/about-pages/comics/little-super-hero-boy/lshb-comic-4.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-1.gif" />
							<img src="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-1.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-2.gif" />
							<img src="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-2.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-3.gif" />
							<img src="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-3.gif" alt="Test" />
						</picture>
						<picture>
							<source srcSet="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-4.gif" />
							<img src="/about-pages/comics/air-bubble-cleaner/bubble-cleaner-comic-4.gif" alt="Test" />
						</picture>
					</div>
			</main>
		</>
	);
}
