import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import CurrentPeriodControl from "@/components/current-period-control";
import { PeriodDialog } from "@/components/period-dialog";
import { v4 as uuidv4 } from 'uuid';
import { formatDate } from "@/lib/utils";
import { configureProtocol, createPeriodEntry } from '@/lib/dwn-actions';
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

  useEffect(() => {
    const installProtocol = async () => {
      if (web5 && userDid) {
        configureProtocol(web5, userDid);
      }
    };

    installProtocol();
  }, [web5, userDid]);

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
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    let start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);
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

  function addEvents(dates, periodId) {
    const newEvents = dates.map((date) => {
      return {
        date: date,
        title: `day-${uuidv4()}`,
        periodId: periodId,
      };
    });

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
      })),
      id: periodId
    };

    createPeriodEntry(web5, userDid, periodEntryData);
  }

  const EventItem = ({ info }) => {
    const { event } = info;
    return (
      <div>
        <span className="dot"></span>
      </div>
    );
  };

  function onDialogClose(localStartDate, localEndDate) {
    setIsOpen(false);
    const periodId = dialogPeriod.id;

    setPeriods((prevPeriods) => ({
      ...prevPeriods,
      [periodId]: {
        ...prevPeriods[periodId],
        startDate: localStartDate,
        endDate: localEndDate,
      }
    }));

    const days = calculatePeriodDays(localStartDate, localEndDate);
    addEvents(days, periodId);
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
        eventClick={openModalFromCalendar}
        eventContent={(info) => <EventItem info={info} />}
        initialView="dayGridMonth"
        events={events}
        aspectRatio={1}
      />
      <CurrentPeriodControl startDate={periodStartDate} onPeriodControlChange={onPeriodControlChange} />
      {isOpen && <PeriodDialog title={dialogTitle} period={dialogPeriod} onClose={onDialogClose} />}
    </div>
  );
}
