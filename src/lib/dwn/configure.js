
export async function configureProtocol(protocolDefinition, web5, userDid) {
    const protocolUrl = protocolDefinition.protocol;

    const { protocols: localProtocols, status: localProtocolStatus } = await queryLocalProtocol(web5, protocolUrl);

    if (localProtocolStatus.code !== 200 || localProtocols.length === 0) {
        await installLocalProtocol(web5, protocolDefinition);
        console.log('Local protocol installed', protocolDefinition)
    }

    const { protocols: remoteProtocols, status: remoteProtocolStatus } = await queryRemoteProtocol(web5, userDid, protocolUrl);
    if (remoteProtocolStatus.code !== 200 || remoteProtocols.length === 0) {
        await installRemoteProtocol(web5, userDid, protocolDefinition);
        console.log('Remote protocol installed')
    }
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

