
// alt is optional prop for sub-pages
const Header = ({ headline, alt }) => (
	<header className={alt ? 'alt-header' : 'header'}>
		<h1>{headline}</h1>
	</header>
);

export default Header;
