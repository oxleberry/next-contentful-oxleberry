import Link from 'next/link'
import { useRouter } from 'next/router';
import Image from 'next/image'
import styles from '/styles/components/_Navbar.module.scss'

const Navbar = () => {
	const router = useRouter();

	return (
		<div>
			{/* Desktop */}
			<div className={styles["desktop-nav-full-width-wrapper"]}>
				<nav className={styles["desktop-nav"]} aria-label="Primary Naviation" role="navigation">
					<ul className={styles["left-nav"]}>
						<li><Link href="/"><a>Oxleberry</a></Link></li>
						<li><Link href="/"><a className={router.pathname == "/" ? `${styles.active}` : ""}>Portfolio</a></Link></li>
						<li><Link href="/creative-coding"><a className={router.pathname == "/creative-coding" ? `${styles.active}` : ""}>Creative Coding</a></Link></li>
						<li><Link href="/about"><a className={router.pathname == "/about" ? `${styles.active}` : ""}>About</a></Link></li>
					</ul>
					<ul className={styles["right-nav"]}>
						<li>
							<Link href='/'>
								<picture>
									<source srcSet="/oxle-icon.gif" />
									<img src="/oxle-icon.gif" alt="Oxleberry logo - three little monsters" />
								</picture>
								{/* <Image src="/oxle-icon.gif" width={134} height={46} alt="Oxleberry logo - three little monsters"/> */}
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;