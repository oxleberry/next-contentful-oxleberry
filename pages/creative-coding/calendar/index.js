import { useEffect, useState } from 'react';

import Head from 'next/head';
import Header from '../../../components/Header';
import { CalendarHeader } from './CalendarHeader/CalendarHeader';
import { Day } from './Day/Day';
import { NewEventModal } from './NewEventModal/NewEventModal';
import { UpdateDeleteEventModal } from './UpdateDeleteEventModal/UpdateDeleteEventModal';
import { DeleteAllModal } from './DeleteAllModal/DeleteAllModal';
import { useDate } from './hooks/useDate';


export default function Calendar() {
	// States =================
	const [nav, setNav] = useState(0);
	const [clickedDay, setClickedDay] = useState(null);
	const [clickedEvent, setClickedEvent] = useState(false);
	const [events, setEvents] = useState([]);
	const [lastEventCreated, setLastEventCreated] = useState({});
	const [lastEventClicked, setLastEventClicked] = useState({});
	const [showDeleteTrigger, setShowDeleteTrigger] = useState(true);
	const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

	const { days, dateDisplay } = useDate(events, nav);

	// on initial page load
	useEffect(() => {
		// check for events in local storage
		const eventsFromLocalStorage = localStorage.getItem('oxle-events')
			? JSON.parse(localStorage.getItem('oxle-events'))
			: [];
		setEvents(eventsFromLocalStorage);

		// Set delay to hide button to trigger Delete All modal
		setTimeout(() => {
			setShowDeleteTrigger(false);
		}, 5000);
	}, []);

	// update events in local storage
	useEffect(() => {
		localStorage.setItem('oxle-events', JSON.stringify(events));
	}, [events]);

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
						showDeleteTrigger={showDeleteTrigger}
						showDeleteAllModal={() => setShowDeleteAllModal(true)}
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
									if (d.value !== 'blank-days') { setClickedDay(d.date) }
								}}
								triggerUpdateModal={ setClickedEvent }
								setLastEventClicked={ setLastEventClicked }
							/>
						))}
					</div>
				</div>

				{ clickedDay &&
					<NewEventModal
						data={lastEventCreated}
						onClose={() => setClickedDay(null)}
						onSave={(title, numDays, order, color, isCentered) => {
							setEvents([ ...events, { id:`${clickedDay}-${order}`, title, numDays, order, color, isCentered, date: clickedDay }]);
							setClickedDay(null);
							setLastEventCreated({ title, numDays, order, color, isCentered });
						}}
					/>
				}

				{ clickedEvent &&
					<UpdateDeleteEventModal
						data={lastEventClicked}
						onUpdate={(title, numDays, order, color, isCentered) => {
							const updatedEvents = events.map(event => {
								if (event.id === lastEventClicked.id) {
									return { ...event, title, numDays, order, color, isCentered };
								} else {
									return event; // no changes to these item
								}
							});
							setEvents(updatedEvents);
							setClickedEvent(false);
						}}
						onDelete={() => {
							setEvents(events.filter(event => event.id !== lastEventClicked.id));
							setClickedEvent(false);
						}}
						onClose={() => setClickedEvent(false)}
					/>
				}

				{ showDeleteAllModal &&
					<DeleteAllModal
						onClose={() => setShowDeleteAllModal(false)}
					/>
				}
			</main>
		</>
	);
}
