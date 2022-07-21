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

export default AboutTile;
