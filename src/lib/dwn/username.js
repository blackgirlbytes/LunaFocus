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

    async function createUsernameEntry(data) {
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

    async function fetchUsername() {
        const { records, status } = await web5.dwn.records.query({
            message: {
                filter: {
                    schema: 'https://luna-focus.vercel.app/usernameSchema'
                }
            }
        });

        if (status.code !== 200) {
            console.error('Failed to fetch period entries:', status);
            return [];
        }

        const entries = await Promise.all(records.map(async record => await record.data.json()));
        console.log('fetching username', username)
        return entries;
    }

    return {
        createUsernameEntry,
        fetchUsername
    };
};

export default Username;