import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'


function AboutTile({ tile }) {
	const { title, order, type, image, description, url, slug, isSprite, isScrollGradient } = tile.fields;
	const scrollGradRef = useRef(null);
	const [scrollPos, setScrollPos] = useState(`68%`);


	// Helper Function =================
	// Creating an array to map between desired scroll positions and an index num,
	// which can be used for the background-x position
	function mapRange(targetStart, targetEnd) {
		const intervals = (targetStart - targetEnd) / 100;
		// to insure range will be in scroll target positions
		targetStart = targetStart - intervals;
		targetEnd = targetEnd - intervals;
		let rangeArr = [];
		for (let i = targetStart; i >= targetEnd; i -= intervals) {
			rangeArr.push(i.toFixed(2));
		}
		return rangeArr;
	}


	useEffect(() => {
		// Element =================
		const scrollGradEl = scrollGradRef.current;

		// Variables =================
		const viewportHeight = window.innerHeight;
		const targetStart = viewportHeight * .66;
		const targetEnd = viewportHeight * .25;
		const rangeArr = mapRange(targetStart, targetEnd);

		const handleScroll = () => {
			// if element in scroll target area
			if (scrollGradRef.current) {
				let elementPosToTop = scrollGradEl.getBoundingClientRect().top;
				if (elementPosToTop <= targetStart && elementPosToTop >= targetEnd) {
					// Find scroll postion value based on the current element's position
					const rangeIndex = rangeArr.findIndex((arrItem) => arrItem <= elementPosToTop);
					setScrollPos(`${rangeIndex}%`);
				}
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);


	return (
		// with Sprite
		isSprite ?
			<div id={order} className={`card-block sprite-container ${title}`}>
				<Link href={url ? `${url}` : `/about/${slug}`}>
					<a>
						<div className="img-block sprite" style={{background: `url(https:${image.fields.file.url})`}}></div>
					</a>
				</Link>
			</div>
		:

		// with scrollGradient
		isScrollGradient ?
			<div id={order} className={`card-block scroll-gradient-container ${title}`}>
				<Link href={url ? `${url}` : `/about/${slug}`}>
					<a>
						<div className="img-block">
							<div ref={scrollGradRef}
									className="scroll-gradient-mask"
									style={{
										backgroundPositionX: scrollPos,
										WebkitMaskImage: `url(https:${image.fields.file.url})`,
										WebkitMaskBoxImage: `url(https:${image.fields.file.url})`,
										maskImage: `url(https:${image.fields.file.url})`
									}}>
								</div>
						</div>
					</a>
				</Link>
			</div>
		:

		// with Links
		url || slug ?
		<div id={order} className={`card-block ${title}`}>
			<Link href={url ? `${url}` : `/about/${slug}`}>
				<a>
				{image ?
					<div className={`img-block${type === 'Image & Text Tile' ? ` flat-bottom-edge` : ''}`}>
						<Image
							src={`https:${image.fields.file.url}`}
							width={image.fields.file.details.image.width}
							height={image.fields.file.details.image.height}
							alt={image.fields.description} />
						</div>
					: null }
					{description ?
						<div className="text-block" dangerouslySetInnerHTML={{__html: description}} />
					: null }
				</a>
			</Link>
		</div>
		:

		// without Links
		<div id={order} className={`card-block ${title}`}>
			{image ?
				<div className={`img-block${type === 'Image & Text Tile' ? ` flat-bottom-edge` : ''}`}>
					<Image
						src={`https:${image.fields.file.url}`}
						width={image.fields.file.details.image.width}
						height={image.fields.file.details.image.height}
						alt={image.fields.description} />
				</div>
			: null }
			{description ?
				<div className="text-block" dangerouslySetInnerHTML={{__html: description}} />
			: null }
		</div>
	);
}


// Text & Social Icons
const AboutSocialTile = () => (
	<div className="card-block">
		<div className="text-block">
			<h2 className="card-text">I appreciate you for checking me out!</h2>
			<ul className="social-list">
				<li>
					<Link href="https://github.com/oxleberry/">
						<a>
							<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
						</a>
					</Link>
				</li>
				<li>
					<Link href="https://www.linkedin.com/in/sharon-paz-oxleberry/">
						<a>
							<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
						</a>
					</Link>
				</li>
			</ul>
		</div>
	</div>
)

export {AboutTile, AboutSocialTile};