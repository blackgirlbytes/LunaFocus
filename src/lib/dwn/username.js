import { userProtocol } from './userProtocol';
import { configureProtocol } from './configure';

const requireParam = (param, missing) => {
    if (!param) throw new Error(`Cannot create a username without ${missing}!`);
};

const validateProtocol = (protocol) => {
    console.log(protocol)
    if (!protocol) throw new Error('Cannot create a username due to an invalid userProtocol');
}

const Username = async function (web5, userDid) {
    requireParam(web5, 'a Web5 instance');
    requireParam(userDid, 'a userDid');
    validateProtocol(userProtocol);

    await configureProtocol(userProtocol, web5, userDid);

    async function createOrUpdateUsernameEntry(data) {
        const records = await fetchUsernameRecords();

        console.log('Records are ', records);

        if (records.length > 0) {
            const entry = await records[0];
            // Get the record
            const { record } = await web5.dwn.records.read({
                message: {
                filter: {
                    recordId: entry.id
                }
                }
            });
            const {status} = await record.update({ data: data });
            console.log(entry)
            console.log('fetching username', entry);
            return entry.username;
        } else {
            const { record, status } = await web5.dwn.records.create({
                data: data,
                message: {
                    recipient: userDid,
                    schema: 'https://luna-focus.vercel.app/usernameSchema',
                    dataFormat: 'application/json',
                    protocol: userProtocol.protocol,
                    protocolPath: 'username'
                }
            });

            if (status.code !== 202) {
                console.error('Failed to create period entry:', status);
            } else {
                console.log('Username entry created successfully:', record, await record.data.text());
            }
        }
    }

    async function fetchUsername() {
        const records = await fetchUsernameRecords();

        console.log('Records are ', records);

        if (records.length > 0) {
            const entry = await records[0].data.json();
            console.log(entry)
            console.log('fetching username', entry);
            return entry.username;
        } else {
            console.log('no username found');
        }
    }

    async function fetchUsernameRecords() {

        console.log('HereHereHere ');

        const { records, status } = await web5.dwn.records.query({
            message: {
                filter: {
                    schema: 'https://luna-focus.vercel.app/usernameSchema'
                }
            }
        });

        console.log('Status code is ', status.code);

        if (status.code !== 200) {
            console.error('Failed to fetch user entries:', status);
            return [];
        } else {
            console.log('Fetched user records:', records);

            return records;
        }
    }

    return {
        createOrUpdateUsernameEntry,
        fetchUsername,
        fetchUsernameRecords
    };
};

export default Username;
