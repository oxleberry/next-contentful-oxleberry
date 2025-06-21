import Head from 'next/head';
import Header from '../../../components/Header';
import { Day } from './Day/Day';

export default function calendar() {
	return (
		<>
			<Head>
				<title>Oxleberry | Calendar</title>
				<meta name="description" content="Calendar web app using local storage." />
			</Head>
			<main className="full-backboard calendar-page">
				<Header headline="Calendar" isSubPage={true}></Header>

				<div className="calendar-container">
					<Day day="25"/>
				</div>
			</main>
		</>
	);
}
