import { useState } from 'react';

import Head from 'next/head';
import Header from '../../../components/Header';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { Day } from './Day/Day';
import { NewEventModal } from './NewEventModal/NewEventModal';
import { useDate } from './hooks/useDate';


export default function Calendar() {
	// States =================
	const [nav, setNav] = useState(0);
	const [clicked, setClicked] = useState();
	const [events, setEvents] = useState([]);
	const [lastEventCreated, setLastEventCreated] = useState({});

	const { days, dateDisplay } = useDate(events, nav);

	console.log('events', events);

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
								onClick={() => {
									if (d.value !== 'blank-days') { setClicked(d.date) }
								}}
							/>
						))}
					</div>
				</div>

				{ clicked &&
					<NewEventModal
						data={lastEventCreated}
						onClose={() => setClicked(null)}
						onSave={(title, numDays, order, color, isCentered) => {
							setEvents([ ...events, { title, numDays, order, color, isCentered, date: clicked }]);
							setClicked(null);
							setLastEventCreated({ title, numDays, order, color, isCentered });
						}}
					/>
				}
			</main>
		</>
	);
}
