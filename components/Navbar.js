import Link from 'next/link'

const Navbar = () => {
	return (
		<div>
			<nav>
				<Link href="/"><a>Oxleberry</a></Link>
				<Link href="/"><a>Portfolio</a></Link>
				<Link href="/creative-coding"><a>Creative Coding</a></Link>
				<Link href="/about"><a>About</a></Link>
			</nav>
		</div>
	);
}

export default Navbar;