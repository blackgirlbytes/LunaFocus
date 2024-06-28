import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import CurrentPeriodControl from "@/components/current-period-control";
import { PeriodDialog } from "@/components/period-dialog";
import { v4 as uuidv4 } from 'uuid';
import PeriodTracker from '@/lib/dwn/period-tracker';
import { formatDate, stringToDate, toUTCDate, calculatePeriodDays } from "@/lib/utils";
import { useWeb5 } from '@/context/Web5Context';

const formatDateForCalendar = (date) => date.toISOString().split('T')[0];

export function CalendarPage() {
  const [periodStartDate, setPeriodStartDate] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('Dialog');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogPeriod, setDialogPeriod] = useState(null);
  const [dialogStartDate, setDialogStartDate] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState(null);

  const { web5, userDid } = useWeb5();

  const [periods, setPeriods] = useState({});
  const [events, setEvents] = useState([]);
  const [periodTracker, setPeriodTracker] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      if (web5 && userDid) {
        let tracker = await PeriodTracker(web5, userDid);
        setPeriodTracker(tracker);
      }
    }
    
    initialize();
  }, [web5, userDid]);

  useEffect(() => {
    const fetchAndSetEvents = async (periodTracker) => {
      const entries = await periodTracker.fetchAllPeriodEntries(web5);
      const newEvents = entries.flatMap(entry => {
        return entry.dailyEntries.map(day => ({
          date: day.date,
          title: `day-${uuidv4()}`,
          periodId: entry.id,
          flowType: day.flowType,
        }));
      });
      setEvents(newEvents);

      const newPeriods = entries.reduce((acc, entry) => {
        acc[entry.id] = {
          id: entry.id,
          startDate: entry.startDate,
          endDate: entry.endDate,
        };
        return acc;
      }, {});
      setPeriods(newPeriods);
    };

    if (periodTracker) {      
      fetchAndSetEvents(periodTracker);
    }
    
  }, [periodTracker]);

  useEffect(() => {
    const newCurrentPeriod = findCurrentPeriod();
    setCurrentPeriod(newCurrentPeriod);
    setPeriodStartDate(newCurrentPeriod?.startDate);
  }, [periods]);

  function startNewPeriod(startDate) {
    setDialogStartDate(startDate);
    setDialogTitle('Set Period Dates');
    setIsOpen(true);
  }

  function findCurrentPeriod() {
    for (const periodId in periods) {
      const period = periods[periodId];
      if (!period.endDate) {
        return period;
      }
    }
  }

  function findPeriodById(periodId) {
    return periods[periodId];
  }

  function addEvents(dates, periodId, flowTypes, isNewPeriod) {
    const datesToAdd = dates.filter(date => {
      return !events.some(event => event.date === date);
    });
    const newEvents = datesToAdd.map((date) => (
      {
        date: date,
        title: `day-${uuidv4()}`,
        periodId: periodId,
        flowType: flowTypes[date] || null, // Set to null if not defined
      }
    ));

    setEvents((prevEvents) => [
      ...prevEvents,
      ...newEvents,
    ]);

    // TODO: Find events to delete and delete them

    const periodEntryData = {
      startDate: dates ? dates[0] : null,
      endDate: dates ? dates[dates.length - 1] : null,
      duration: dates.length,
      dailyEntries: dates.map(date => ({
        date: date,
        flowType: flowTypes[date] || null, // Set to null if not defined
      })),
      id: periodId
    };

    if (isNewPeriod) {
      const periodRecordId = periodTracker.createPeriodEntry(periodEntryData);
      // Edit the Period object in the state to contain the recordId
      setPeriods((prevPeriods) => ({
        ...prevPeriods,
        [periodId]: {
          ...prevPeriods[periodId],
          recordId: periodRecordId,
        },
      }));
    } else {
      const periodRecordId = periods[periodId].recordId;
      console.log("period Record ID", periodRecordId); // TODO: This is a promise
      periodTracker.editPeriodEntry(periodRecordId, periodEntryData);
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

  function onDialogClose(localStartDate, localEndDate, flowTypes) {
    setIsOpen(false);

    // Create new period
    if (!dialogPeriod) {
      console.log("Creating new period");
      const periodId = uuidv4();
      const newPeriod = {
        id: periodId,
        startDate: localStartDate,
        endDate: localEndDate,
        dailyEntries: calculatePeriodDays(localStartDate, localEndDate).map(date => ({
          date: date,
          flowType: flowTypes[date] || null,
        })),
      };
  
      setPeriods((prevPeriods) => ({
        ...prevPeriods,
        [periodId]: newPeriod,
      }));

      const days = calculatePeriodDays(localStartDate, localEndDate);
      const isNewPeriod = true;
      addEvents(days, periodId, flowTypes, isNewPeriod);
    } else {
      console.log("Editing existing period");
      // Update existing period
      const periodId = dialogPeriod.id;

      setPeriods((prevPeriods) => ({
        ...prevPeriods,
        [periodId]: {
          ...prevPeriods[periodId],
          startDate: localStartDate,
          endDate: localEndDate,
          dailyEntries: calculatePeriodDays(localStartDate, localEndDate).map(date => ({
            date: date,
            flowType: flowTypes[date] || null,
          })),
        }
      }));

      const days = calculatePeriodDays(localStartDate, localEndDate);
      // This needs to be updated to only add new events and remove old events
      // and edit the existing period DWN record
      const isNewPeriod = false;
      addEvents(days, periodId, flowTypes, isNewPeriod);
    }
  }

  const onPeriodControlChange = (date) => {
    if (date) {
      startNewPeriod(formatDate(date));
    } else {
      openModal("Current Period", currentPeriod['id']);
    }
  }

  const openModal = (eventTitle, periodId) => {
    const period = findPeriodById(periodId); // may be null
    setDialogPeriod(period);
    setDialogTitle(eventTitle);
    setIsOpen(true);
  }

  const openModalFromCalendar = (newContent) => {
    const event = newContent.event;
    const periodId = event.extendedProps?.periodId;
    openModal(event.title, periodId);
  }

  const handleDateClick = (info) => {
    startNewPeriod(formatDateForCalendar(info.date));
  };

  return (
    <div className="flex flex-col calendar-page">
      <FullCalendar
        selectable={true}
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        eventClick={openModalFromCalendar} // TODO: Fix existing modal to support editing period data or display a different modal
        eventContent={(info) => <EventItem info={info} />}
        initialView="dayGridMonth"
        events={events}
        aspectRatio={1}
      />
      <CurrentPeriodControl startDate={periodStartDate} onPeriodControlChange={onPeriodControlChange} />
      {isOpen && <PeriodDialog title={dialogTitle} period={dialogPeriod} startDate={dialogStartDate} onClose={onDialogClose} />}
    </div>
  );
}
