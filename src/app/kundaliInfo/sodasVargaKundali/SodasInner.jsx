"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliStructure from '@/components/KundaliStructure';
import PlanetTable from "@/components/PlanetTable";
import KundaliHeader from '@/components/KundaliHeader';
import { computeD9Chart } from "@/lib/computeD9";
import NavamshaPlanetTable from '@/components/NavamshaPlanetTable'
import { computeD2Chart } from "@/lib/computeD2";
import HoraPlanetTable from "@/components/HoraPlanetTable";
import { computeD3Chart } from "@/lib/computeD3";
import DrekkanaPlanetTable from '@/components/DrekkanaPlanetTable'
import { getChandraData } from "@/lib/moonKundali";
import MoonKundaliStructure from "@/components/MoonKundaliStructure";
import { getSunData } from "@/lib/sunKundali";
import SunKundaliStructure from "@/components/SunKundaliStructure";
// import { computeD4Chart } from "@/lib/computeD4";
// import ChaturthamshaPlanetTable from '@/components/ChaturthamshaPlanetTable'
// import { computeD7Chart } from "@/lib/computeD7";
// import { computeD10Chart } from "@/lib/computeD10";
// import { computeD12Chart } from "@/lib/computeD12";
// import { computeD16Chart } from "@/lib/computeD16";
import { getHouseLordsWithPositions } from "../AstrologicalData";




export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)
    const params = useSearchParams();
    const router = useRouter();
    const [d2, setD2] = useState(null);
    const [d3, setD3] = useState(null);
    const [d4, setD4] = useState(null);
    const [d7, setD7] = useState(null);
    const [d9, setD9] = useState(null);
    const [d10, setD10] = useState(null);
    const [d12, setD12] = useState(null);
    const [d16, setD16] = useState(null);
    const [selectedChart, setSelectedChart] = useState("लग्न / D1");

    const charts = [
        "लग्न / D1", "होरा / D2", "द्रेक्काण / D3", "चतुर्थांश / D4", "सप्तमांश / D7", "नवमांश / D9", "दशमांश / D10", "द्वादशांश / D12", "षोडशांश / D16", "विंशांश / D20", "चतुर्विंशांश(सिद्धांश) / D24", "सप्तविंशांश (भाम्स) / D27", "त्रिंशांश / D30", "खवेदांश / D40", "अक्षवेदांश / D45", "षष्ट्यांश / D60", "चन्द्र / Moon", "सूर्य / Sun"
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

            const d2Chart = computeD2Chart(record.raw);
            setD2(d2Chart);

            const d3Chart = computeD3Chart(record.raw);
            setD3(d3Chart);

            // const d4Chart = computeD4Chart(record.raw);
            // setD4(d4Chart);

            // const d7Chart = computeD7Chart(record.raw);
            // setD7(d7Chart);

            const d9Chart = computeD9Chart(record.raw);
            setD9(d9Chart);

            // const d10Chart = computeD10Chart(record.raw);
            // setD10(d10Chart);

            // const d12Chart = computeD12Chart(record.raw);
            // setD12(d12Chart);

            // const d16Chart = computeD16Chart(record.raw);
            // setD16(d16Chart);
        }
        load();
    }, [indexParam, router]);

    console.log(kundali)

    const ascendantStr = kundali?.raw?.ascendant?.rashi;
    const ascendantNumber = kundali?.raw?.ascendant?.rashiIndex;

    const sunHousePosition = kundali?.raw?.planets?.Sun?.house;
    const moonHousePosition = kundali?.raw?.planets?.Moon?.house;
    const marsHousePosition = kundali?.raw?.planets?.Mars?.house;
    const mercuryHousePosition = kundali?.raw?.planets?.Mercury?.house;
    const jupiterHousePosition = kundali?.raw?.planets?.Jupiter?.house;
    const venusHousePosition = kundali?.raw?.planets?.Venus?.house;
    const saturnHousePosition = kundali?.raw?.planets?.Saturn?.house;
    const rahuHousePosition = kundali?.raw?.planets?.Rahu?.house;
    const ketuHousePosition = kundali?.raw?.planets?.Ketu?.house;


    // these are the positions of the planets in the kundali which i will use to find lagesh and other planets
    // const planetPositions = {
    //     Sun: sunHousePosition,
    //     Moon: moonHousePosition,
    //     Mars: marsHousePosition,
    //     Mercury: mercuryHousePosition,
    //     Jupiter: jupiterHousePosition,
    //     Venus: venusHousePosition,
    //     Saturn: saturnHousePosition,
    //     Rahu: rahuHousePosition,
    //     Ketu: ketuHousePosition
    // }

    // const laganesh = getHouseLordsWithPositions(ascendantNumber,planetPositions);

    // console.log(laganesh)

    if (!ascendantStr || !moonHousePosition) return <div className="p-4 text-white">Loading Kundali chandra data...</div>;
    if (!ascendantStr || !sunHousePosition) return <div className="p-4 text-white">Loading Kundali sun data...</div>;


    const sunData = getSunData(ascendantStr, sunHousePosition);
    const chandraData = getChandraData(ascendantStr, moonHousePosition);

    const sunZodiac = sunData.sunZodiac;
    const sunOffset = sunData.offset;
    const chandraMoonZodiac = chandraData.chandraMoonZodiac;
    const chandraOffset = chandraData.offset;


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

                    {selectedChart === "होरा / D2" && (
                        <>
                            <KundaliStructure kundali={d2} title="होरा कुंडली" />
                            <HoraPlanetTable d2={d2} />
                        </>
                    )}

                    {selectedChart === "द्रेक्काण / D3" && (
                        <>
                            <KundaliStructure kundali={d3} title="द्रेक्काण कुंडली" />
                            <DrekkanaPlanetTable d3={d3} />
                        </>
                    )}

                    {selectedChart === "चन्द्र / Moon" && (
                        <>
                            <MoonKundaliStructure ascendant={chandraMoonZodiac} sun={sunHousePosition} moon={moonHousePosition} mars={marsHousePosition} mercury={mercuryHousePosition} jupiter={jupiterHousePosition} venus={venusHousePosition} saturn={saturnHousePosition} rahu={rahuHousePosition} ketu={ketuHousePosition} moonOffset={chandraOffset} title="चन्द्र कुंडली" />
                            <PlanetTable kundali={kundali} />
                        </>
                    )}


                    {selectedChart === "सूर्य / Sun" && (
                        <>
                            <SunKundaliStructure ascendant={sunZodiac} sun={sunHousePosition} moon={moonHousePosition} mars={marsHousePosition} mercury={mercuryHousePosition} jupiter={jupiterHousePosition} venus={venusHousePosition} saturn={saturnHousePosition} rahu={rahuHousePosition} ketu={ketuHousePosition} sunOffset={sunOffset} title="सूर्य कुंडली" />
                            <PlanetTable kundali={kundali} />
                        </>
                    )}


                    {/* {selectedChart === "चतुर्थांश / D4" && (
                        <>
                            <KundaliStructure kundali={d4} title="चतुर्थांश कुंडली" />
                            <ChaturthamshaPlanetTable d4={d4} />
                        </>
                    )} */}

                    {!["लग्न / D1", "नवमांश / D9", "होरा / D2", "द्रेक्काण / D3", "चन्द्र / Moon", "सूर्य / Sun"].includes(selectedChart) && (
                        <div className="p-10 text-center text-lg font-semibold">
                            {selectedChart} Chart Coming Soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
