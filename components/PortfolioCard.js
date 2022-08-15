import Link from 'next/link'
import Image from 'next/image'

const PortfolioCard = ({ card }) => {
	const { title, description, image, projectLink, codeLink, techList, highlightColor } = card.fields;

	return (
		<article className="project-card" style={{borderColor: highlightColor}}>
			<div className="two-col-container">
				<div className="column-left">
					<Link href={projectLink}>
						<a>
							<h2 className="title" style={{color: highlightColor}}>{title}</h2>
							<Image
								src={`https:${image.fields.file.url}`}
								width={image.fields.file.details.image.width}
								height={image.fields.file.details.image.height}
								alt={image.fields.description}
							/>
						</a>
					</Link>
				</div>
				<div className="column-right">
					<Link href={codeLink}>
						<a className="btn">
							<button style={{color: highlightColor}}>Github Code</button>
						</a>
					</Link>
					<div className="tech-block">
						<p className="tech-label">Technologies Used:</p>
						<ul>
							{techList.map((item, idx) =>
								<li key={idx} style={{color: highlightColor}}>{item}</li>
							)}
						</ul>
					</div>
					<p className="description">{description}</p>
				</div>
			</div>
			<hr />
		</article>
	);
}

export default PortfolioCard;
