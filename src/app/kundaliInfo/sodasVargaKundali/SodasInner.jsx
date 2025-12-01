"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliStructure from '@/components/KundaliStructure';
import PlanetTable from "@/components/PlanetTable";
import KundaliHeader from '@/components/KundaliHeader';
import { computeD9Chart } from "@/lib/computeD9";
import NavamshaPlanetTable from '@/components/NavamshaPlanetTable'



export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)
    const params = useSearchParams();
    const router = useRouter();
    const [d9, setD9] = useState(null);
    const [selectedChart, setSelectedChart] = useState("लग्न / D1");

    const charts = [
        "लग्न / D1", "होरा / D2", "द्रेक्काण / D3", "चतुर्थांश / D4", "सप्तमांश / D7", "नवमांश / D9", "दशमांश / D10", "द्वादशांश / D12", "षोडशांश / D16", "विंशांश / D20", "चतुर्विंशांश(सिद्धांश) / D24", "सप्तविंशांश (भाम्स) / D27", "त्रिंशांश / D30", "खवेदांश / D40", "अक्षवेदांश / D45", "षष्ट्यांश / D60", " / Moon", " / Sun"
    ];

    const indexParam = params.get("index");

    useEffect(() => {
        async function load() {
            if (!indexParam) return;

            const idx = Number(indexParam);
            if (isNaN(idx) || idx < 0) return;

            const record = await loadKundaliByIndex(idx);
            if (!record) return;

            setKundali(record);

            // Compute and store D9
            const d9Chart = computeD9Chart(record.raw);
            setD9(d9Chart);
        }
        load();
    }, [indexParam, router]);

    return (
        <div className="p-2 overflow-hidden text-black" >
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="अन्य वर्ग-कुंडली"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                {/* Dropdown Selector */}
                <div className="flex justify-center my-4">
                    <select
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                        className="p-2 w-full h-15 rounded-3xl border border-gray-300 bg-linear-to-r from-[#FFE984] to-[#FFB111] text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yelloe-500 text-center"
                    >
                        {charts.map((chart) => (
                            <option key={chart} value={chart}>
                                {chart}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
                    {selectedChart === "लग्न / D1" && (
                        <>
                            <KundaliStructure kundali={kundali} title="लग्न कुंडली" />
                            <PlanetTable kundali={kundali} />
                        </>
                    )}

                    {selectedChart === "नवमांश / D9" && (
                        <>
                            <KundaliStructure kundali={d9} title="नवमांश कुंडली" />
                            <NavamshaPlanetTable d9={d9} />
                        </>
                    )}

                    {!["लग्न / D1", "नवमांश / D9"].includes(selectedChart) && (
                        <div className="p-10 text-center text-lg font-semibold">
                            {selectedChart} Chart Coming Soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
