"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader';
import { getHouseLordsWithPositions } from "../AstrologicalData";
import { getDrishtiFromHouses, allOtherYogas } from "@/lib/yogas";

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


    const ascendantStr = kundali?.raw?.ascendant?.rashi; // this is string means it's value is from arise to pieces
    const ascendantNumber = kundali?.raw?.ascendant?.rashiIndex; // this is number means it's value is from 1 to 12
    const sunHousePosition = kundali?.raw?.planets?.Sun?.house; // this is number means it's value is from 1 to 12
    const moonHousePosition = kundali?.raw?.planets?.Moon?.house; // this is number means it's value is from 1 to 12
    const marsHousePosition = kundali?.raw?.planets?.Mars?.house; // this is number means it's value is from 1 to 12
    const mercuryHousePosition = kundali?.raw?.planets?.Mercury?.house; // this is number means it's value is from 1 to 12
    const jupiterHousePosition = kundali?.raw?.planets?.Jupiter?.house; // this is number means it's value is from 1 to 12
    const venusHousePosition = kundali?.raw?.planets?.Venus?.house; // this is number means it's value is from 1 to 12
    const saturnHousePosition = kundali?.raw?.planets?.Saturn?.house; // this is number means it's value is from 1 to 12
    const rahuHousePosition = kundali?.raw?.planets?.Rahu?.house; // this is number means it's value is from 1 to 12
    const ketuHousePosition = kundali?.raw?.planets?.Ketu?.house; // this is number means it's value is from 1 to 12

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

    const bhavesh = getHouseLordsWithPositions(ascendantNumber, planetPositions);

    const Lagnesh = bhavesh.Lagnesh;
    const LagneshPosition = bhavesh.LagneshPosition;
    const Dwityesh = bhavesh.Dwityesh;
    const DwityeshPosition = bhavesh.DwityeshPosition;
    const Trityesh = bhavesh.Trityesh;
    const TrityeshPosition = bhavesh.TrityeshPosition;
    const Chaturthesh = bhavesh.Chaturthesh;
    const ChaturtheshPosition = bhavesh.ChaturtheshPosition;
    const Panchamesh = bhavesh.Panchamesh;
    const PanchameshPosition = bhavesh.PanchameshPosition;
    const Shashthesh = bhavesh.Shashthesh;
    const ShashtheshPosition = bhavesh.ShashtheshPosition;
    const Saptamesh = bhavesh.Saptamesh;
    const SaptameshPosition = bhavesh.SaptameshPosition;
    const Ashtamesh = bhavesh.Ashtamesh;
    const AshtameshPosition = bhavesh.AshtameshPosition;
    const Navamesh = bhavesh.Navamesh;
    const NavameshPosition = bhavesh.NavameshPosition;
    const Dashmesh = bhavesh.Dashmesh;
    const DashmeshPosition = bhavesh.DashmeshPosition;
    const Ekadashesh = bhavesh.Ekadashesh;
    const EkadasheshPosition = bhavesh.EkadasheshPosition;
    const Dwadashesh = bhavesh.Dwadashesh;
    const DwadasheshPosition = bhavesh.DwadasheshPosition;

    const rashiLimitBreaker = (rashiNumber) => {
        if (rashiNumber === 0) {
            return 12
        }
        else {
            return rashiNumber
        }
    }

    const sunRashi = rashiLimitBreaker((ascendantNumber + sunHousePosition) % 12);
    const moonRashi = rashiLimitBreaker((ascendantNumber + moonHousePosition) % 12);
    const marsRashi = rashiLimitBreaker((ascendantNumber + marsHousePosition) % 12);
    const mercuryRashi = rashiLimitBreaker((ascendantNumber + mercuryHousePosition) % 12);
    const jupiterRashi = rashiLimitBreaker((jupiterHousePosition + ascendantNumber) % 12)
    const venusRashi = rashiLimitBreaker((venusHousePosition + ascendantNumber) % 12)
    const saturnRashi = rashiLimitBreaker((saturnHousePosition + ascendantNumber) % 12)
    const rahuRashi = rashiLimitBreaker((rahuHousePosition + ascendantNumber) % 12)
    const ketuRashi = rashiLimitBreaker((ketuHousePosition + ascendantNumber) % 12);

    const getDristi = getDrishtiFromHouses({
        sunHousePosition, moonHousePosition, marsHousePosition, mercuryHousePosition, jupiterHousePosition, venusHousePosition, saturnHousePosition, rahuHousePosition, ketuHousePosition
    });

    const birthandTime = kundali?.raw?.meta?.datetimeUTC;
    const birthDate = birthandTime?.split("T")[0];
    const birthTime = birthandTime?.split("T")[1];

    const sunDristi = getDristi?.Sun?.purnDrishti;
    const moonDristi = getDristi?.Moon?.purnDrishti;
    const marsDristi = getDristi?.Mars?.purnDrishti;
    const mercuryDristi = getDristi?.Mercury?.purnDrishti;
    const jupiterDristi = getDristi?.Jupiter?.purnDrishti;
    const venusDristi = getDristi?.Venus?.purnDrishti;
    const saturnDristi = getDristi?.Saturn?.purnDrishti;
    const rahuDristi = getDristi?.Rahu?.purnDrishti;
    const ketuDristi = getDristi?.Ketu?.purnDrishti;

    const yogaInKundali = allOtherYogas({
        Lagnesh, Dwityesh, Trityesh, Chaturthesh, Panchamesh, Shashthesh, Saptamesh, Ashtamesh, Navamesh, Dashmesh, Ekadashesh, Dwadashesh, LagneshPosition, DwityeshPosition, TrityeshPosition, ChaturtheshPosition, PanchameshPosition, ShashtheshPosition, SaptameshPosition, AshtameshPosition, NavameshPosition, DashmeshPosition, EkadasheshPosition, DwadasheshPosition, sunHousePosition, moonHousePosition, marsHousePosition, mercuryHousePosition, jupiterHousePosition, venusHousePosition, saturnHousePosition, rahuHousePosition, ketuHousePosition, sunRashi, marsRashi, moonRashi, mercuryRashi, jupiterRashi, venusRashi, saturnRashi, rahuRashi, ketuRashi, birthDate, birthTime, sunDristi, moonDristi, marsDristi, mercuryDristi, jupiterDristi, venusDristi, saturnDristi, rahuDristi, ketuDristi, ascendantNumber,// hindiMonths, paksha
    });

    console.log(yogaInKundali)

    const duplicateRemover = (yogas) => {
        const uniqueYogas = [];
        const seen = new Set();
        for (let i = 0; i < yogas.length; i++) {
            const yoga = yogas[i];
            if (!seen.has(yoga.type)) {
                uniqueYogas.push(yoga);
                seen.add(yoga.type);
            }
        }
        return uniqueYogas;
    }

    const uniqueYogas = duplicateRemover(yogaInKundali);

    if (!ascendantStr || !moonHousePosition) return <div className="p-4 text-white">Loading Kundali chandra data...</div>;
    if (!ascendantStr || !sunHousePosition) return <div className="p-4 text-white">Loading Kundali sun data...</div>;

    return (
        <div className="p-2 overflow-hidden text-black" >
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="भावेश के योग"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col gap-3 justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-3">
                    <div className="p-3">
                        {uniqueYogas?.map((yoga, index) => (
                            <div key={index} className="flex flex-col justify-center border border-black/40 rounded-2xl mt-3 gap-3 p-3">
                                <div className="flex items-center gap-4">
                                    <p className="text-base font-bold h-10 w-10 rounded-full bg-white flex items-center justify-center">{index+1}.</p>
                                    <p className="text-base font-bold">{yoga?.type}</p>

                                </div>
                                <p className="text-base">{yoga?.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

