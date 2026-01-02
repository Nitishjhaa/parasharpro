"use client";

import { useEffect, useState } from "react";
import { loadMatchMaking } from "@/lib/db";
import MatchHeader from "@/components/MatchHeader";
import { rashi, nakshatra, getGhaatChakraByRashi, getMoonPaaye, getNakPaaye, getLords, getNakshatraGana, checkManglik } from "@/app/kundaliInfo/AstrologicalData";
import { getNonCompatibleNakshatrasInHindi, hasSunSaturnRahuDosha } from "@/app/matchmatching/MatchUtils";

const MatchInfoPage = () => {
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSideOpen, setIsSideOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await loadMatchMaking();
                setMatchData(data);

            } catch (error) {
                console.error("Error loading match making data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading match data...</div>
            </div>
        );
    }

    if (!matchData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">
                    No match making data found
                </div>
            </div>
        );
    };

    const boy = matchData.male;
    const girl = matchData.female;

    const info = [
        {
            label: "नाम",
            male: boy.meta.name,
            female: girl.meta.name,
        },
        {
            label: "जन्म तिथि",
            male: boy.meta.birthDate,
            female: girl.meta.birthDate,
        },
        {
            label: "जन्म समय",
            male: boy.meta.birthTime,
            female: girl.meta.birthTime,
        },
        {
            label: "जन्म स्थान",
            male: boy.meta.city,
            female: girl.meta.city,
        },
        {
            label: "राशि",
            male: rashi(boy.raw?.planets?.Moon.rashiIndex),
            female: rashi(girl.raw?.planets?.Moon.rashiIndex),
        },
        {
            label: "लग्न",
            male: rashi(boy.raw?.ascendant?.rashiIndex),
            female: rashi(girl.raw?.ascendant?.rashiIndex),
        },
        {
            label: "नक्षत्र",
            male: nakshatra(boy.raw?.planets?.Moon.nakshatraIndex),
            female: nakshatra(girl.raw?.planets?.Moon.nakshatraIndex),
        },
        {
            label: "चरण",
            male: boy.raw?.planets?.Moon.pada,
            female: girl.raw?.planets?.Moon.pada,
        },
        {
            label: "राशिपति",
            male: getLords("rashi", boy.raw?.planets?.Moon.rashi),
            female: getLords("rashi", girl.raw?.planets?.Moon.rashi),
        },
        {
            label: "लग्नाधिपति",
            male: getLords("lagna", boy.raw?.ascendant?.rashi),
            female: getLords("lagna", girl.raw?.ascendant?.rashi),
        },
        {
            label: "नक्षत्राधिपति",
            male: getLords("nakshatra", boy.raw?.planets?.Moon.nakshatra),
            female: getLords("nakshatra", girl.raw?.planets?.Moon?.nakshatra),
        },
        {
            label: "वर्ण",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "वश्य",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "तारा",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "योनि",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "ग्रह मैत्री",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "गण",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "राशि",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "नाड़ी",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
    ];

    const noncompboy = getNonCompatibleNakshatrasInHindi(matchData.male.raw?.planets?.Moon.nakshatra)
    const noncompgirl = getNonCompatibleNakshatrasInHindi(matchData.female.raw?.planets?.Moon.nakshatra);

    const nakshataraBoy = nakshatra(matchData.male.raw?.planets?.Moon.nakshatraIndex);
    const nakshataraGirl = nakshatra(matchData.female.raw?.planets?.Moon.nakshatraIndex);

    const Compatibility = (nakshataraBoy, nakshataraGirl) => {

        if (noncompboy.find((item) => item === nakshataraGirl)) {
            return "यह मेल मिलाप मेल नहीं हो रहा  है क्योंकि लड़की लड़के में गैर-संगत नक्षत्र है"
        }
        else if (noncompgirl.find((item) => item === nakshataraBoy)) {
            return "यह मेल मिलाप मेल नहीं हो रहा  है क्योंकि लड़के लड़की में गैर-संगत नक्षत्र है"
        }
        else {

            return "यह मेल मिलाप हो सकता है"
        }
    };

    const boyRahuHouseNumber = matchData.male.raw?.planets?.Rahu?.house;
    const girlRahuHouseNumber = matchData.female.raw?.planets?.Rahu?.house;

    const boyMarsHouseNumber = matchData.male.raw?.planets?.Mars?.house;
    const girlMarsHouseNumber = matchData.female.raw?.planets?.Mars?.house;

    const boySaturnHouseNumber = matchData.male.raw?.planets?.Saturn?.house;
    const girlSaturnHouseNumber = matchData.female.raw?.planets?.Saturn?.house;

    const boySunHouseNumber = matchData.male.raw?.planets?.Sun?.house;
    const girlSunHouseNumber = matchData.female.raw?.planets?.Sun?.house;

    const sunSaturnRahuDoshaForBoy = hasSunSaturnRahuDosha(boySunHouseNumber, boySaturnHouseNumber, boyRahuHouseNumber);
    const sunSaturnRahuDoshaForGirl = hasSunSaturnRahuDosha(girlSunHouseNumber, girlSaturnHouseNumber, girlRahuHouseNumber);

    const isBoyManglik = checkManglik(boyMarsHouseNumber)
    const isGirlManglik = checkManglik(girlMarsHouseNumber)

    console.log(isBoyManglik, isGirlManglik)

    const manglikResult = (isBoyManglik, isGirlManglik) => {
        if(isBoyManglik.type === isGirlManglik.type) {
            return "लड़के और लड़की दोनों की कुंडली में मांगलिक दोष है इसली मांगलिक द्रष्टिकोण से विवाह को अनुमती दी जा सकती है"
        }
    }        

    return (
        <div className="min-h-screen p-2">
            <div className="w-[98%] mx-auto">
                <MatchHeader
                    title="Match Making"
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="max-w-6xl mx-auto mt-4">
                    <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-2xl overflow-hidden">
                        <table className="w-full rounded-2xl border border-black/30">
                            <thead className="bg-black/10">
                                <tr>
                                    <th className="text-left px-6 py-2 text-gray-900 font-semibold border-r border-black/30">
                                        Details
                                    </th>

                                    <th className="text-center px-6 py-2 border-r border-black/30">
                                        <span className="text-black text-lg font-semibold">
                                            Boy
                                        </span>
                                    </th>

                                    <th className="text-center px-6 py-2">
                                        <span className="text-black text-lg font-semibold">
                                            Girl
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-black text-sm">
                                {info.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-t border-black/20"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 border-r border-black/30">
                                            {item.label}
                                        </td>

                                        <td className="px-6 py-4 text-center border-r border-black/20">
                                            {item.male || "-"}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {item.female || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-6 text-black p-2">

                            <h2 className="text-xl font-semibold underline underline-offset-4">मिलान :-</h2>
                            <div className="border p-1 mt-3 rounded-2xl border-black/40">
                                <h2 className="text-base font-semibold underline underline-offset-4 mt-2">नक्षत्र के हिसाब से :-</h2>
                                <p className="mt-3">{Compatibility(nakshataraBoy, nakshataraGirl)}</p>
                            </div>
                            <div className="border p-1 mt-3 rounded-2xl border-black/40">
                                <h2 className="text-base font-semibold underline underline-offset-4 mt-2">मांगलिक दोष विचार :-</h2>
                                <p className="mt-3">लड़के की {isBoyManglik.status}</p>
                                <p className="mt-3">लड़की की {isGirlManglik.status}</p>
                                <p className="mt-2">{manglikResult(isBoyManglik, isGirlManglik)}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchInfoPage;
