import Head from 'next/head'


const SpinnersLoaders = () => {
	return (
		<>
			<Head>
				<title>Oxleberry | Spinners and Loaders</title>
				<meta name="description" content="Oxleberry Spinners and Loaders using CSS animations." />
			</Head>
			<main className="full-backboard spinners-loaders-page">
				<h1>Spinners and Loaders</h1>
				<div className="spinners-wrapper">
					<h2> SPINNERS </h2>
					<div className="spinner sp-spinner1">
						<div className="innerCirc"></div>
					</div>
					<div className="spinner spinner-2">
						<p className="loadingText A">loading</p>
						<p className="loadingText B">.</p>
						<p className="loadingText C">.</p>
						<p className="loadingText D">.</p>
					</div>
					<div className="spinner sp-spinner3"></div>
					<div className="spinner spinner-4"></div>
					<div className="spinner spinner-5"></div>
					<div className="spinner spinner-6">
						<span></span><span></span><span></span>
					</div>
				</div>

				<div className="loaders-wrapper">
					<h2> LOADERS </h2>
					<div className="load-cont">
						<div className="loader2">
							<div className="tree-monster"></div>
						</div>
						<br />
						<div className="loader3">
							<div className="ghost"></div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}

export default SpinnersLoaders;
