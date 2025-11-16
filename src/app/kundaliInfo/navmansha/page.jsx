"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { computeD9Chart } from "@/lib/computeD9";
import KundaliStructure from "@/components/KundaliStructure";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import NavamshaPlanetTable from '@/components/NavamshaPlanetTable'


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
            <div className="rounded-3xl overflow-hidden mb-4">
                <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center">
                    <img
                        src="/images/kundaliHead.png"
                        className={`${isSideOpen ? 'rotate-180' : ''} transition-all duration-300 w-12 brightness-0`}
                        onClick={() => setIsSideOpen(!isSideOpen)}
                    />
                    <span className="bg-linear-to-l from-[#F26A20]/50 to-red-500 bg-clip-text text-transparent text-xl">
                        नवमांश कुंडली
                    </span>
                </div>
            </div>

            {/* Keep panel mounted always */}
            <div
                className={`max-md:block hidden h-screen w-70 bg-black absolute z-20 rounded-3xl p-3
            transition-all duration-300 delay-150 top-2 ${isSideOpen ? 'left-2' : '-left-80'}`}
            >
                <img
                    src="/images/kundaliHead.png"
                    className={`${isSideOpen ? 'rotate-180' : ''} transition-all duration-300 w-12 brightness-0 invert-100`}
                    onClick={() => setIsSideOpen(!isSideOpen)}
                />
                <div className="w-full text-white mt-5 text-lg" onClick={() => setIsSideOpen(!isSideOpen)}>
                    <div className="border-b-2 pb-2">
                        <Link href={`/kundaliInfo?index=${indexParam}`} >
                            लग्न कुंडली
                        </Link>
                    </div>
                    <div className="border-b-2 py-2">
                        <Link href={`/kundaliInfo/navmansha?index=${indexParam}`}>
                            नवमांश कुंडली
                        </Link>
                    </div>
                    <div className="border-b-2 py-2">
                        सामान्य परिचय
                    </div>
                    <div className="border-b-2 py-2">
                        फलादेश
                    </div>
                    <div className="border-b-2 py-2">
                        महादशा
                    </div>
                    <div className="border-b-2 py-2">
                        दोष
                    </div>
                    <div className="border-b-2 py-2">
                        रत्न
                    </div>
                    <div className="border-b-2 py-2">
                        उपाय
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10 text-black overflow-hidden">
                <KundaliStructure kundali={d9} title="नवमांश कुंडली" />
                <NavamshaPlanetTable d9={d9} />
            </div>
        </div>
    );
}
