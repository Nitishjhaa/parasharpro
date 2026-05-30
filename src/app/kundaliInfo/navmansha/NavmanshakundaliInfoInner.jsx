"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { computeD9Chart } from "@/lib/computeD9";
import KundaliStructure from "@/components/KundaliStructure";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader'
import NavamshaPlanetTable from '@/components/D9PlanetTable'


export default function Page() {
    const [kundali, setKundali] = useState(null);
    const [d9, setD9] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)


    const params = useSearchParams();
    const router = useRouter();
    const indexParam = params.get("index");

    useEffect(() => {
        async function load() {
            if (!indexParam) return;

            const idx = Number(indexParam);
            if (isNaN(idx) || idx < 0) return;

            const record = await loadKundaliByIndex(idx);
            if (!record) return;

            // Store original kundali
            setKundali(record.raw);

            // Compute and store D9
            const d9Chart = computeD9Chart(record.raw);
            setD9(d9Chart);
        }

        load();
    }, [indexParam]);

    // Show loading only until BOTH kundali and d9 are ready
    if (!kundali || !d9) {
        return <div className="p-4 text-white">Loading...</div>;
    }

    return (
        <div className="p-2">
            <KundaliHeader
                title="नवमांश कुंडली"
                indexParam={indexParam}
                isSideOpen={isSideOpen}
                setIsSideOpen={setIsSideOpen}
            />

            <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10 text-black overflow-hidden">
                <KundaliStructure kundali={d9} title="नवमांश कुंडली" />
                <NavamshaPlanetTable d9={d9} />
            </div>
        </div>
    );
}
