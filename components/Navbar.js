import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react'


const Navbar = () => {
	const router = useRouter();

	// Elements =================
	const mobileNavButtonRef = useRef(null);
	const mobileNavListRef = useRef(null);

	// States =================
	const [hiddenClass, setHiddenClass] = useState('hidden');


	// Helper Functions =================
	// Keep Link active if in a sub-page
	function checkPath(path, subDirectory) {
		if (path.startsWith(subDirectory)) {
			return true;
		}
	}

	const toggleMobileNav = (() => {
		hiddenClass ? setHiddenClass('') : setHiddenClass('hidden');
	});

	const closeMobileNav = ((event) => {
		const mobileNavButton = mobileNavButtonRef.current;
		const mobileNavImage = mobileNavButton.children[0].children[1];
		// hide the mobile navList when clicking outside of the nav button
		if (event.target !== mobileNavButton && event.target !== mobileNavImage) {
			setHiddenClass('hidden');
		}
	});


	// Initial Page Load =================
	useEffect(() => {
		window.addEventListener('mouseup', closeMobileNav);

		return () => {
			window.removeEventListener('mouseup', closeMobileNav);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


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

			{/* Mobile */}
			<nav className="mobile-nav" aria-label="Mobile Naviation" role="navigation">
				<button ref={mobileNavButtonRef} onClick={toggleMobileNav} aria-label="Mobile Navigation Trigger">
					<picture>
						<source srcSet="/oxle-icon.gif" />
						<img src="/oxle-icon.gif" alt="Oxleberry logo - three little monsters" />
					</picture>
				</button>
				<ul ref={mobileNavListRef} className={hiddenClass}>
					<li><Link href="/"><a>Oxleberry</a></Link></li>
					<li><Link href="/"><a className={router.pathname == "/" ? "active" : ""}>Portfolio</a></Link></li>
					<li><Link href="/creative-coding"><a className={checkPath(router.pathname, '/creative-coding') ? "active" : ""}>Creative Coding</a></Link></li>
					<li><Link href="/about"><a className={checkPath(router.pathname, '/about') ? "active" : ""}>About</a></Link></li>
				</ul>
			</nav>
		</>
	);
}

export default Navbar;
