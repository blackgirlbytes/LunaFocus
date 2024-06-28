// context/UserContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWeb5 } from '@/context/Web5Context';
import Username from '@/lib/dwn/username';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { web5, userDid } = useWeb5();
  const [currentUsername, setCurrentUsername] = useState('');
  const fetchUsername = useCallback(async () => {
    if (web5 && userDid) {
        try {
            let userModule = await Username(web5, userDid);
            const fetchedUsername = await userModule.fetchUsername();
            setCurrentUsername(fetchedUsername);
            return fetchedUsername;
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    }
    else {
      console.log('missing web5 or userDid')
    }
  }, [web5, userDid])

  const storeUsername = useCallback(async (username) => {
    if (web5 && userDid) {
        try {
            let userModule = await Username(web5, userDid);
            await userModule.createUsernameEntry({ username });
            setCurrentUsername(username);
        } catch (error) {
            console.error('Error creating username:', error);
        }
    }
    else {
      console.log('missing web5 or userDid')
    }
  }, [web5, userDid]);
  
  useEffect(() => {
    if (!currentUsername) {
      fetchUsername();
    }
  }, [web5, userDid]);

  return (
    <UserContext.Provider value={{ currentUsername, setCurrentUsername, storeUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

