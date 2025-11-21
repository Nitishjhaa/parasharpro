"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader'
import { rashi, nakshatra, getGhaatChakraByRashi, getMoonPaaye, getNakPaaye, getLords } from "../AstrologicalData";

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)
    const params = useSearchParams();
    const router = useRouter();

    const indexParam = params.get("index");

    const data = [
        {
            "नाम": kundali?.meta?.name,
            "जन्म तिथि": kundali?.meta?.birthDate,
            "जन्म समय": kundali?.meta?.birthTime,
            "जन्म स्थान": kundali?.meta?.city,
            "राशि": rashi(kundali?.raw?.planets?.Moon?.rashiIndex),
            "राशिपति": getLords("rashi", kundali?.raw?.planets?.Moon?.rashi),
            "लग्न": rashi(kundali?.raw?.ascendant?.rashiIndex),
            "लग्नाधिपति": getLords("lagna", kundali?.raw?.ascendant?.rashi),
            "नक्षत्र": nakshatra(kundali?.raw?.planets?.Moon?.nakshatraIndex),
            "चरण": kundali?.raw?.planets?.Moon?.pada,
            "नक्षत्रपति": getLords("nakshatra", kundali?.raw?.planets?.Moon?.nakshatra),
            "पाये (राशि से)": getMoonPaaye(kundali?.raw?.planets?.Moon?.house),
            "पाये (नक्षत्र से)": getNakPaaye(kundali?.raw?.planets?.Moon?.nakshatra)
        }
    ];

    const ghaat = getGhaatChakraByRashi(kundali?.raw?.planets?.Moon?.rashiIndex, kundali?.meta?.gender);

    console.log(kundali)

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


    if (!kundali) return <div className="p-4 text-white">Loading...</div>;

    return (
        <div className="p-2 overflow-hidden text-black" >
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="सामान्य परिचय"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />
                <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">
                    <ul className="w-full mt-5 p-5">
                        <h3 className="text-2xl ml-5 my-5 font-bold underline underline-offset-8">सामान्य परिचय</h3>
                        {Object.entries(data[0]).map(([key, value]) => (
                            <li
                                key={key}
                                className="flex justify-between gap-8 px-6 py-3 border-b border-black/20 text-lg font-medium"
                            >
                                <span>{key} : </span>
                                <span>{value || "-"}</span>
                            </li>
                        ))}
                    </ul>
                    <ul className="w-full p-5">
                        <h3 className="text-2xl ml-5 my-5 font-bold underline underline-offset-8">घात चक्र</h3>
                        {Object.entries(ghaat[0]).map(([key, value]) => (
                            <li
                                key={key}
                                className="flex justify-between gap-8 px-6 py-3 border-b border-black/20 text-lg font-medium"
                            >
                                <span>{key} : </span>
                                <span>{value || "-"}</span>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
            <pre className="whitespace-pre-wrap bg-black/40 p-3 rounded-xl text-white">
                {JSON.stringify(kundali.raw, null, 2)}
            </pre>
        </div>
    );
}
