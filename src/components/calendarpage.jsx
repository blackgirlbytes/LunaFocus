import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState, useMemo } from "react";
import CurrentPeriodControl from "@/components/current-period-control";
import { PeriodDialog } from "@/components/period-dialog";
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from "@/lib/utils";
import { usePeriods } from '@/context/PeriodContext';

export function CalendarPage() {
  const [dialogTitle, setDialogTitle] = useState('Dialog');
  const [isOpen, setIsOpen] = useState(false);
  const [dialogPeriod, setDialogPeriod] = useState(null);
  const [events, setEvents] = useState([]);
  const { periods, findCurrentPeriod, addOrUpdatePeriod } = usePeriods();


  const periodToCalendarEvents = (period) => {
    if (!period.dailyEntries) return [];
    return period.dailyEntries.map(day => ({
      date: day.date,
      title: `day-${uuidv4()}`,
      periodId: period.id,
      flowType: day.flowType,
    }));
  }

  useEffect(() => {
    const updateEvents = () => {
      const newEvents =  Object.values(periods)?.flatMap(periodToCalendarEvents)
      setEvents(newEvents);
    }

    updateEvents();
  }, [periods])
  

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
    return (
      <div>
        <div className={"dot flex flex-col justify-center justify-items-center " + flowType}></div>
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
