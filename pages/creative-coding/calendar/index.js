import Head from 'next/head';
import Header from '../../../components/Header';
import { Day } from './Day/Day';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { useDate } from './hooks/useDate';


export default function calendar() {
	const { dateDisplay } = useDate();

	return (
		<>
			<Head>
				<title>Oxleberry | Calendar</title>
				<meta name="description" content="Calendar web app using local storage." />
			</Head>
			<main className="full-backboard calendar-page">
				<Header headline="Calendar" isSubPage={true}></Header>

				<div className="calendar-container">
					<CalendarHeader dateDisplay={dateDisplay}/>

					<div className="weekdays">
						<div className="weekday-label">Sunday</div>
						<div className="weekday-label">Monday</div>
						<div className="weekday-label">Tuesday</div>
						<div className="weekday-label">Wednesday</div>
						<div className="weekday-label">Thursday</div>
						<div className="weekday-label">Friday</div>
						<div className="weekday-label">Saturday</div>
					</div>

					<Day day="25"/>
				</div>
			</main>
		</>
	);
}
