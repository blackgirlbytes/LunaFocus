import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import { useState, useEffect } from "react";
import Period from "@/components/period"
import { PeriodDialog } from "@/components/period-dialog"
import { useWeb5 } from '@/context/Web5Context';

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
  const { web5, userDid } = useWeb5();

  useEffect(() => {
    if (web5 && userDid) {
      console.log("Web5 and userDid are available, configuring protocol...");
      configureProtocol(web5, userDid);
    }
  }, [web5, userDid]);


  const configureProtocol = async (web5, userDid) => {
    // if (!web5 || !userDid) return;
    console.log('installing protocol')
    const protocolDefinition = periodTrackerProtocol;
    const protocolUrl = protocolDefinition.protocol;

    const { protocols: localProtocols, status: localProtocolStatus } = await queryLocalProtocol(web5, protocolUrl);

    if (localProtocolStatus.code !== 200 || localProtocols.length === 0) {
      const result = await installLocalProtocol(web5, protocolDefinition);
      console.log({ result })
      console.log("Protocol installed locally");
    }

    const { protocols: remoteProtocols, status: remoteProtocolStatus } = await queryRemoteProtocol(web5, userDid, protocolUrl);
    if (remoteProtocolStatus.code !== 200 || remoteProtocols.length === 0) {
      const result = await installRemoteProtocol(web5, userDid, protocolDefinition);
      console.log({ result })
      console.log("Protocol installed remotely");
    }

  };

  const queryLocalProtocol = async (web5) => {
    return await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: "https://luna-focus.vercel.app/period-calendar",
        },
      },
    });
  };


  const queryRemoteProtocol = async (web5, userDid) => {
    return await web5.dwn.protocols.query({
      from: userDid,
      message: {
        filter: {
          protocol: "https://luna-focus.vercel.app/period-calendar",
        },
      },
    });
  };

  const installLocalProtocol = async (web5, protocolDefinition) => {
    return await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
  };

  const installRemoteProtocol = async (web5, userDid, protocolDefinition) => {
    const { protocol } = await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
    return await protocol.send(userDid);
  };


  const periodTrackerProtocol = {
    "protocol": "https://luna-focus.vercel.app/period-calendar",
    "published": true,
    "types": {
      "periodEntry": {
        "schema": "https://luna-focus.vercel.app/period-calendar/periodEntrySchema",
        "dataFormats": ["application/json"]
      }
    },
    "structure": {
      "periodEntry": {
        "$actions": [
          {
            "who": "anyone",
            "can": ["create"]
          },
          {
            "who": "author",
            "of": "periodEntry",
            "can": ["create", "read", "update", "delete"]
          },
          {
            "who": "recipient",
            "of": "periodEntry",
            "can": ["read"]
          }
        ]
      }
    }
  };


  async function createPeriodEntry(web5, userDid, data) {
    const { record, status } = await web5.dwn.records.create({
      data: data,
      message: {
        recipient: userDid,
        schema: 'https://luna-focus.vercel.app/period-calendar/periodEntrySchema',
        dataFormat: 'application/json',
        protocol: periodTrackerProtocol.protocol,
        protocolPath: 'periodEntry'
      }
    });

    if (status.code !== 202) {
      console.error('Failed to create period entry:', status);
    } else {
      console.log('Period entry created successfully:', record, await record.data.text());
    }
  }


  // TODO: Replace with data from the modal submission
  function addEvent(title, date) {
    console.log("Adding a specific event");
    console.log("events: ", events, title, date);

    const newEvent = {
      date: date,
      title: title,
    };

    setEvents([
      ...events,
      newEvent
    ]);

    console.log("events: ", events);

    const periodEntryData = {
      startDate: date,
      endDate: date,
      duration: 1,
      dailyEntries: [
        {
          date: date,
          flowType: "medium"
        }
      ]
    };

    createPeriodEntry(web5, userDid, periodEntryData);
  }


  function addRandomEvent(title) {
    console.log("Adding a random event");
    console.log("events: ", events);

    const newEvent = {
      date: formatDateForCalendar(new Date()),
      title: title,
    };

    setEvents([
      ...events,
      newEvent
    ]);

    console.log("events: ", events);

    const periodEntryData = {
      startDate: newEvent.date,
      endDate: newEvent.date,
      duration: 1,
      dailyEntries: [
        {
          date: newEvent.date,
          flowType: "medium"
        }
      ]
    };

    createPeriodEntry(web5, userDid, periodEntryData);
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

    const periodEntryData = {
      startDate: localStartDate,
      endDate: localEndDate,
      duration: (new Date(localEndDate) - new Date(localStartDate)) / (1000 * 60 * 60 * 24) + 1,
      dailyEntries: []
    };

    let currentDate = new Date(localStartDate);
    const endDate = new Date(localEndDate);
    while (currentDate <= endDate) {
      periodEntryData.dailyEntries.push({
        date: formatDateForCalendar(currentDate),
        flowType: "medium"
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    addEvent("Period Entry", localEndDate);
    createPeriodEntry(web5, userDid, periodEntryData);
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