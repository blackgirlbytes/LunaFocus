// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useWeb5 } from '@/context/Web5Context';
import Username from '@/lib/dwn/username';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { web5, userDid, isWeb5Connected } = useWeb5();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(username ? false : true);
  const fetchUsername = async () => {
    if (web5 && userDid) {
        try {
            let userModule = await Username(web5, userDid);
            const fetchedUsername = await userModule.fetchUsername();
            setUsername(fetchedUsername);
            setIsLoading(false);
            return fetchedUsername;
        } catch (error) {
            console.error('Error fetching username:', error);
            setIsLoading(false);
        }
    }
    else {
      console.log('missing web5 or userDid')
    }
  };
  
  useEffect(() => {
    if (!username && isWeb5Connected) {
      fetchUsername();
    }
  }, [web5, userDid, isWeb5Connected]);

  return (
    <UserContext.Provider value={{ username, setUsername, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

