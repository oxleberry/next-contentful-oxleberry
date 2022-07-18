import Link from 'next/link'
import { useRouter } from 'next/router';

const Navbar = () => {
	const router = useRouter();

	// Keep Link active if in a sub-page
	function checkPath(path, subDirectory) {
		if (path.startsWith(subDirectory)) {
			return true;
		}
	}

	return (
		<>
			{/* Desktop */}
			<nav className="desktop-nav-full-width-wrapper" aria-label="Primary Naviation" role="navigation">
				<div className="desktop-nav">
					<ul className="left-nav">
						<li><Link href="/"><a>Oxleberry</a></Link></li>
						<li><Link href="/"><a className={router.pathname == "/" ? "active" : ""}>Portfolio</a></Link></li>
						<li><Link href="/creative-coding"><a className={checkPath(router.pathname, '/creative-coding') ? "active" : ""}>Creative Coding</a></Link></li>
						<li><Link href="/about"><a className={checkPath(router.pathname, '/about') ? "active" : ""}>About</a></Link></li>
					</ul>
					<ul className="right-nav">
						<li>
							<Link href='/'>
								<picture>
									<source srcSet="/oxle-icon.gif" />
									<img src="/oxle-icon.gif" alt="Oxleberry logo - three little monsters" />
								</picture>
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
}

export default Navbar;