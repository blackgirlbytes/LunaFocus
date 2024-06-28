import { periodTrackerProtocol } from '../periodTrackerProtocol';
import { configureProtocol } from './configure';

const requireParam = (param, missing) => { 
  if (!param) throw new Error(`Cannot create a PeriodTracker without ${missing}!`) ;
};

const validateProtocol = (protocol) => {
  if (!protocol) throw new Error('Cannot create a PeriodTracker due to an invalid periodTrackerProtocol');
}

const PeriodTracker = async function(web5, userDid) {
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
        return null;
    } else {
        console.log('Period entry created successfully:', record, record.id, await record.data.text());
        return record.id;
    }
  }

  async function editPeriodEntry(recordId, data) {
    // Fetch the corresponding period record
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

    // Find the record
    await Promise.all(records.map(async record => {
      const dataJson = await record.data.json();
    }));
    console.log(records, records[0].id, recordId);
    const record = records.find(record => record.id === recordId);
    if (!record) {
        console.error('Failed to find period entry:', recordId);
        return null;
    }
  
    // Edit the record
    const { editStatus } = await record.update({ data: data });
    if (editStatus.code !== 202) {
        console.error('Failed to edit period entry:', editStatus);
        return null;
    } else {
        console.log('Period entry edited successfully:', record, record.id, await record.data.text());
        return record.id;
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

    console.log("fetchAllPeriodEntries records: ", records);
  
    const entries = await Promise.all(records.map(async record => {
      const dataJson = await record.data.json();
      const recordId = await record.id;
      console.log("recordId: ", recordId);
      dataJson['recordId'] = recordId;
      return dataJson;
    }));
    console.log(entries)
    return entries;
  }

  return {
    createPeriodEntry,
    editPeriodEntry,
    fetchAllPeriodEntries
  };
};

export default PeriodTracker;
