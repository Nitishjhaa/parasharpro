"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader';
import { RiArrowGoBackLine } from "react-icons/ri";
import { getHindiNakshatra } from '@/lib/nakshatra';

export default function PlanetInfoPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [kundali, setKundali] = useState(null);
    const [grahInfo, setGrahInfo] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false);
    const [planetsInNakshatras, setPlanetsInNakshatras] = useState([]); // FIXED
    const [remedies, setRemedies] = useState([]);


    const indexParam = searchParams.get("index");
    const planetName = params.planetName; // This will be the English name from URL

    useEffect(() => {
        async function loadData() {
            try {
                // Load grahInfo
                const response = await fetch("/data/grahInfo.json");
                const data = await response.json();
                setGrahInfo(data);
            } catch (error) {
                console.error("Error loading grahInfo:", error);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        fetch('/data/planetsinnakshatras.json')
            .then((r) => r.json())
            .then((data) => setPlanetsInNakshatras(data));

        fetch('/data/remedies.json')
            .then((e) => e.json())
            .then((data) => setRemedies(data))
    }, []);

    useEffect(() => {
        async function loadKundali() {
            if (!indexParam) return;

            const idx = Number(indexParam);
            if (isNaN(idx) || idx < 0) return;

            const record = await loadKundaliByIndex(idx);
            if (!record) return;

            setKundali(record);
        }
        loadKundali();
    }, [indexParam]);

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

    const sunMeaning = getPlanetNakshatraMeaning("Sun");
    const moonMeaning = getPlanetNakshatraMeaning("Moon");
    const mercuryMeaning = getPlanetNakshatraMeaning("Mercury");
    const venusMeaning = getPlanetNakshatraMeaning("Venus");
    const jupiterMeaning = getPlanetNakshatraMeaning("Jupiter");
    const saturnMeaning = getPlanetNakshatraMeaning("Saturn");
    const rahuMeaning = getPlanetNakshatraMeaning("Rahu");
    const ketuMeaning = getPlanetNakshatraMeaning("Ketu");

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


    if (!kundali || !grahInfo) return <div className="p-4 text-black">Loading...</div>;

    // Normalize planet name for lookup
    const planetKey = planetName ? planetName.toLowerCase() : null;

    // Find the config for display label
    const planetsConfig = [
        { key: 'Sun', jsonKey: 'sun', label: 'सूर्य' },
        { key: 'Moon', jsonKey: 'moon', label: 'चंद्र' },
        { key: 'Mars', jsonKey: 'mars', label: 'मंगल' },
        { key: 'Mercury', jsonKey: 'mercury', label: 'बुध' },
        { key: 'Jupiter', jsonKey: 'jupiter', label: 'गुरु' },
        { key: 'Venus', jsonKey: 'venus', label: 'शुक्र' },
        { key: 'Saturn', jsonKey: 'saturn', label: 'शनि' },
        { key: 'Rahu', jsonKey: 'rahu', label: 'राहु' },
        { key: 'Ketu', jsonKey: 'ketu', label: 'केतु' }
    ];

    const planetConfig = planetsConfig.find(p => p.key.toLowerCase() === planetKey);

    if (!planetConfig) {
        return <div className="p-4 text-black">Planet not found.</div>;
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const planetDataKey = capitalizeFirstLetter(planetKey);
    const housePosition = kundali?.raw?.planets?.[planetDataKey]?.house;

    const info = grahInfo?.[0]?.[planetConfig.jsonKey]?.[housePosition];

    const FormattedText = ({ text }) => {
        if (!text) return null;
        return (
            <div>
                {text
                    .match(/\d+\.\s[^]+?(?=\s\d+\.|$)/g) // extract each point
                    ?.map((item, index) => (
                        <div key={index} className="mb-2">{item.trim()}</div>
                    )) || <div>{text}</div>}
            </div>
        );
    };

    const RemediesFormattedText = ({ text }) => {
        if (!text) return null;
        return (
            <div>
                {text.split('\n').filter(line => line.trim() !== '').map((item, index) => (
                    <div key={index} className="mb-1">{item.trim()}</div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-2 overflow-hidden text-black">
            <div className="w-[98%] mx-auto">
                <KundaliHeader
                    title={`${planetConfig.label} का फल`}
                    indexParam={indexParam}
                    isSideOpen={isSideOpen}
                    setIsSideOpen={setIsSideOpen}
                />

                <div className="flex flex-col gap-6 bg-linear-to-r from-[#FFE984] to-[#FFB111] rounded-3xl p-6 min-h-[50vh]">
                    {!housePosition || !info ? (
                        <div className="p-6 border bg-white/50 rounded-xl shadow-sm">
                            <p>इस कुंडली में {planetConfig.label} की स्थिति उपलब्ध नहीं है।</p>
                            <button
                                onClick={() => router.back()}
                                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                            >
                                <RiArrowGoBackLine />
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 bg-white/50 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2 border-orange-400">
                                <h2 className="text-xl font-bold text-black">
                                    {planetConfig.label} - भाव {housePosition}
                                </h2>
                                <button
                                    onClick={() => router.back()}
                                    className="px-3 py-2 bg-black text-white text-sm rounded hover:bg-orange-600 transition"
                                >
                                    <RiArrowGoBackLine />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-green-50/80 p-4 rounded-lg border border-green-100">
                                    <h3 className="font-semibold text-green-800 mb-2">शुभ फल:</h3>
                                    <div className="text-sm text-gray-800">
                                        <FormattedText text={info.subh} />
                                    </div>
                                </div>

                                <div className="bg-red-50/80 p-4 rounded-lg border border-red-100">
                                    <h3 className="font-semibold text-red-800 mb-2">अशुभ फल:</h3>
                                    <div className="text-sm text-gray-800">
                                        <FormattedText text={info.ashubh} />
                                    </div>
                                </div>
                            </div>

                            {/* New Nakshatra Meaning Section */}
                            <div className="bg-blue-50/80 p-4 rounded-lg border border-blue-100 mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">नक्षत्र फल - <br />
                                    <div className="mt-3 text-blue-800">
                                        {planetConfig.label} : {nakAndPaad(planetConfig.key)}
                                    </div>
                                </h3>
                                <div className="text-sm text-gray-800">
                                    <FormattedText text={getPlanetNakshatraMeaning(planetConfig.key)} />
                                </div>
                            </div>

                            {/* Remedies Section */}
                            <div className="bg-purple-50/80 p-4 rounded-lg border border-purple-100">
                                <h3 className="font-semibold text-purple-800 mb-2">उपाय:</h3>
                                <div className="text-sm text-gray-800">
                                    {getRemediesForPlanet(planetConfig.key) ? (
                                        <RemediesFormattedText text={getRemediesForPlanet(planetConfig.key)} />
                                    ) : (
                                        <p>इस समय कोई विशिष्ट उपाय उपलब्ध नहीं है।</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
