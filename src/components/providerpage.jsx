import PeriodTracker from '@/lib/dwn/period-tracker';
import { useWeb5 } from '@/context/Web5Context';
import { useState, useEffect } from 'react';

export function ProviderPage() {
    const [periodTracker, setPeriodTracker] = useState(null);
    const { web5, userDid } = useWeb5();
    const fakeDid = 'did:dht:cy1d8xntyiockcssgpfu5ey3rasyiunr667byx96yums7dohwj7o'; // Replace with actual user DID
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            if (web5 && userDid) {
                let tracker = await PeriodTracker(web5, userDid);
                setPeriodTracker(tracker);
            }
        };

        initialize();
    }, [web5, userDid]);

    useEffect(() => {
        const fetchAndSetEvents = async (periodTracker) => {
            const entries = await periodTracker.fetchEntriesFromSender(userDid);

            setEntries(entries);
        };

        if (periodTracker) {
            fetchAndSetEvents(periodTracker);
        }
    }, [periodTracker]);

    return (
        <div className="provider-display p-4 w-full max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Insights Shared with You</h1>
            <p className="mb-8 text-center">From: {fakeDid}</p>
            <div className="period-data mt-8 w-full">
                {entries.length === 0 ? (
                    <p className="text-center text-gray-500">No entries shared with you yet.</p>
                ) : (
                    entries.map((period) => (
                        <div key={period.id} className="period mb-4">
                            <p className="text-center">
                                Start Date: {period.startDate} | End Date: {period.endDate} | Duration: {period.duration} days
                            </p>
                            <div className="overflow-x-auto">
                                <table className="table w-full mt-2">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Flow Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {period.dailyEntries.map((entry, index) => (
                                            <tr key={entry.date} className="bg-white even:bg-gray-100">
                                                <th>{index + 1}</th>
                                                <td>{entry.date}</td>
                                                <td>{entry.flowType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
