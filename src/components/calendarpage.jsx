import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import CurrentPeriodControl from "@/components/current-period-control";
import { PeriodDialog } from "@/components/period-dialog";
import { v4 as uuidv4 } from 'uuid';
import PeriodTracker from '@/lib/dwn/period-tracker';
import { formatDate, stringToDate, toUTCDate } from "@/lib/utils";
import { useWeb5 } from '@/context/Web5Context';

const formatDateForCalendar = (date) => date.toISOString().split('T')[0];

export function CalendarPage() {
  const [periodStartDate, setPeriodStartDate] = useState(null);
  const [dialogTitle, setDialogTitle] = useState('Dialog');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogPeriod, setDialogPeriod] = useState(null);
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

      const newPeriods = entries.flatMap(entry => {
        return {
          id: entry.id,
          startDate: entry.startDate,
          endDate: entry.endDate,
        }
      });
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
    const periodId = uuidv4();
    const newPeriod = {
      id: periodId,
      startDate: startDate,
      endDate: null,
      dailyEntries: [],
    };

    setPeriods((prevPeriods) => ({
      ...prevPeriods,
      [periodId]: newPeriod,
    }));

    setDialogPeriod(newPeriod);
    setDialogTitle('Set Period Dates');
    setIsOpen(true);
  }

  function calculatePeriodDays(startDate, endDate) {
    // stringToDate ensures these match the day cell date in the UI
    const start = stringToDate(startDate);
    const end = stringToDate(endDate);
    const days = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      days.push(formatDate(d));
    }
    return days;
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

  function addEvents(dates, periodId, flowTypes) {
    const newEvents = dates.map((date) => ({
      date: date,
      title: `day-${uuidv4()}`,
      periodId: periodId,
      flowType: flowTypes[date] || null, // Set to null if not defined
    }));

    setEvents((prevEvents) => [
      ...prevEvents,
      ...newEvents,
    ]);

    const periodEntryData = {
      startDate: periods[periodId].startDate,
      endDate: dates[dates.length - 1],
      duration: dates.length,
      dailyEntries: dates.map(date => ({
        date: date,
        flowType: flowTypes[date] || null, // Set to null if not defined
      })),
      id: periodId
    };

    periodTracker.createPeriodEntry(periodEntryData);
  }

  const DayCell = ({ info }) => {
    // Check if date overlaps with a period
    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      const dayCellDate = info.date;
      const startDate = stringToDate(period.startDate);
      const endDate = stringToDate(period.endDate);
      if (dayCellDate >= startDate && dayCellDate <= endDate) {
        return (<div></div>);
      }
    }
    return (
      <div>
        {info.dayNumberText}
      </div>
    );
  }

  const EventItem = ({ info }) => {
    const { event } = info;
    const flowType = event.extendedProps.flowType;
    const date = toUTCDate(event.start);
    const day = date.getDate();
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
    addEvents(days, periodId, flowTypes);
  }

  const onPeriodControlChange = (date) => {
    if (date) {
      startNewPeriod(formatDate(date));
    } else {
      openModalFromButton(currentPeriod.id);
    }
  }

  const openModal = (eventTitle, periodId) => {
    const period = findPeriodById(periodId);
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
        dayCellContent={(info) => <DayCell info={info} />}
        events={events}
        aspectRatio={1}
      />
      <CurrentPeriodControl startDate={periodStartDate} onPeriodControlChange={onPeriodControlChange} />
      {isOpen && <PeriodDialog title={dialogTitle} period={dialogPeriod} onClose={onDialogClose} />}
    </div>
  );
}
