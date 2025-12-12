"use client";

import { useEffect, useState } from "react";
import { loadKundaliByIndex } from "@/lib/db";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import KundaliHeader from '@/components/KundaliHeader';
import { RiArrowGoBackLine } from "react-icons/ri";

export default function PlanetInfoPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [kundali, setKundali] = useState(null);
    const [grahInfo, setGrahInfo] = useState(null);
    const [isSideOpen, setIsSideOpen] = useState(false);

    const indexParam = searchParams.get("index");
    const planetName = params.planetName; // This will be the English name from URL

    // Map URL param to internal keys if needed, but assuming direct match for now or simple case handling
    // The PlanetTable uses English names like "Sun", "Moon", etc.
    // grahInfo.json uses lowercase keys: "sun", "moon", etc.

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

    // Get house position from kundali
    // Note: kundali.raw.planets keys are Capitalized (Sun, Moon...)
    const planetDataKey = capitalizeFirstLetter(planetKey);
    const housePosition = kundali?.raw?.planets?.[planetDataKey]?.house;

    // Get info from grahInfo
    // grahInfo is an array with one object usually, based on previous file inspection
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
    /* Fallback to simple div if regex doesn't match or for simple text */

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
                        <div className="p-6 border bg-white/50 rounded-xl shadow-sm">
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

                            <div className="grid md:grid-cols-2 gap-6">
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
