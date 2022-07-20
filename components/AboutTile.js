import Link from 'next/link'
import Image from 'next/image'

{/* Rich Text does not support markdown or <br /> */}
// import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// Example of Use:
{/* <div className="text-block">{documentToReactComponents(description)}</div> */}


function AboutTile({ tile }) {
	const { title, order, type, image, description, url, slug, isSprite } = tile.fields;

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
