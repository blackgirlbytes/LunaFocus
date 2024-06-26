import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { useState } from "react";

// TODO: Read events from DWN
const startingEvents = [
  { title: 'event 1', date: '2024-06-23' },
  { title: 'event 2', date: '2024-06-24' }
]

export function CalendarPage() {
  const [events, setEvents] = useState(startingEvents);

  // TODO: Delete me later. For demo purposes
  function getRandomJuneDate() {
    const year = 2024;
    const month = 6; // June
    const minDay = 1;
    const maxDay = 30;

    // Generate a random day in June
    const day = Math.floor(Math.random() * (maxDay - minDay + 1)) + minDay;

    // Format the date as "YYYY-MM-DD"
    const formattedDay = day.toString().padStart(2, '0'); // Ensure two digits for the day
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${formattedDay}`;

    return formattedDate;
  }

  // TODO: Replace with data from the modal submission
  function addEvent() {
    console.log("Adding an event");

    setEvents([
      ...events,
      {
        date: getRandomJuneDate(),
        title: "Random event",
      }
    ])
  }

  const handleEventClick = (info) => {
    console.log("Handling event click");
    console.log(info);
    // TODO: Display modal with event details
  };

  const EventItem = ({ info }) => {
    // TODO: Customize how the event is displayed on the calendar
    const { event } = info;
    return (
      <div>
        <p>{event.title}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <FullCalendar
        selectable={true}
        plugins={[dayGridPlugin]}
        eventClick={handleEventClick}
        eventContent={(info) => <EventItem info={info} />}
        initialView="dayGridMonth"
        events={events}
      />

      <button onClick={addEvent}>Add random event</button>
    </div>
  )
};