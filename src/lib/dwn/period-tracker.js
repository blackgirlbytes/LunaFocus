import { periodTrackerProtocol } from '../periodTrackerProtocol';

export async function createPeriodEntry(web5, userDid, data) {
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

export async function fetchAllPeriodEntries(web5) {
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