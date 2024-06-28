import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState, useMemo } from "react";
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
    const fetchPeriods = async (periodTracker) => {
      const fetchedPeriods = await periodTracker.fetchAllPeriodEntries();
      setPeriods(fetchedPeriods);
      setEvents(Object.values(fetchedPeriods)?.flatMap(periodToCalendarEvents));
    };

    if (periodTracker) {      
      fetchPeriods(periodTracker);
    }
  }, [periodTracker]);

  const periodToCalendarEvents = (period) => {
    if (!period.dailyEntries) return [];
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
    const updateEvents = () => {
      console.log('setEvents')
      setEvents(Object.values(periods)?.flatMap(periodToCalendarEvents));
      const newCurrentPeriod = findCurrentPeriod();
      console.log('newCurrentPeriod', newCurrentPeriod)
      setCurrentPeriod(newCurrentPeriod);
      console.log('set current period...');
      setPeriodStartDate(newCurrentPeriod?.startDate);
      console.log('setting period start date...');
  
    }

    updateEvents();
  }, [])
  
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

  function findCurrentPeriod() {
    Object.values(periods).find(period => !period.endDate);
  }

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

  function addOrUpdatePeriod(localStartDate, localEndDate, flowTypes) {
    const periodId = dialogPeriod?.id || uuidv4();
    const days = calculatePeriodDays(localStartDate, localEndDate);
    setPeriods((prevPeriods) => ({
      ...prevPeriods,
      [periodId]: {
        ...prevPeriods[periodId],
        id: periodId,
        startDate: localStartDate,
        endDate: localEndDate,
        dailyEntries: days.map(date => ({
          date: date,
          flowType: flowTypes[date] || null,
        })),
      }
    }));

    addOrUpdateEvents(days, periodId, flowTypes);
  }

  function onClose(...args) {
    addOrUpdatePeriod(...args);
    setIsOpen(false);
  }

  const openModal = (eventTitle, period) => {
    // if there is no date then set the start date to the date clicked
    console.log('setting dialog period to: ', period)
    setDialogPeriod(period);
    setDialogTitle(eventTitle);
    setIsOpen(true);
  }

  const onEventClick = ({event}) => {
    console.log('[onEventClick] event: ', event)
    const periodId = event.extendedProps?.periodId;
    console.log('[onEventClick] periodId: ', periodId)
    openModal('Updating Period Information', periods[periodId]);
  }

  const onDateClick = (info) => {
    console.log('onDateClick: info ', info)
    const potentialNewPeriod = { startDate: formatDate(info.date) }
    openModal('New Period', potentialNewPeriod);
    // startNewPeriod(formatDateForCalendar(info.date));
  };


  const onPeriodControlChange = (date) => {
    if (date) {
      startNewPeriod(formatDate(date));
    } else {
      openModalFromButton(currentPeriod.id);
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
      <CurrentPeriodControl startDate={periodStartDate} onPeriodControlChange={onPeriodControlChange} />
      {isOpen && <PeriodDialog dialogTitle={dialogTitle} period={dialogPeriod} onClose={onClose} />}
    </div>
  );
}
