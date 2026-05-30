"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliStructure from '@/components/KundaliStructure';
import PlanetTable from "@/components/PlanetTable";
import KundaliHeader from '@/components/KundaliHeader';
import { computeD9Chart } from "@/lib/computeD9";
import D9PlanetTable from '@/components/D9PlanetTable'
import { computeD2Chart } from "@/lib/computeD2";
import D2PlanetTable from "@/components/D2PlanetTable";
import { computeD3Chart } from "@/lib/computeD3";
import D3PlanetTable from '@/components/D3PlanetTable'
import { getChandraData } from "@/lib/moonKundali";
import MoonKundaliStructure from "@/components/MoonKundaliStructure";
import { getSunData } from "@/lib/sunKundali";
import SunKundaliStructure from "@/components/SunKundaliStructure";
import { computeD4Chart } from "@/lib/computeD4";
import ChaturthamshaPlanetTable from '@/components/ChaturthamshaPlanetTable';
import { computeD7Chart } from "@/lib/computeD7";
import D7PlanetTable from "@/components/D7PlanetTable";
import { computeD10Chart } from "@/lib/computeD10";
import D10PlanetTable from "@/components/D10PlanetTable";
import { computeD12Chart } from "@/lib/computeD12";
import D12PlanetTable from "@/components/D12PlanetTable";
import { computeD16Chart } from "@/lib/computeD16";
import D16PlanetTable from "@/components/D16PlanetTable";
import { computeD20Chart } from "@/lib/computeD20";
import D20PlanetTable from "@/components/D20PlanetTable";
import { computeD24Chart } from "@/lib/computeD24";
import D24PlanetTable from "@/components/D24PlanetTable";
import { computeD27Chart } from "@/lib/computeD27";
import D27PlanetTable from "@/components/D27PlanetTable";
import { computeD30Chart } from "@/lib/computeD30";
import D30PlanetTable from "@/components/D30PlanetTable";
import { computeD40Chart } from "@/lib/computeD40";
import D40PlanetTable from "@/components/D40PlanetTable";
import { computeD45Chart } from "@/lib/computeD45";
import D45PlanetTable from "@/components/D45PlanetTable";
import { computeD60Chart } from "@/lib/computeD60";
import D60PlanetTable from "@/components/D60PlanetTable";

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
    const [d20, setD20] = useState(null);
    const [d24, setD24] = useState(null);
    const [d27, setD27] = useState(null);
    const [d30, setD30] = useState(null);
    const [d40, setD40] = useState(null);
    const [d45, setD45] = useState(null);
    const [d60, setD60] = useState(null);
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

            const d4Chart = computeD4Chart(record.raw);
            setD4(d4Chart);

            const d7Chart = computeD7Chart(record.raw);
            setD7(d7Chart);

            const d9Chart = computeD9Chart(record.raw);
            setD9(d9Chart);

            const d10Chart = computeD10Chart(record.raw);
            setD10(d10Chart);

            const d12Chart = computeD12Chart(record.raw);
            setD12(d12Chart);

            const d16Chart = computeD16Chart(record.raw);
            setD16(d16Chart);

            const d20Chart = computeD20Chart(record.raw);
            setD20(d20Chart);

            const d24Chart = computeD24Chart(record.raw);
            setD24(d24Chart);

            const d27Chart = computeD27Chart(record.raw);
            setD27(d27Chart);

            const d30Chart = computeD30Chart(record.raw);
            setD30(d30Chart);

            const d40Chart = computeD40Chart(record.raw);
            setD40(d40Chart);

            const d45Chart = computeD45Chart(record.raw);
            setD45(d45Chart);

            const d60Chart = computeD60Chart(record.raw);
            setD60(d60Chart);
        }
        load();
    }, [indexParam, router]);


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
                            <KundaliStructure kundali={d9} title="नवमांश कुंडली" purpose = "विवाह, जीवनसाथी, धर्म, ग्रहों की वास्तविक शक्ति" />
                            <D9PlanetTable d9={d9} />
                        </>
                    )}

                    {selectedChart === "होरा / D2" && (
                        <>
                            <KundaliStructure kundali={d2} title="होरा कुंडली" purpose = "धन और आर्थिक स्थिति" />
                            <D2PlanetTable d2={d2} />
                        </>
                    )}

                    {selectedChart === "द्रेक्काण / D3" && (
                        <>
                            <KundaliStructure kundali={d3} title="द्रेक्काण कुंडली" purpose = "साहस, पराक्रम, छोटे भाई-बहन, प्रयास" />
                            <D3PlanetTable d3={d3} />
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


                    {selectedChart === "चतुर्थांश / D4" && (
                        <>
                            <KundaliStructure kundali={d4} title="चतुर्थांश कुंडली" purpose = "घर, भूमि, संपत्ति, वाहन, स्थायी सुख" />
                            <ChaturthamshaPlanetTable d4={d4} />
                        </>
                    )}

                    {selectedChart === "सप्तमांश / D7" && (
                        <>
                            <KundaliStructure kundali={d7} title="सप्तमांश कुंडली" purpose = "संतान, संतान सुख, बच्चों से संबंधित विषय" />
                            <D7PlanetTable d7={d7} />
                        </>
                    )}
                    {selectedChart === "दशमांश / D10" && (
                        <>
                            <KundaliStructure kundali={d10} title="दशमांश कुंडली" purpose = "करियर, नौकरी, व्यवसाय, पद और प्रतिष्ठा" />
                            <D10PlanetTable d10={d10} />
                        </>
                    )}

                    {selectedChart === "द्वादशांश / D12" && (
                        <>
                            <KundaliStructure kundali={d12} title="द्वादशांश कुंडली" purpose = "माता-पिता, वंश, पारिवारिक विरासत" />
                            <D12PlanetTable d12={d12} />
                        </>
                    )}

                    {selectedChart === "षोडशांश / D16" && (
                        <>
                            <KundaliStructure kundali={d16} title="षोडशांश कुंडली" purpose = "वाहन, सुख-सुविधाएँ, विलासिता" />
                            <D16PlanetTable d16={d16} />
                        </>
                    )}

                    {selectedChart === "विंशांश / D20" && (
                        <>
                            <KundaliStructure kundali={d20} title="विंशांश कुंडली" purpose = "आध्यात्मिकता, साधना, उपासना" />
                            <D20PlanetTable d20={d20} />
                        </>
                    )}
                    
                    {selectedChart === "चतुर्विंशांश(सिद्धांश) / D24" && (
                        <>
                            <KundaliStructure kundali={d24} title="चतुर्विंशांश कुंडली" purpose = "शिक्षा, विद्या, ज्ञान, अकादमिक सफलता" />
                            <D24PlanetTable d24={d24} />
                        </>
                    )}
                    
                    {selectedChart === "सप्तविंशांश (भाम्स) / D27" && (
                        <>
                            <KundaliStructure kundali={d27} title="सप्तविंशांश कुंडली" purpose = "आंतरिक शक्ति, कमजोरियाँ, मानसिक एवं शारीरिक बल" />
                            <D27PlanetTable d27={d27} />
                        </>
                    )}

                    {selectedChart === "त्रिंशांश / D30" && (
                        <>
                            <KundaliStructure kundali={d30} title="त्रिंशांश कुंडली" purpose = "दुर्भाग्य, कष्ट, दोष, नकारात्मक कर्मफल" />
                            <D30PlanetTable d30={d30} />
                        </>
                    )}

                    {selectedChart === "खवेदांश / D40" && (
                        <>
                            <KundaliStructure kundali={d40} title="खवेदांश कुंडली" purpose = "मातृ पक्ष के कर्म और शुभ-अशुभ फल" />
                            <D40PlanetTable d40={d40} />
                        </>
                    )}

                    {selectedChart === "अक्षवेदांश / D45" && (
                        <>
                            <KundaliStructure kundali={d45} title="अक्षवेदांश कुंडली" purpose = "पितृ पक्ष के कर्म और संस्कार" />
                            <D45PlanetTable d45={d45} />
                        </>
                    )}

                    {selectedChart === "षष्ट्यांश / D60" && (
                        <>
                            <KundaliStructure kundali={d60} title="षष्ट्यांश कुंडली" purpose = "पूर्व जन्म के कर्म, गहन कर्मफल, जीवन का सूक्ष्म भाग्य" />
                            <D60PlanetTable d60={d60} />
                        </>
                    )}
                    

                    {!["लग्न / D1", "नवमांश / D9", "होरा / D2", "द्रेक्काण / D3", "चन्द्र / Moon", "सूर्य / Sun", "सप्तमांश / D7", "दशमांश / D10", "द्वादशांश / D12", "षोडशांश / D16", "विंशांश / D20", "चतुर्विंशांश(सिद्धांश) / D24", "सप्तविंशांश (भाम्स) / D27", "त्रिंशांश / D30", "खवेदांश / D40", "अक्षवेदांश / D45", "षष्ट्यांश / D60"].includes(selectedChart) && (
                        <div className="p-10 text-center text-lg font-semibold">
                            {selectedChart} Chart Coming Soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
