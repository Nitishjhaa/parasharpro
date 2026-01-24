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
    const [planetsInNakshatras, setPlanetsInNakshatras] = useState([]); 
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

    const planetsInformation = {
        Sun: {
            mitraGraha: "चंद्र, मंगल, गुरु",
            shatruGraha: "शुक्र, शनि",
            samaGraha: "बुध",
            adhipati: "सिंह",
            uach: "मेष",
            neech: "तुला",
            ling: "पुरुष",
            disha: "पूर्व (East)",
            color: "लाल/सुनहरा",
            ratan: "माणिक",
            uach_Ghar: "1",
            neech_Ghar: "6,7,10",
            shrest_Ghar: "1,5,8,9,11,12",
            god: "अग्नि,",
            beej_mantra : "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
            vaar: "रविवार",
            daan: "गेहूँ, तांबा, माणिक, गुड़, लाल कपड़ा, लाल फूल, चंदन की लकड़ी, केसर"
        },
        Moon: {
            mitraGraha: "सूर्य, बुध",
            shatruGraha: "कोई नहीं",
            samaGraha: "मंगल, गुरु, शुक्र, शनि",
            adhipati: "कर्क",
            uach: "वृषभ",
            neech: "वृश्चिक",
            ling: "स्त्री",
            disha: "वायव्य (North-West)",
            color: "सफेद/चांदी",
            ratan: "मोती",
            uach_Ghar: "4",
            neech_Ghar: "6,8,10,11,12",
            shrest_Ghar: "1,2,3,4,5,7,9",
            god: "जल देव, ",
            beej_mantra : "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः",
            vaar: "सोमवार",
            daan: "चावल, दूध, सफेद वस्त्र, चांदी, मोती, सफेद फूल"
        },
        Mars: {
            mitraGraha: "सूर्य, चंद्र, गुरु",
            shatruGraha: "बुध",
            samaGraha: "शुक्र, शनि",
            adhipati: "मेष, वृश्चिक",
            uach: "मकर",
            neech: "कर्क",
            ling: "पुरुष",
            disha: "दक्षिण (South)",
            color: "लाल",
            ratan: "मूंगा",
            uach_Ghar: "1,8",
            neech_Ghar: "3,6,11,12",
            shrest_Ghar: "2,4,5,7,9,10",
            god: "कार्तिकेय",
            beej_mantra : "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
            vaar: "मंगलवार",
            daan: "मूंगा, मसूर दाल, लाल चंदन, गुड़, तांबे के बर्तन"
        },
        Mercury: {
            mitraGraha: "सूर्य, शुक्र",
            shatruGraha: "चंद्र",
            samaGraha: "मंगल, गुरु, शनि",
            adhipati: "मिथुन, कन्या",
            uach: "कन्या",
            neech: "मीन",
            ling: "नपुंसक",
            disha: "उत्तर (North)",
            color: "हरा",
            ratan: "पन्ना",
            uach_Ghar: "3,6",
            neech_Ghar: "7,8,9,12",
            shrest_Ghar: "1,2,4,5,10,11",
            god: "नारायण",
            beej_mantra : "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
            vaar: "बुधवार",
            daan: "पन्ना, हरी सब्ज़ियाँ, मूँग की दाल, हरा कपड़ा, दूर्वा घास"
        },
        Jupiter: {
            mitraGraha: "सूर्य, चंद्र, मंगल",
            shatruGraha: "शुक्र, बुध",
            samaGraha: "शनि",
            adhipati: "धनु, मीन",
            uach: "कर्क",
            neech: "मकर",
            ling: "पुरुष",
            disha: "ईशान (North-East)",
            color: "पीला/सुनहरा",
            ratan: "पुखराज",
            uach_Ghar: "9,12",
            neech_Ghar: "6,7,10",
            shrest_Ghar: "2,5,8,9,12",
            god: "बृहस्पति, ",
            beej_mantra : "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
            vaar: "गुरुवार",
            daan: "चना दाल, हल्दी, पुखराज, पीला वस्त्र, पीला फूल, केसर"
        },
        Venus: {
            mitraGraha: "बुध, शनि",
            shatruGraha: "सूर्य, चंद्र, गुरु",
            samaGraha: "मंगल",
            adhipati: "वृषभ, तुला",
            uach: "मीन",
            neech: "कन्या",
            ling: "स्त्री",
            disha: "आग्नेय (South-East)",
            color: "सफेद/गुलाबी",
            ratan: "हीरा",
            uach_Ghar: "2,7",
            neech_Ghar: "1,6,9,10,11",
            shrest_Ghar: "2,3,4,7,12",
            god: "शुक्राचार्य",
            beej_mantra : "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
            vaar: "शुक्रवार",
            daan: "हीरा, दही, सफेद कपड़े, सफेद चावल, चांदी, सुगंधित द्रव्य"
        },
        Saturn: {
            mitraGraha: "बुध, शुक्र, राहु, केतु",
            shatruGraha: "सूर्य, चंद्र, गुरु",
            samaGraha: "मंगल, गुरु",
            adhipati: "मकर, कुंभ",
            uach: "तुला",
            neech: "मेष",
            ling: "पुरुष",
            disha: "दक्षिण (South)",
            color: "नीला/काला",
            ratan: "नीलम",
            uach_Ghar: "10, 11",
            neech_Ghar: "1,4,5,6",
            shrest_Ghar: "1,3,7,12",
            god: "शनि ",
            beej_mantra : "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
            vaar: "शनिवार",
            daan: "तिल, काली उड़द, नीलम, लोहा, काला कपड़ा, तेल"
        },
        Rahu: {
            mitraGraha: "बुध, शुक्र, शनि ",
            shatruGraha: "सूर्य, चंद्र, गुरु",
            samaGraha: "मंगल, गुरु",
            adhipati: "कोई नहीं",
            uach: "वृषभ",
            neech: "वृश्चिक",
            ling: "पुरुष",
            disha: "दक्षिण-पश्चिम (South-West)",
            color: "गहरा नीला / धुंधला",
            ratan: "गोमेद",
            uach_Ghar: "12",
            neech_Ghar: "1,2,4,5,7,12",
            shrest_Ghar: "3,4,6",
            god: "सरस्वती",
            beej_mantra : "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
            vaar: "शनिवार",
            daan: "तिल, सरसों का तेल, काला कपड़ा, कंबल, नारियल"
        },
        Ketu: {
            mitraGraha: "मंगल, शुक्र, शनि",
            shatruGraha: "सूर्य, चंद्र",
            samaGraha: "बुध, गुरु",
            adhipati: "कोई नहीं",
            uach: "वृश्चिक",
            neech: "वृषभ",
            ling: "पुरुष",
            disha: "उत्तर-पश्चिम (North-West)",
            color: "धुंधला / राखी",
            ratan: "लहसुनिया",
            uach_Ghar: "6",
            neech_Ghar: "8,7,11",
            shrest_Ghar: "3,6,9,10,12",
            god: "गणेश",
            beej_mantra : "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
            vaar: "मंगलवार और शनिवार",
            daan: "नीले फूल, कंबल, काले तिल, लहसुनिया, धूप, चंदन"
        }
    }

    const planetExtraInfo = (planet) => {
        return (
            <>
                <div className="grid grid-cols-2 gap-3">
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">मित्र ग्रह :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].mitraGraha}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">शत्रु ग्रह :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].shatruGraha}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">सम ग्रह :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].samaGraha}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">आधिपति :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].adhipati}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">उच्च :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].uach}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">नीच :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].neech}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">लिंग :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].ling}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">दिशा :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].disha}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">रत्न :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].ratan}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">पक्का घर :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].uach_Ghar}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">नीच घर :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].neech_Ghar}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">श्रेष्ठ घर :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].shrest_Ghar}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">देवता :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].god}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">वार :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].vaar}</p>
                    </div>
                    
                </div>
                <div className="grid grid-cols-1 gap-3 mt-3">
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">दान :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].daan}</p>
                    </div>
                    <div className="border border-black/20 p-2 rounded-lg">
                        <div className="text-sm">मंत्र :</div>
                        <p className="text-xs mt-2">{planetsInformation[planet].beej_mantra}</p>
                    </div>
                </div>
            </>
        )
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
                        <div className="p-3 bg-white/50 rounded-xl shadow-sm">
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

                            <div className="bg-teal-50/80 p-4 rounded-lg border border-teal-100 mt-5">
                                {planetExtraInfo(planetConfig.key)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
