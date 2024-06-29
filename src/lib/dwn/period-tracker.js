import { periodTrackerProtocol } from '../periodTrackerProtocol';
import { configureProtocol } from './configure';

const requireParam = (param, missing) => {
  if (!param) throw new Error(`Cannot create a PeriodTracker without ${missing}!`);
};

const validateProtocol = (protocol) => {
  if (!protocol) throw new Error('Cannot create a PeriodTracker due to an invalid periodTrackerProtocol');
}

const PeriodTracker = async function (web5, userDid) {
  requireParam(web5, 'a Web5 instance');
  requireParam(userDid, 'a userDid');
  validateProtocol(periodTrackerProtocol);

  await configureProtocol(periodTrackerProtocol, web5, userDid);

  async function createPeriodEntry(data) {
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

  async function fetchAllPeriodEntries() {
    const { records, status } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: 'https://luna-focus.vercel.app/period-calendar/periodEntrySchema'
        }
      }
    });

    if (status.code !== 200) {
      console.error('Failed to fetch period entries:', status);
      return [];
    }

    const entries = await Promise.all(records.map(async record => await record.data.json()));
    console.log(entries)
    return entries;
  }

  async function sendAllPeriodEntries(recipientDid, senderDid) {
    const entries = await fetchAllPeriodEntries();

    // Loop through each entry and send it
    for (const entry of entries) {
      const entryObj = {
        ...entry,
        senderDid, // Add sender to the entry object
      };
      try {
        const { record, status } = await web5.dwn.records.create({
          data: entryObj,
          message: {
            protocol: periodTrackerProtocol.protocol,
            schema: 'https://luna-focus.vercel.app/period-calendar/periodEntrySchema',
            protocolPath: 'periodEntry',
            recipient: recipientDid,
          },
        });

        if (status.code !== 202) {
          console.error('Failed to send period entry:', status);
        } else {
          console.log('Period entry sent successfully:', record);
        }
        await record.send(recipientDid);
      } catch (error) {
        console.error('Error sending period entry:', error);
      }
    }
  }


  async function fetchEntriesFromSender(userDid) {
    const { records, status } = await web5.dwn.records.query({
      from: userDid,
      message: {
        filter: {
          schema: 'https://luna-focus.vercel.app/period-calendar/periodEntrySchema'
        }
      }
    });

    if (status.code !== 200) {
      console.error('Failed to fetch period entries:', status);
      return [];
    }

    const entries = await Promise.all(records.map(async record => await record.data.json()));
    console.log(entries)
    return entries;
  }

  return {
    createPeriodEntry,
    fetchAllPeriodEntries,
    sendAllPeriodEntries,
    fetchEntriesFromSender
  };
};

export default PeriodTracker;
