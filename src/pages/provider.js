// src/pages/provider.js
import { ProviderPage } from "@/components/providerpage";
import { Stats } from "@/components/statspage";

export default function Provider() {
    return (
        <main className="flex flex-col items-center p-4">
            <ProviderPage />
            <div className="w-full max-w-3xl mt-8">
                <Stats />
            </div>
        </main>
    );
}
