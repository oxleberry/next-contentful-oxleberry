import styles from '/styles/components/_Header.module.scss'

const Header = ({ headline }) => (
	<header className={styles.header}>
		<h1>{headline}</h1>
	</header>
);

export default Header;
