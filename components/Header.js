/* Inputs:
		headline = string
		isSubPage = boolean (optional)
*/

const Header = ({ headline, isSubPage }) => (
	<header className={isSubPage ? 'sub-page-header' : 'header'}>
		<h1>{headline}</h1>
	</header>
);

export default Header;
