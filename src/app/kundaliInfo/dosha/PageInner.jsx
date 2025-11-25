"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader'
import { kaalSarpYog, cheakMool } from '../AstrologicalData'

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false);
    const [kaalSarpYoga, setKaalSarpYoga] = useState(null);
    const [isRemeadyOpen, setIsRemeadyOpen] = useState(false)

    const params = useSearchParams();
    const router = useRouter();

    const indexParam = params.get("index");

    // Load kundali from DB
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

    // Load JSON for Kaal Sarp Yog descriptions
    useEffect(() => {
        fetch('/data/kaalsarpyogs.json')
            .then((e) => e.json())
            .then((data) => setKaalSarpYoga(data))
    }, []);

    // PREVENT RUNNING ANYTHING EARLY
    if (!kundali) return <div className="p-4 text-white">Loading Kundali...</div>;
    if (!kundali.raw?.planets) return <div className="p-4 text-white">Loading Planet Data...</div>;
    if (!Array.isArray(kaalSarpYoga)) return <div className="p-4 text-white">Loading Kaal Sarp Yog Details...</div>;

    // extract houses
    const kundaliPath = kundali.raw.planets;

    const sunHouse = kundaliPath.Sun?.house;
    const moonHouse = kundaliPath.Moon?.house;
    const marsHouse = kundaliPath.Mars?.house;
    const mercuryHouse = kundaliPath.Mercury?.house;
    const venusHouse = kundaliPath.Venus?.house;
    const jupiterHouse = kundaliPath.Jupiter?.house;
    const saturnHouse = kundaliPath.Saturn?.house;
    const rahuHouse = kundaliPath.Rahu?.house;
    const ketuHouse = kundaliPath.Ketu?.house;

    const nakshatra = kundaliPath?.Moon?.nakshatra
    const charan = kundaliPath?.Moon?.pada

    // calculate yog
    const kaalYog = kaalSarpYog(
        sunHouse,
        moonHouse,
        marsHouse,
        mercuryHouse,
        venusHouse,
        jupiterHouse,
        saturnHouse,
        rahuHouse,
        ketuHouse
    );

    console.log()
    console.log()

    // find full description in JSON
    function getKaalSharpaYoga(kaalYog) {
        if (!kaalYog) return null;
        return kaalSarpYoga.find(yoga => yoga.name.toLowerCase() === kaalYog.toLowerCase()) || null;
    }

    const matchedYog = getKaalSharpaYoga(kaalYog);

    const kaalSarpHindiMap = (kaalYog) => {

        if (kaalYog === "Anant Kaal-Sarp Yoga") {
            return "अनंत कालसर्प योग"
        } else if (kaalYog === "Kulik kaal-sarp yoga") {
            return "कुलिक कालसर्प योग"
        } else if (kaalYog === "Vasuki kaal-sarp yoga") {
            return "वसुकि कालसर्प योग"
        } else if (kaalYog === "SankhPal kaal-sarp yoga") {
            return "शंखपाल कालसर्प योग"
        } else if (kaalYog === "Padam kaal-sarp yoga") {
            return "पद्म कालसर्प योग"
        } else if (kaalYog === "Mahapadam kaal-sarp yoga") {
            return "महापद्म कालसर्प योग"
        } else if (kaalYog === "Takshak kaal-sarp yoga") {
            return "तक्षक कालसर्प योग"
        } else if (kaalYog === "Karkotak kaal-sarp yoga") {
            return "कर्कोटक कालसर्प योग"
        } else if (kaalYog === "Sankhnaad kaal-sarp yoga") {
            return "शंखनाद कालसर्प योग"
        } else if (kaalYog === "Paatak kaal-sarp yoga") {
            return "पातक कालसर्प योग"
        } else if (kaalYog === "Vishakt kaal-sarp yoga") {
            return "विषक्त कालसर्प योग"
        } else if (kaalYog === "Shesnaag kaal-sarp yoga") {
            return "शेषनाग कालसर्प योग"
        } else if (kaalYog === "Aansik Kaal Sarp Yog / आंशिक काल सर्प योग") {
            return "आंशिक काल सर्प योग"
        } else if (kaalYog === "No Kaal Sarp Yog / काल सर्प योग नहीं") {
            return "काल सर्प योग नहीं"
        } else {
            "काल सर्प योग"
        }
    };

    const gandMool = cheakMool(nakshatra, charan);

    console.log(gandMool)

    return (
        <div className="p-2 overflow-hidden text-black">
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="दोष"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
                    {/* mool */}

                    {/* kaalsarpyog */}
                    <div className="p-4">
                        {!matchedYog &&
                            <p className="text-lg font-semibold">
                                काल सर्प योग नहीं है।
                            </p>}
                        {matchedYog && (
                            <div className="mt-4">
                                <p className="font-bold text-xl">{kaalSarpHindiMap(matchedYog.name)}</p>
                                <p className="mt-2 text-md leading-relaxed">{matchedYog.description}</p>

                                <button onClick={(e) => setIsRemeadyOpen(!isRemeadyOpen)} className="w-full p-3 mt-5 rounded-2xl bg-neutral-300">
                                    <h3 className="text-lg font-semibold ">उपाय</h3>
                                </button>
                                {isRemeadyOpen && <p className={`mt-5`}>
                                    <ul className="space-y-1">
                                        {matchedYog.remedies
                                            .split("\n")
                                            .map((line, index) => (
                                                <li key={index} className="text-md leading-relaxed">
                                                    {line}
                                                    <hr />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </p>}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
