"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader';
import { getHindiGrah } from '@/lib/grah'

export default function KundaliInfoInner() {
    const [kundali, setKundali] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false)
    const params = useSearchParams();
    const router = useRouter();
    const [lagna, setLagna] = useState([]);
    const [remedies, setRemedies] = useState([]);

    // NEW STATES
    const [userPlanet, setUserPlanet] = useState("");
    const [userHouse, setUserHouse] = useState("");
    const [userRemedy, setUserRemedy] = useState("");

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
        fetch('/data/lagans.json')
            .then((r) => r.json())
            .then((data) => setLagna(data));

        fetch('/data/remedies.json')
            .then((e) => e.json())
            .then((data) => setRemedies(data))
    }, []);

    const lagnaIndex = kundali?.raw?.ascendant?.rashiIndex;

    const selectedLagna = lagna?.[lagnaIndex] || null;

    // ------- PLANET LISTS FROM LAGNA --------
    const ashubhGrah = selectedLagna?.ashubh || "";

    // ------- HINDI → ENGLISH PLANET MAP -------
    const planetMap = {
        "सूर्य": "Sun",
        "चंद्र": "Moon",
        "मंगल": "Mars",
        "बुध": "Mercury",
        "गुरु": "Jupiter",
        "शुक्र": "Venus",
        "शनि": "Saturn",
        "राहु": "Rahu",
        "केतु": "Ketu"
    };

    // ------- Convert ashubh string → English array -------
    const ashubhList = ashubhGrah.split(",").map(item => item.trim());
    const englishAshubhPlanets = ashubhList
        .map(h => planetMap[h])
        .filter(Boolean);

    // ------- HOUSE NUMBERS -------
    const houseNumbers = {
        Sun: kundali?.raw?.planets?.Sun?.house,
        Moon: kundali?.raw?.planets?.Moon?.house,
        Mars: kundali?.raw?.planets?.Mars?.house,
        Mercury: kundali?.raw?.planets?.Mercury?.house,
        Jupiter: kundali?.raw?.planets?.Jupiter?.house,
        Venus: kundali?.raw?.planets?.Venus?.house,
        Saturn: kundali?.raw?.planets?.Saturn?.house,
        Rahu: kundali?.raw?.planets?.Rahu?.house,
        Ketu: kundali?.raw?.planets?.Ketu?.house,
    };

    // ------- Get Remedies for Single Planet -------
    function getRemediesForPlanet(planetName) {
        const planetRemedyObj = remedies.find(r => r.grah === planetName);
        if (!planetRemedyObj) return null;

        const house = houseNumbers[planetName];
        if (!house) return null;

        const houseEntry = planetRemedyObj.houses.find(h => h.houseNumber === house);
        return houseEntry?.remedies || null;
    }

    // ------- FINAL REMEDIES OUTPUT -------
    const finalAshubhRemedies = englishAshubhPlanets.map(planet => {
        const remedy = getRemediesForPlanet(planet);
        return remedy ? { planet, remedy } : null;
    }).filter(Boolean);



    // ==========================
    // ⭐ NEW FEATURE: USER INPUT SEARCH
    // ==========================

    function searchRemedy() {
        if (!userPlanet || !userHouse) {
            setUserRemedy("कृपया ग्रह और भाव संख्या दोनों चुनें।");
            return;
        }

        const english = planetMap[userPlanet];
        if (!english) {
            setUserRemedy("ग्रह नाम गलत है।");
            return;
        }

        const planetRemedyObj = remedies.find(r => r.grah === english);
        if (!planetRemedyObj) {
            setUserRemedy("इस ग्रह के लिए remedies उपलब्ध नहीं हैं।");
            return;
        }

        const num = Number(userHouse);
        const houseEntry = planetRemedyObj.houses.find(h => h.houseNumber === num);

        if (!houseEntry) {
            setUserRemedy("इस भाव में कोई remedy उपलब्ध नहीं है।");
            return;
        }

        setUserRemedy(houseEntry.remedies);
    }


    return (
        <div className="p-2 overflow-hidden text-black" >
            <div className="w-[98%] mx-auto">

                <KundaliHeader
                    title="उपाय"
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col justify-center items-center bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl pb-10">

                    <div className="p-4 w-[97%] mx-auto rounded-xl mt-6">

                        {finalAshubhRemedies.length > 0 ? (
                            finalAshubhRemedies.map((item, index) => (
                                <div key={index} className="mb-6">
                                    <h2 className="text-xl font-bold">
                                        → {getHindiGrah(item.planet)} के उपाय
                                    </h2>
                                    <p className="whitespace-pre-line leading-8 mt-2 mb-1 text-lg">
                                        {item.remedy}
                                    </p>
                                    <hr className="bg-gray-600 h-px" />
                                </div>
                            ))
                        ) : (
                            <p>अशुभ ग्रहों के लिए कोई उपाय उपलब्ध नहीं।</p>
                        )}


                        {/* ------------------------------------
                            ⭐ NEW UI: Manual Planet-House Search (Select Based)
                        ------------------------------------- */}
                        <div className="mt-10 p-4 rounded-xl text-black border">

                            {/* Planet Select */}
                            <label className="text-lg font-semibold">Select Planets</label>
                            <select
                                value={userPlanet}
                                onChange={(e) => setUserPlanet(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-blackshadow-smfocus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500transition-all"
                            >
                                <option value="">ग्रह चुनें</option>
                                <option value="सूर्य">सूर्य</option>
                                <option value="चंद्र">चंद्र</option>
                                <option value="मंगल">मंगल</option>
                                <option value="बुध">बुध</option>
                                <option value="गुरु">गुरु</option>
                                <option value="शुक्र">शुक्र</option>
                                <option value="शनि">शनि</option>
                                <option value="राहु">राहु</option>
                                <option value="केतु">केतु</option>
                            </select>


                            {/* House Select */}
                            <label className="text-lg font-semibold">House Number (1 - 12)</label>
                            <select
                                value={userHouse}
                                onChange={(e) => setUserHouse(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-blackshadow-smfocus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500transition-all"
                            >
                                <option value="">भाव चुनें</option>
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>


                            <button
                                onClick={searchRemedy}
                                className="bg-neutral-200 text-black px-4 py-2 rounded w-full mt-5"
                            >
                                खोजें
                            </button>

                            {/* Result */}
                            {userRemedy && (
                                <p className="whitespace-pre-line mt-4 p-3 bg-gray-100 rounded">
                                    {userRemedy}
                                </p>
                            )}

                        </div>




                    </div>

                </div>
            </div>
        </div>
    );
}

