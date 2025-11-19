"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader'
import { rashi, nakshatra } from "../AstrologicalData";

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
            "लग्न": rashi(kundali?.raw?.ascendant?.rashiIndex),
            "नक्षत्र": nakshatra(kundali?.raw?.planets?.Moon?.nakshatraIndex),
            "चरण": kundali?.raw?.planets?.Moon?.pada,
        }
    ];

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


console.log(kundali?.raw)



























    // const rashiIndex = kundali?.raw?.planets?.Moon?.rashiIndex
    // const rashiHiName = rashi(rashiIndex);

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

                </div>
            </div>

        </div>
    );
}
