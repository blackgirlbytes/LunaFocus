import React from 'react';

const ShareDataDialog = ({ providerDid, setProviderDid, handleSubmit }) => {
    return (
        <dialog id="share_data_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Share Your Data</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="providerDid" className="block mb-2">Provider DID</label>
                    <input
                        id="providerDid"
                        type="text"
                        value={providerDid}
                        onChange={(e) => setProviderDid(e.target.value)}
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
