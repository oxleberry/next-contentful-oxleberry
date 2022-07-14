import Link from 'next/link'
import Image from 'next/image'

const CreativeCard = ({ card }) => {
	const { title, order, url, slug, image } = card.fields;

	return (
		<article id={order} className={`card-item bounce ${slug}`}>
			<Link href={url ? `${url}` : `/creative-coding/${slug}`}>
				<a>
					<div className="img-block">
						<Image src="/creative-card/all-stars.png" width={300} height={324} alt="Oxle Miitomo"/>
						{/* <picture>
							<source srcSet="/creative-card/all-stars.png" />
							<img src="/creative-card/all-stars.png" alt="Oxle Miitomo" />
						</picture> */}
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
