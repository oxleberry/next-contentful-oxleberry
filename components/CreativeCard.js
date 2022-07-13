import Link from 'next/link'
import Image from 'next/image'

const CreativeCard = ({ card }) => {
	return (
		<article className="card-item bounce">
			<Link href='/creative-coding/all-stars'>
				<a>
					<div className="img-block">
						<Image src="/creative-card/all-stars.png" width={300} height={324} alt="Oxle Miitomo"/>
						{/* <picture>
							<source srcSet="/creative-card/all-stars.png" />
							<img src="/creative-card/all-stars.png" alt="Oxle Miitomo" />
						</picture> */}
					</div>
					<div className="text-block">
						<h2>All Star Randomizer</h2>
					</div>
				</a>
			</Link>
		</article>
	);
}

export default CreativeCard;
