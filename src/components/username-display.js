import { useEffect, useState } from 'react';
import { useWeb5 } from '@/context/Web5Context';
import Username from '@/lib/dwn/username';

export function UsernameDisplay() {
    const { web5, userDid } = useWeb5();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            if (web5 && userDid) {
                try {
                    let userModule = await Username(web5, userDid);
                    const fetchedUsername = await userModule.fetchUsername();
                    setUsername(fetchedUsername);
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
            }
        };

        fetchUsername();
    }, [web5, userDid]);

    return (
        <div className="p-5">
            <h1 className="text-5xl font-bold">Hi, {username} 👋 </h1>
        </div>
    );
}
