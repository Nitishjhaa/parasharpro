"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader'
import { getHindiNakshatra } from "@/lib/nakshatra";
import { preditionOnDate } from '../AstrologicalData'

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false);
    const [nakshatara, setNakshatara] = useState([]);
    const [planetsInNakshatras, setPlanetsInNakshatras] = useState([]); // FIXED

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

    useEffect(() => {
        fetch('/data/nakshatras.json')
            .then((r) => r.json())
            .then((data) => setNakshatara(data || []));

        fetch('/data/planetsinnakshatras.json')
            .then((r) => r.json())
            .then((data) => setPlanetsInNakshatras(data));
    }, []);


    // Helper to get data for any planet
    function getPlanetNakshatraMeaning(planet) {
        if (!planetsInNakshatras || planetsInNakshatras.length === 0) return null;

        const root = planetsInNakshatras[0];  // FIXED ROOT

        const nakRaw = kundali?.raw?.planets?.[planet]?.nakshatra;
        const pada = kundali?.raw?.planets?.[planet]?.pada;

        if (!nakRaw || !pada) return null;

        const nak = nakRaw;
        const planetLower = planet.toLowerCase();

        const planetData = root[planetLower];
        if (!planetData) return null;

        if (!planetData[nak]) return null;

        return planetData[nak][pada] || null;
    }

    const nakAndPaad = (planet) => {
        const nakRaw = kundali?.raw?.planets?.[planet]?.nakshatra;
        const narmalizedName = nakRaw
        const nakRawName = getHindiNakshatra(narmalizedName)
        const pada = kundali?.raw?.planets?.[planet]?.pada;

        return `${nakRawName} : ${pada} `
    }

    const nakshataraIndex = kundali?.raw?.planets?.Moon?.nakshatraIndex;
    const gender = kundali?.meta?.gender.toLowerCase();
    const n = nakshatara[nakshataraIndex];

    const sunMeaning = getPlanetNakshatraMeaning("Sun");
    const moonMeaning = getPlanetNakshatraMeaning("Moon");
    const mercuryMeaning = getPlanetNakshatraMeaning("Mercury");
    const venusMeaning = getPlanetNakshatraMeaning("Venus");
    const jupiterMeaning = getPlanetNakshatraMeaning("Jupiter");
    const saturnMeaning = getPlanetNakshatraMeaning("Saturn");
    const rahuMeaning = getPlanetNakshatraMeaning("Rahu");
    const ketuMeaning = getPlanetNakshatraMeaning("Ketu");

    const birthDate = kundali?.raw?.meta?.datetimeUTC;

    const datePrediction = preditionOnDate({ birthDate });

    if (!kundali) return <div className="p-4 text-white">Loading...</div>;


    return (
        <div className="p-2 overflow-hidden text-black">
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="फलादेश"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col justify-start bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl p-2 lg:p-10">
                    <div className="px-6 py-3 flex flex-col gap-5">
                        {datePrediction.map((p, index) => (
                            <div key={index} >
                                <div>
                                    {p.msg}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-start bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl p-2 lg:p-10 mt-5">
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">शारीरिक संरचना:</span><br />
                        {n?.saririkSanrahna?.[gender]}
                    </p>
                    <hr />

                    <p className="text-black px-6 py-3">
                        <span className="font-bold">चरित्र:</span><br />
                        {n?.charitr?.[gender]}
                    </p>
                    <hr />

                    <p className="text-black px-6 py-3">
                        <span className="font-bold">शिक्षा:</span><br />
                        {n?.education?.[gender]}
                    </p>
                    <hr />

                    <p className="text-black px-6 py-3">
                        <span className="font-bold">वैवाहिक जीवन:</span><br />
                        {n?.marriedlife?.[gender]}
                    </p>
                    <hr />

                    <p className="text-black px-6 py-3">
                        <span className="font-bold">स्वास्थ्य:</span><br />
                        {n?.Health?.[gender]}
                    </p>
                    <hr />

                    <p className="text-black px-6 py-3 ">
                        <span className="font-bold">विशेष:</span><br />
                        इस नक्षत्र में पैदा जातकों को <span className="text-red-600">
                            {n?.unfavorableNakshatra.join(", ")}
                        </span> नक्षत्र के जातकों से विवाह, मित्रता या साझेदारी नहीं करनी चाहिए।
                    </p>

                </div>
                <div className="flex flex-col justify-start bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl p-2 mt-5 lg:p-10">
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">सूर्य:{nakAndPaad("Sun")} :</span><br />
                        {sunMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">चन्द्र: {nakAndPaad("Moon")} :</span><br />
                        {moonMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">मंगल: {nakAndPaad("Mars")} :</span><br />
                        {sunMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">बुध: {nakAndPaad("Mercury")} :</span><br />
                        {mercuryMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">गुरु: {nakAndPaad("Jupiter")} :</span><br />
                        {jupiterMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">शुक्र: {nakAndPaad("Venus")} :</span><br />
                        {venusMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">शनि: {nakAndPaad("Saturn")} :</span><br />
                        {saturnMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">राहु: {nakAndPaad("Rahu")} :</span><br />
                        {rahuMeaning}
                    </p>
                    <hr />
                    <p className="text-black px-6 py-3">
                        <span className="font-bold">केतु: {nakAndPaad("Ketu")} :</span><br />
                        {ketuMeaning}
                    </p>
                </div>
            </div>
        </div>
    );
}
