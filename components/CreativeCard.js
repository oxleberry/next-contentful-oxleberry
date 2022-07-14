import Link from 'next/link'
import Image from 'next/image'

const CreativeCard = ({ card }) => {
	const { title, order, url, slug, image } = card.fields;

	return (
		<article id={order} className={`card-item bounce ${slug}`}>
			<Link href={url ? `${url}` : `/creative-coding/${slug}`}>
				<a>
					<div className="img-block">
						<Image
							src={`https:${image.fields.file.url}`}
							width={image.fields.file.details.image.width}
							height={image.fields.file.details.image.height}
							alt={image.fields.description}
						/>
					</div>
					<div className="text-block">
						<h2 dangerouslySetInnerHTML={{__html: title}} />
					</div>
				</a>
			</Link>
		</article>
	);
}

export default CreativeCard;
