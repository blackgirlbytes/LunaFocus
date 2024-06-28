// context/Web5Context.js
import { createContext, useContext, useState, useEffect } from 'react';
import { Web5 } from '@web5/api';

const Web5Context = createContext();

export const Web5Provider = ({ children }) => {
  const [web5, setWeb5] = useState(null);
  const [isWeb5Connected, setIsWeb5Connected] = useState(false);
  const [userDid, setUserDid] = useState(null);

  useEffect(() => {
    const connectWeb5 = async () => {
      try {
        const { web5, did: userDid } = await Web5.connect({sync: '2s'});
        setWeb5(web5);
        setUserDid(userDid);
        setIsWeb5Connected(true);
        console.log('Web5 connected', web5, userDid);
      } catch (error) {
        console.error('Error connecting to Web5', error);
      }
    };
    connectWeb5();
  }, []);

  return (
    <Web5Context.Provider value={{ web5, userDid, isWeb5Connected }}>
      {children}
    </Web5Context.Provider>
  );
};

export const useWeb5 = () => {
  return useContext(Web5Context);
};
