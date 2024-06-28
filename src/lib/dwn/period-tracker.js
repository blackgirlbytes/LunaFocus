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
    } else {
        console.log('Period entry created successfully:', record, await record.data.text());
    }
  }

  async function updatePeriodEntry(updatedPeriod) {
    // Get the record
    const { record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: updatedPeriod.recordId
        }
      }
    });

    const toWrite = {...updatedPeriod};
    delete toWrite.recordId; // Don't include the recordId in the data to write
    const {status} = await record.update({ data: updatedPeriod });
    console.log('[updatePeriodEntry] update status: ', status);
  }

  async function tryLookupEntry({id}) {
    console.log('trying to lookup entry for id: ', id);
    try {
      const { record } = await web5.dwn.records.read({
        message: {
            filter: {
                recordId: id,
            }
        }
      });
      console.log(`[${id}] record: `, record);
      const data = await record.data.json();
      console.log(`[${id}] data: `, data);
    } catch (e) {
      console.error(`caught error for ${id}: `, e)
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
  
    const entries = await Promise.all(records.map(async record => {
      const data = await record.data.json()
      return {...data, recordId: record.id};
    }));
    console.log("entries: ", entries)
    console.log("record ids: ", records.map(record => record.id))
    await entries.forEach(tryLookupEntry)
    await records.forEach(tryLookupEntry)
    return entries;
  }

  return {
    createPeriodEntry,
    updatePeriodEntry,
    fetchAllPeriodEntries
  };
};

export default PeriodTracker;
