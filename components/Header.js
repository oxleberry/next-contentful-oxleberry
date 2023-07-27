import Link from 'next/link'


const Headline = (props) => {
	return (
		<header className={props.isSubPage ? 'sub-page-header' : 'header'}>
			<h1>{props.headline}</h1>
		</header>
	);
}

const SubNavHeader = (props) => {
	return (
		<div className="sub-nav-header">
			<Link href={props.ctaPrevious}><a><div className="cta-arrow cta-arrow-previous"></div></a></Link>
			<Headline headline={props.headline} isSubPage={props.isSubPage}/>
			<Link href={props.ctaNext}><a><div className="cta-arrow"></div></a></Link>
		</div>
	);
}


/* Inputs:
		headline = string
		isSubPage = boolean (optional)
		hasSubNav = boolean (optional)
		ctaPrevious = slug (optional)
		ctaNext = slug (optional)
*/
export default function Header({ headline, isSubPage, hasSubNav, ctaPrevious, ctaNext }) {
	return (
		<>
			{!hasSubNav && <Headline headline={headline} isSubPage={isSubPage}/>}
			{hasSubNav && <SubNavHeader headline={headline} isSubPage={isSubPage} ctaPrevious={ctaPrevious} ctaNext={ctaNext}/>}
		</>
	);
}
