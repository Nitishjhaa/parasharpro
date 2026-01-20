"use client";

import { useEffect, useState } from "react";
import { loadMatchMaking } from "@/lib/db";
import MatchHeader from "@/components/MatchHeader";
import {
    rashi,
    nakshatra,
    getLords,
    getNakshatraGana,
    checkManglik
} from "@/app/kundaliInfo/AstrologicalData";

import {
    getNonCompatibleNakshatrasInHindi,
    hasSunSaturnRahuDosha,
    calculateTaraPoints,
    getVarna,
    getVashya,
    getYoni,
    getNaadi,
    calculateGunMilanScore,
    rashiTattvas
} from "@/app/matchmatching/MatchUtils";

import KundaliStructure from "@/components/KundaliStructure";

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

    const taraPoints = calculateTaraPoints(boy.raw?.planets?.Moon?.nakshatra, girl.raw?.planets?.Moon?.nakshatra);

    const boyVarna = getVarna(boy.raw?.planets?.Moon?.rashiIndex);
    const girlVarna = getVarna(girl.raw?.planets?.Moon?.rashiIndex);

    const boyVashya = getVashya(boy.raw?.planets?.Moon?.rashiIndex);
    const girlVashya = getVashya(girl.raw?.planets?.Moon?.rashiIndex);

    const boyYoni = getYoni(boy.raw?.planets?.Moon?.nakshatraIndex);
    const girlYoni = getYoni(girl.raw?.planets?.Moon?.nakshatraIndex);

    const boyNaadi = getNaadi(boy.raw?.planets?.Moon?.nakshatraIndex);
    const girlNaadi = getNaadi(girl.raw?.planets?.Moon?.nakshatraIndex);

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
            male: boyVarna,
            female: girlVarna,
        },
        {
            label: "वश्य",
            male: boyVashya,
            female: girlVashya,
        },
        {
            label: "तारा",
            male: taraPoints.taraBoyToGirl,
            female: taraPoints.taraGirlToBoy,
        },
        {
            label: "योनि",
            male: boyYoni,
            female: girlYoni,
        },
        {
            label: "ग्रह मैत्री",
            male: getLords("rashi", boy.raw?.planets?.Moon.rashi),
            female: getLords("rashi", girl.raw?.planets?.Moon.rashi),
        },
        {
            label: "गण",
            male: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
            female: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        },
        {
            label: "राशि",
            male: rashi(boy.raw?.planets?.Moon.rashiIndex),
            female: rashi(girl.raw?.planets?.Moon.rashiIndex),
        },
        {
            label: "नाड़ी",
            male: boyNaadi,
            female: girlNaadi,
        },
    ];

    const boyData = {
        varna: boyVarna,
        vashya: getVashya(boy.raw?.planets?.Moon?.rashiIndex),
        yoni: boyYoni,
        grahaMaitri: getLords("rashi", boy.raw?.planets?.Moon.rashi),
        gana: getNakshatraGana(boy.raw?.planets?.Moon.nakshatraIndex + 1),
        bhakoot: rashi(boy.raw?.planets?.Moon.rashiIndex),
        nadi: boyNaadi
    }

    const girlData = {
        varna: girlVarna,
        vashya: getVashya(girl.raw?.planets?.Moon?.rashiIndex),
        yoni: girlYoni,
        grahaMaitri: getLords("rashi", girl.raw?.planets?.Moon.rashi),
        gana: getNakshatraGana(girl.raw?.planets?.Moon.nakshatraIndex + 1),
        bhakoot: rashi(girl.raw?.planets?.Moon.rashiIndex),
        nadi: girlNaadi
    }

    const totalMilan = calculateGunMilanScore(boyData, girlData);

    const totalMilanScore = taraPoints.points + totalMilan.totalScore;

    const noncompboy = getNonCompatibleNakshatrasInHindi(boy.raw?.planets?.Moon.nakshatra)
    const noncompgirl = getNonCompatibleNakshatrasInHindi(girl.raw?.planets?.Moon.nakshatra);

    const nakshataraBoy = nakshatra(boy.raw?.planets?.Moon.nakshatraIndex);
    const nakshataraGirl = nakshatra(girl.raw?.planets?.Moon.nakshatraIndex);

    const Compatibility = (nakshataraBoy, nakshataraGirl) => {

        if (noncompboy.find((item) => item === nakshataraGirl)) {
            return "यह मेल मिलाप मेल नहीं हो रहा है क्योंकि लड़की लड़के में गैर-संगत नक्षत्र है"
        }
        else if (noncompgirl.find((item) => item === nakshataraBoy)) {
            return "यह मेल मिलाप मेल नहीं हो रहा है क्योंकि लड़के लड़की में गैर-संगत नक्षत्र है"
        }
        else {

            return "यह मेल मिलाप हो सकता है"
        }
    };

    console.log(matchData)

    const boyRahuHouseNumber = boy.raw?.planets?.Rahu?.house;
    const girlRahuHouseNumber = girl.raw?.planets?.Rahu?.house;

    const boyMarsHouseNumber = boy.raw?.planets?.Mars?.house;
    const girlMarsHouseNumber = girl.raw?.planets?.Mars?.house;

    const boySaturnHouseNumber = boy.raw?.planets?.Saturn?.house;
    const girlSaturnHouseNumber = girl.raw?.planets?.Saturn?.house;

    const boySunHouseNumber = boy.raw?.planets?.Sun?.house;
    const girlSunHouseNumber = girl.raw?.planets?.Sun?.house;

    const hasSunSaturnRahuDoshaForBoy = hasSunSaturnRahuDosha(boySunHouseNumber, boySaturnHouseNumber, boyRahuHouseNumber);
    const hasSunSaturnRahuDoshaForGirl = hasSunSaturnRahuDosha(girlSunHouseNumber, girlSaturnHouseNumber, girlRahuHouseNumber);

    const isBoyManglik = checkManglik(boyMarsHouseNumber);
    const isGirlManglik = checkManglik(girlMarsHouseNumber);

    const minalSoreWrapper = (score) => {
        if (score === 0) {
            return "0"
        }
        return score;
    }

    const info1 = [
        {
            label: "वर्ण",
            female: minalSoreWrapper(totalMilan.individualScores.varna),
            total: 1
        },
        {
            label: "वश्य",
            female: minalSoreWrapper(totalMilan.individualScores.vashya),
            total: 2
        },
        {
            label: "तारा",
            female: taraPoints.points,
            total: 3
        },
        {
            label: "योनि",
            female: minalSoreWrapper(totalMilan.individualScores.yoni),
            total: 4
        },
        {
            label: "ग्रह मैत्री",
            female: minalSoreWrapper(totalMilan.individualScores.grahaMaitri),
            total: 5
        },
        {
            label: "गण",
            female: minalSoreWrapper(totalMilan.individualScores.gana),
            total: 6
        },
        {
            label: "राशि",
            female: minalSoreWrapper(totalMilan.individualScores.bhakoot),
            total: 7
        },
        {
            label: "नाड़ी",
            female: minalSoreWrapper(totalMilan.individualScores.nadi),
            total: 8
        },
        {
            label: "योग",
            female: minalSoreWrapper(totalMilanScore),
            total: 36
        },
    ];

    const boyRashiTatvas = rashiTattvas({
        asc: boy.raw?.ascendant?.rashiIndex + 1,
        moon: boy.raw?.planets?.Moon.rashiIndex + 1,
        venus: boy.raw?.planets?.Venus.rashiIndex + 1
    })

    const girlRashiTatvas = rashiTattvas({
        asc: girl.raw?.ascendant?.rashiIndex + 1,
        moon: girl.raw?.planets?.Moon.rashiIndex + 1,
        venus: girl.raw?.planets?.Venus.rashiIndex + 1
    })

    const tatvaInfo = [
        {
            label: "लग्न",
            total: boyRashiTatvas.ascTatva,
            female: girlRashiTatvas.ascTatva,
        },
        {
            label: "चंद्र",
            total: boyRashiTatvas.moonTatva,
            female: girlRashiTatvas.moonTatva,
        },
        {
            label: "शुक्र",
            total: boyRashiTatvas.venusTatva,
            female: girlRashiTatvas.venusTatva,
        },
    ];

    const saturnRahuDoshaWithManglikDosha = () => {
        if ((isBoyManglik.type === "मंगलीक" && hasSunSaturnRahuDoshaForBoy) && isGirlManglik.type !== "मंगलीक") {
            return `लड़के की कुंडली में मांगलिक दोष है और लड़की की कुंडली में मांगलिक दोष नहीं है लेकिन मांगलिक भाव में ${hasSunSaturnRahuDoshaForBoy.affectedPlanets} है जो मांगलिक दोष को कम या ख़त्म करता है`
        }
        else if ((isGirlManglik.type === "मंगलीक" && hasSunSaturnRahuDoshaForGirl) && isBoyManglik.type !== "मंगलीक") {
            return `लड़की की कुंडली में मांगलिक दोष है और लड़के की कुंडली में मांगलिक दोष नहीं है लेकिन मांगलिक भाव में ${hasSunSaturnRahuDoshaForGirl.affectedPlanets} है जो मांगलिक दोष को कम या ख़त्म करता है`
        }
        else if ((isBoyManglik.type === "मंगलीक") && (isGirlManglik.type === "मंगलीक")) {
            return `लड़के और लड़की दोनों की कुंडली में मांगलिक दोष है इसलिये मांगलिक द्रष्टिकोण से विवाह को अनुमती दी जा सकती है`
        }
        else {
            return "लड़के और लड़की दोनों की कुंडली में मांगलिक दोष नहीं है इसली मांगलिक द्रष्टिकोण से विवाह को अनुमती दी जा सकती है"
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
                                    <th className="text-left px-6 py-2 text-gray-900 border-r border-black/30">
                                        विवरण
                                    </th>

                                    <th className="text-center px-6 py-2 border-r border-black/30">
                                        <span className="text-black text-lg ">
                                            लड़का
                                        </span>
                                    </th>

                                    <th className="text-center px-6 py-2">
                                        <span className="text-black text-lg ">
                                            लड़की
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
                                        <td className="px-6 py-3 font-medium text-gray-900 border-r border-black/30">
                                            {item.label}
                                        </td>

                                        <td className="px-6 py-3 text-center border-r border-black/20">
                                            {item.male || "-"}
                                        </td>

                                        <td className="px-6 py-3 text-center">
                                            {item.female || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        <div className="text-black w-full flex flex-col lg:flex-row" >
                            <div className="w-[92%] ">
                                <KundaliStructure kundali={matchData.male} title="लड़के की कुंडली" />
                            </div>

                            <div className="w-[92%] ">
                                <KundaliStructure kundali={matchData.female} title="लड़की की कुंडली" />
                            </div>
                        </div>

                        <div>
                            <table className="w-full rounded-2xl border border-black/30 mt-10">
                                <thead className="bg-black/10">
                                    <tr>
                                        <th className="text-left px-5 py-2 text-gray-900 border-r border-black/30">
                                            अष्टकूट
                                        </th>

                                        <th className="text-center px-6 py-2 border-r border-black/30">
                                            <span className="text-black text-lg ">
                                                प्राप्तांक
                                            </span>
                                        </th>

                                        <th className="text-center px-6 py-2">
                                            <span className="text-black text-lg ">
                                                पूर्णांक
                                            </span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="text-black text-sm">
                                    {info1.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-black/20"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900 border-r border-black/30">
                                                {item.label}
                                            </td>

                                            <td className="px-4 py-3 text-center border-r border-black/20">
                                                {item.female || "-"}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {item.total || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5">
                            <h2 className="text-xl font-bold text-center text-black mt-5">तत्व विश्लेषण</h2>
                            <table className="w-full rounded-2xl border border-black/30 mt-5">
                                <thead className="bg-black/10">
                                    <tr>
                                        <th className="text-left px-5 py-2 text-gray-900 border-r border-black/30">
                                            ग्रह
                                        </th>

                                        <th className="text-center px-6 py-2 border-r border-black/30">
                                            <span className="text-black text-lg ">
                                                लड़का
                                            </span>
                                        </th>

                                        <th className="text-center px-6 py-2">
                                            <span className="text-black text-lg ">
                                                लड़की
                                            </span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="text-black text-sm">
                                    {tatvaInfo.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-black/20"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900 border-r border-black/30">
                                                {item.label}
                                            </td>

                                            <td className="px-4 py-3 text-center border-r border-black/20">
                                                {item.female || "-"}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {item.total || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 text-black p-2">
                            <h2 className="text-xl font-semibold underline underline-offset-4">मिलान :-</h2>
                            <div className="border p-4 mt-3 rounded-2xl border-black/40">
                                <h2 className="text-base font-semibold underline underline-offset-4 mt-2">नक्षत्र विचार :-</h2>
                                <p className="mt-3">{Compatibility(nakshataraBoy, nakshataraGirl)}</p>
                            </div>
                            <div className="border p-4 mt-3 rounded-2xl border-black/40">
                                <h2 className="text-base font-semibold underline underline-offset-4 mt-2">मांगलिक दोष विचार :-</h2>
                                <p className="mt-3 text-red-600">- लड़के की {isBoyManglik.status}</p>
                                <p className="mt-3 text-red-600">- लड़की की {isGirlManglik.status}</p>
                                <p className="mt-2">{saturnRahuDoshaWithManglikDosha()}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchInfoPage;
