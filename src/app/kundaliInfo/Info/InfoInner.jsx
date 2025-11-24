"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader'
import { rashi, nakshatra, getGhaatChakraByRashi, getMoonPaaye, getNakPaaye, getLords } from "../AstrologicalData";
import getPanchangDetails from '@/lib/panchang'

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)
    const [getCoordinate, setGetCoordinate] = useState([])
    const params = useSearchParams();
    const router = useRouter();

    // Load cities.json
    useEffect(() => {
        fetch("/data/cities.json")
            .then((r) => r.json())
            .then((data) => setGetCoordinate(data || []));
    }, []);


    function getLatLon(cityName) {
        const result = getCoordinate.find(item => item.city.toLowerCase() === cityName.toLowerCase());
        if (result) {
            return { lat: result.lat, lon: result.lng };
        }
        return null;
    }

    const indexParam = params.get("index");

    const cityName = kundali?.raw?.city;

    let lat = null;
    let lon = null;

    if (cityName) {
        const latAndLon = getLatLon(cityName);
        lat = latAndLon?.lat ?? null;
        lon = latAndLon?.lon ?? null;
    }

    const birthString = kundali?.raw?.meta?.datetimeUTC ?? null;

    let birthDate = null;
    let birthTime = null;

    if (birthString) {
        const [date, time] = birthString.split('T');
        birthDate = date;
        birthTime = time?.split('.')[0]; // remove milliseconds
    }

    const panchang = getPanchangDetails(birthDate, birthTime, lat, lon)

    function getHindiWeekday(dob) {

        if (!dob) {
            return 'dob is not found'
        }

        const hindiDays = [
            "रविवार",  // Sunday
            "सोमवार",  // Monday
            "मंगलवार", // Tuesday
            "बुधवार",  // Wednesday
            "गुरुवार", // Thursday
            "शुक्रवार", // Friday
            "शनिवार"   // Saturday
        ];

        let date;
        date = new Date(dob);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid Date Format");
        }

        return hindiDays[date.getDay()];
    }

    getHindiWeekday()

    let tithi = null;

    if (panchang?.tithi?.name) {
        tithi = panchang.tithi.name;
    }

    const chandraRelated = kundali?.raw?.planets?.Moon;
    const kundaliMeta = kundali?.meta;

    const data = [
        {
            "नाम": kundaliMeta?.name,
            "जन्म तिथि": kundaliMeta?.birthDate,
            "जन्म समय": kundaliMeta?.birthTime,
            "जन्म स्थान": kundaliMeta?.city,
            "अक्षांश": lat,
            "देशांतर": lon,
            "राशि": rashi(chandraRelated?.rashiIndex),
            "राशिपति": getLords("rashi", chandraRelated?.rashi),
            "लग्न": rashi(kundali?.raw?.ascendant?.rashiIndex),
            "लग्नाधिपति": getLords("lagna", kundali?.raw?.ascendant?.rashi),
            "नक्षत्र": nakshatra(chandraRelated?.nakshatraIndex),
            "चरण": chandraRelated?.pada,
            "नक्षत्रपति": getLords("nakshatra", chandraRelated?.nakshatra),
            "पाये (राशि से)": getMoonPaaye(chandraRelated?.house),
            "पाये (नक्षत्र से)": getNakPaaye(chandraRelated?.nakshatra),
            "गण": panchang.gana,
            "मास": panchang.purnimantaMonth,
            "पक्ष": panchang.paksha,
            "तिथि": tithi,
            "वार": getHindiWeekday(birthDate),
            "ऋतु": panchang.ritu,
        }
    ];

    const ghaat = getGhaatChakraByRashi(chandraRelated?.rashiIndex, kundaliMeta?.gender);

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
            {/* <pre className="whitespace-pre-wrap bg-black/40 p-3 rounded-xl text-white">
                {JSON.stringify(kundali.raw, null, 2)}
            </pre> */}
        </div>
    );
}
