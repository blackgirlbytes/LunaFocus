import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { useState } from "react";
import Period from "@/components/period"
import { PeriodDialog } from "@/components/period-dialog"
import {v4 as uuidv4} from 'uuid';

// TODO: Read events from DWN
const dummyPeriodStart = '2024-06-11';
const dummyPeriodEnd = '2024-06-15';

const formatDateForCalendar = (date) => date.toISOString().split('T')[0]

export function CalendarPage() {
  const [periodStartDate, setPeriodStartDate] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('Dialog');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogPeriod, setDialogPeriod] = useState(null);

  /**
   * Initialize the period and event data.
   */
  const dummyPeriodId = uuidv4();
  const [periods, setPeriods] = useState({
    [dummyPeriodId]: {
      id: dummyPeriodId,
      startDate: dummyPeriodStart,
      endDate: dummyPeriodEnd,
    }
  });
  const [events, setEvents] = useState([
    {
      date: dummyPeriodStart,
      title: "start",
      periodId: dummyPeriodId,
    },
    {
      date: dummyPeriodEnd,
      title: "end",
      periodId: dummyPeriodId,
    }
  ]);

  /**
   * Returns the periodId of the new period.
   * @param {String} startDate String formatted as 'YYYY-MM-DD'
   */
  function startNewPeriod(startDate) {
    console.log("Starting a new period", periods, startDate);
    const periodId = uuidv4();
    setPeriods({
      ...periods,
      [periodId]: {
        id: periodId,
        startDate: startDate,
        endDate: null,
      }
    });
    console.log("periods: ", periods);
    addEvent("start", startDate, periodId);
    return periodId;
  }

  /**
   * Adds new events to the calendar for each day between the start and end dates.
   * @param {String} periodId UUID identifying the period
   * @param {String} endDate String formatted as 'YYYY-MM-DD'
   */
  function endExistingPeriod(periodId, endDate) {
    console.log("Ending a period");
    console.log("periods: ", periods, periodId, endDate);
    setPeriods({
      ...periods,
      [periodId]: {
        ...periods[periodId],
        endDate: endDate,
      }
    });
    console.log("periods: ", periods);
    addEvent("end", endDate, periodId);
  }

  /**
   * @param {String} periodId UUID identifying the period
   * @returns Period Javascript object
   */
  function findPeriodById(periodId) {
    return periods[periodId];
  }

  /**
   * This should not be called directly. It should ONLY be called indirectly from 
   * startNewPeriod() or endExistingPeriod().
   * @param {String} title 
   * @param {String} date 
   * @param {String} periodId 
   */
  // TODO: Replace with data from the modal submission
  function addEvent(title, date, periodId) {
    console.log("Adding a specific event");
    console.log("events: ", events, title, date);
    setEvents([
      ...events,
      {
        date: date,
        title: title,
        periodId: periodId,
      }
    ]);
    console.log("events: ", events);
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
    endExistingPeriod(dialogPeriod.id, localEndDate);
  }

  const startPeriod = () => {
    const now = new Date();
    setPeriodStartDate(now);
    if (!periodStartDate) {
      startNewPeriod(formatDate(now));
    }
  }

  // const openModal = () => {document.getElementById('my_modal_1').showModal()}
  console.log("rendering calendar page")

  const updateModal = (newContent) => {
    const event = newContent.event;
    const periodId = event.extendedProps.periodId;
    console.log("updateModal", event, event.extendedProps.periodId);

    const title = event.title;
    const period = findPeriodById(periodId);
    setDialogPeriod(period);
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
      {isOpen && <PeriodDialog title={dialogTitle} period={dialogPeriod} onClose={onDialogClose} />}
    </div>
  )
};