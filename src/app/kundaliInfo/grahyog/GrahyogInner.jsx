"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader';
import { getHouseLordsWithPositions } from "../AstrologicalData";

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
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

            setKundali(record);


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
    const planetPositions = {
        Sun: sunHousePosition,
        Moon: moonHousePosition,
        Mars: marsHousePosition,
        Mercury: mercuryHousePosition,
        Jupiter: jupiterHousePosition,
        Venus: venusHousePosition,
        Saturn: saturnHousePosition,
        Rahu: rahuHousePosition,
        Ketu: ketuHousePosition
    }

    const laganesh = getHouseLordsWithPositions(ascendantNumber, planetPositions);

    console.log(laganesh)

    if (!ascendantStr || !moonHousePosition) return <div className="p-4 text-white">Loading Kundali chandra data...</div>;
    if (!ascendantStr || !sunHousePosition) return <div className="p-4 text-white">Loading Kundali sun data...</div>;


    return (
        <div className="p-2 overflow-hidden text-black" >
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="अन्य वर्ग-कुंडली"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">

                </div>
            </div>
        </div>
    );
}
