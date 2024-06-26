import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { useState } from "react";
import Period from "@/components/period"
import { PeriodDialog } from "@/components/period-dialog"

// TODO: Read events from DWN
const startingEvents = [
  { title: 'event 1', date: '2024-06-12' },
  { title: 'event 2', date: '2024-06-14' }
]

const formatDateForCalendar = (date) => date.toISOString().split('T')[0]

export function CalendarPage() {
  const [events, setEvents] = useState(startingEvents);
  const [periodStartDate, setPeriodStartDate] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('Dialog');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogEvent, setDialogEvent] = useState(null); // string

  // TODO: Replace with data from the modal submission
  function addEvent(title, date) {
    console.log("Adding a specific event");
    console.log("events: ", events, title, date);
    setEvents([
      ...events,
      {
        date: date,
        title: title,
      }
    ]);
    console.log("events: ", events);
  }

  function addRandomEvent(title) {
    console.log("Adding a random event");
    console.log("events: ", events);

    setEvents([
      ...events,
      {
        date: formatDateForCalendar(new Date()),
        title: title ,
      }
    ])
  }

  const EventItem = ({ info }) => {
    // TODO: Customize how the event is displayed on the calendar
    const { event } = info;
    return (
      <div>
        <span className="dot"></span>
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  };

  function onDialogClose(localStartDate, localEndDate) {
    console.log("onDialogClose");
    setIsOpen(false);
    // TODO: Update the event if the localStartDate changed
    
    // TODO: Add events between localStartDate and localEndDate
    addEvent("end", localEndDate);
  }

  const startPeriod = () => {
    const now = new Date();
    setPeriodStartDate(now);
    addRandomEvent(!periodStartDate ? "Period started" : "Period ended");
  }

  // const openModal = () => {document.getElementById('my_modal_1').showModal()}
  console.log("rendering calendar page")

  const updateModal = (newContent) => {
    const event = newContent.event
    const title = event.title
    setDialogEvent(event);
    setDialogTitle(title);
    setIsOpen(true);
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Period startDate={periodStartDate} setStartDate={startPeriod} />
      <FullCalendar
        selectable={true}
        plugins={[dayGridPlugin]}
        eventClick={updateModal}
        eventContent={(info) => <EventItem info={info} />}
        initialView="dayGridMonth"
        events={events}
      />
      {/* <button className="btn" onClick={openModal}>open modal</button> */}
      {/* <Modal> */}

        {/* <div className="modal-box">
        <h3 className="font-bold text-lg">Hello Tal!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div> */}
      {/* </Modal> */}
      {isOpen && <PeriodDialog title={dialogTitle} event={dialogEvent} onClose={onDialogClose} />}
    </div>
  )
};