import React from 'react';
import PeriodTracker from '@/lib/dwn/period-tracker';
import { useWeb5 } from '@/context/Web5Context';


const ShareDataDialog = ({ recipientDid, setRecipientDid, handleSubmit }) => {
    const { web5, userDid } = useWeb5(); // Assuming web5 instance is available in the same context

    async function shareData(recipientDid) {
        // Initialize PeriodTracker with the web5 instance and userDid
        const tracker = await PeriodTracker(web5, userDid);
        // Now you can call sendAllPeriodEntries on the tracker object
        await tracker.sendAllPeriodEntries(recipientDid, userDid);
    }

    return (
        <dialog id="share_data_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Share Your Data</h3>
                <form onSubmit={(e) => { e.preventDefault(); shareData(recipientDid); }}>
                    <label htmlFor="recipientDid" className="block mb-2">Provider DID</label>
                    <input
                        id="recipientDid"
                        type="text"
                        value={recipientDid}
                        onChange={(e) => setRecipientDid(e.target.value)}
                        required
                        className="input input-bordered w-full mb-4"
                    />
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary">Share Data</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button className="btn">Close</button>
            </form>
        </dialog>
    );
};

export default ShareDataDialog;