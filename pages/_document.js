import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
 					{/* Custom Google Fonts */}
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
					<link href="https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Baloo+2:wght@400;600;800&family=Lato:wght@300;400;700;900&family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet"></link>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument