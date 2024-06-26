import { createContext, useContext, useState, useEffect } from 'react';
import { Web5 } from '@web5/api';

const Web5Context = createContext();

export const Web5Provider = ({ children }) => {
    const [web5, setWeb5] = useState(null);
    const [userDid, setUserDid] = useState(null);

    useEffect(() => {
        const connectWeb5 = async () => {
            try {
                const { web5, did: userDid } = await Web5.connect({});
                setWeb5(web5);
                setUserDid(userDid);
                console.log('Web5 connected', web5, userDid);
            } catch (error) {
                console.error('Failed to connect to Web5:', error);
            }
        };

        connectWeb5();
    }, []);

    return (
        <Web5Context.Provider value={{ web5, userDid }}>
            {children}
        </Web5Context.Provider>
    );
};

export const useWeb5 = () => {
    return useContext(Web5Context);
};