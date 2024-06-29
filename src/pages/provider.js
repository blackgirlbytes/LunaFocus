import React, { useState } from 'react'; // Step 1
import { ProviderPage } from "@/components/providerpage";
import { Stats } from "@/components/statspage";
import { useWeb5 } from '@/context/Web5Context';

export default function Provider() {
    const { userDid } = useWeb5();
    const providerDid = userDid;
    const [copySuccess, setCopySuccess] = useState(''); // Step 2

    const copyProviderDidToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(providerDid);
            setCopySuccess('Provider DID copied to clipboard!');
            setTimeout(() => setCopySuccess(''), 3000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            setCopySuccess('Failed to copy DID');
            setTimeout(() => setCopySuccess(''), 3000);
        }
    };

    return (
        <main className="flex flex-col items-center p-4">
            <ProviderPage />
            <div className="w-full max-w-3xl mt-8">
                <Stats />
            </div>
            <button className="btn btn-primary" onClick={copyProviderDidToClipboard}>
                Copy DID
            </button>
            {copySuccess && <div className="mt-2 text-sm text-green-500">{copySuccess}</div>} {/* Step 4 */}
        </main>
    );
}