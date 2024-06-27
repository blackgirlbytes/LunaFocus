import { periodTrackerProtocol } from './periodTrackerProtocol';

export async function configureProtocol(web5, userDid) {
    const protocolDefinition = periodTrackerProtocol;
    const protocolUrl = protocolDefinition.protocol;

    const { protocols: localProtocols, status: localProtocolStatus } = await queryLocalProtocol(web5, protocolUrl);

    if (localProtocolStatus.code !== 200 || localProtocols.length === 0) {
        await installLocalProtocol(web5, protocolDefinition);
        console.log('Local protocol installed')
    }

    const { protocols: remoteProtocols, status: remoteProtocolStatus } = await queryRemoteProtocol(web5, userDid, protocolUrl);
    if (remoteProtocolStatus.code !== 200 || remoteProtocols.length === 0) {
        await installRemoteProtocol(web5, userDid, protocolDefinition);
        console.log('Remote protocol installed')
    }
}

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
async function queryLocalProtocol(web5, protocolUrl) {
    return await web5.dwn.protocols.query({
        message: {
            filter: {
                protocol: protocolUrl,
            },
        },
    });
}

async function queryRemoteProtocol(web5, userDid, protocolUrl) {
    return await web5.dwn.protocols.query({
        from: userDid,
        message: {
            filter: {
                protocol: protocolUrl,
            },
        },
    });
}

async function installLocalProtocol(web5, protocolDefinition) {
    return await web5.dwn.protocols.configure({
        message: {
            definition: protocolDefinition,
        },
    });
}

async function installRemoteProtocol(web5, userDid, protocolDefinition) {
    const { protocol } = await web5.dwn.protocols.configure({
        message: {
            definition: protocolDefinition,
        },
    });
    return await protocol.send(userDid);
}
