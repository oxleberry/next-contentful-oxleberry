import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Header from '../../../components/Header';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { Day } from './Day/Day';
import { useDate } from './hooks/useDate';


export default function Calendar() {
	// States =================
	const [nav, setNav] = useState(0);

	const { days, dateDisplay } = useDate( nav);


	return (
		<>
			<Head>
				<title>Oxleberry | Calendar</title>
				<meta name="description" content="Calendar web app using local storage." />
			</Head>
			<main className="full-backboard calendar-page">
				<Header headline="Calendar" isSubPage={true}></Header>

				<div className="calendar-container">
					<CalendarHeader
						dateDisplay={dateDisplay}
						onNext={() => setNav(nav + 1)}
						onBack={() => setNav(nav - 1)}
					/>

					<div className="weekdays">
						<div className="weekday-label">Sunday</div>
						<div className="weekday-label">Monday</div>
						<div className="weekday-label">Tuesday</div>
						<div className="weekday-label">Wednesday</div>
						<div className="weekday-label">Thursday</div>
						<div className="weekday-label">Friday</div>
						<div className="weekday-label">Saturday</div>
					</div>

					<div className="calendar">
						{days.map((d, index) => (
							<Day
								key={index}
								day={d}
							/>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
