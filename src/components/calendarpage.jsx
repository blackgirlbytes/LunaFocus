import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState, useMemo } from "react";
import CurrentPeriodControl from "@/components/current-period-control";
import { PeriodDialog } from "@/components/period-dialog";
import { v4 as uuidv4 } from 'uuid';
import { formatDate, stringToDate, toUTCDate } from "@/lib/utils";
import { usePeriods } from '@/context/PeriodContext';

const formatDateForCalendar = (date) => date.toISOString().split('T')[0];

export function CalendarPage() {
  const [dialogTitle, setDialogTitle] = useState('Dialog');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogPeriod, setDialogPeriod] = useState(null);
  const [events, setEvents] = useState([]);
  const { periods, findCurrentPeriod, addOrUpdatePeriod } = usePeriods();


  const periodToCalendarEvents = (period) => {
    console.log("[periodToCalendarEvents] period: ", period);
    if (!period.dailyEntries) return [];
    console.log("[periodToCalendarEvents] not exiting early.");
    return period.dailyEntries.map(day => ({
      date: day.date,
      title: `day-${uuidv4()}`,
      periodId: period.id,
      flowType: day.flowType,
    }));
  }

  function periodForDate(date) {
    if (!date) return null;
    const compareTime = date.getTime();
    return Object.values(periods).find(period => {
      const startDate = stringToDate(period.startDate);
      const endDate = stringToDate(period.endDate);
      return startDate.getTime() <= compareTime && endDate.getTime() >= compareTime
    });
  }

  useEffect(() => {
    console.log("periods: ", periods );
    const updateEvents = () => {
      const newEvents =  Object.values(periods)?.flatMap(periodToCalendarEvents)
      console.log("newEvents: ", newEvents );
      setEvents(newEvents);
    }

    updateEvents();
  }, [periods])
  
  // function startNewPeriod(startDate) {
  //   const periodId = uuidv4();
  //   setPeriods((prevPeriods) => ({
  //     ...prevPeriods,
  //     [periodId]: {
  //       id: periodId,
  //       startDate: startDate,
  //       endDate: null,
  //       dailyEntries: [],
  //     },
  //   }));
  //   openModal('Set Period Dates', periodId);
  // }


  function addOrUpdateEvents(dates, periodId, flowTypes) {
    const newOrUpdatedEvents = dates.map((date) => ({
      date: date,
      title: `day-${uuidv4()}`,
      periodId: periodId,
      flowType: flowTypes[date] || null, // Set to null if not defined
    }));

    setEvents((prevEvents) => [
      ...prevEvents.filter(event => event.periodId !== periodId), // events from other periods
      ...newOrUpdatedEvents,
    ]);
  }


  function onClose(modalData) {
    const periodId = dialogPeriod?.id || uuidv4();
    addOrUpdatePeriod({...modalData, periodId});
    setIsOpen(false);
  }

  const openModal = (eventTitle, period) => {
    setDialogPeriod(period);
    setDialogTitle(eventTitle);
    setIsOpen(true);
  }

  const onEventClick = ({event}) => {
    const periodId = event.extendedProps?.periodId;
    openModal('Updating Period Information', periods[periodId]);
  }

  const onDateClick = ({date}) => {
    const potentialNewPeriod = { startDate: formatDate(date) }
    openModal('New Period', potentialNewPeriod);
  };

  const onPeriodControlChange = (date) => {
    if (date) {
      onDateClick({date: new Date()})
    } else {
      const currentPeriodWithSuggestedEndDate = {...findCurrentPeriod(), endDate: formatDate(new Date())};
      openModal('My Period Ended', currentPeriodWithSuggestedEndDate);
    }
  }


  const EventItem = ({ info }) => {
    const { event } = info;
    const flowType = event.extendedProps.flowType;
    const date = toUTCDate(event.start);
    const day = date.getDate();

    // Update the daycell
    const dateString  = formatDate(date);
    const tdElement = document.querySelector(`td[data-date="${dateString}"]`);
    tdElement.classList.add('day-with-event');

    // The timestamp on the event is 00:00 GMT but in PST, so it's the previous day. 
    // Convert it to the GMT date.
    return (
      <div>
        <div className={"dot flex flex-col justify-center justify-items-center " + flowType}><div>{day}</div></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col calendar-page">
      <FullCalendar
        selectable={true}
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={onDateClick}
        eventClick={onEventClick} // TODO: Fix existing modal to support editing period data or display a different modal
        eventContent={(info) => <EventItem info={info} />}
        initialView="dayGridMonth"
        events={events}
        aspectRatio={1}
      />
      <CurrentPeriodControl currentPeriod={findCurrentPeriod()} onPeriodControlChange={onPeriodControlChange} />
      {isOpen && <PeriodDialog dialogTitle={dialogTitle} period={dialogPeriod} onClose={onClose} />}
    </div>
  );
}
