import Image from 'next/image'
import styles from '../styles/Home.module.scss'

const About = () => {
	return (
		<div className={styles.wrapper}>
			<h1>About</h1>
			<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab cum culpa mollitia corporis corrupti nisi deleniti exercitationem ad deserunt! Pariatur sed perferendis repellat nisi labore odio? Non aliquam illo quidem.</p>
			<picture>
				<source srcSet="/oxle-icon.gif" />
				<img src="/oxle-icon.gif" alt="Oxleberry logo - three little monsters" />
			</picture>
			<br />
			<Image src="/oxle-icon.gif" width={291} height={100} alt="Oxleberry logo - three little monsters"/>
		</div>
	);
}

export default About;