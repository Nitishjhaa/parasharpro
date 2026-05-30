"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { CiClock2, CiLocationOn } from "react-icons/ci";
import { toast } from "sonner";
import getPanchangDetails from "@/lib/panchang";

// ─── Hindi day names ──────────────────────────────────────────────────────────
const HINDI_DAYS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const ENG_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ─── Nakshatra name map ───────────────────────────────────────────────────────
const NAKSHATRA_MAP = {
    "Krittika": "कृत्तिका", "Punarvasu": "पुनर्वसु", "Vishakha": "विशाखा",
    "UttaraPhalguni": "उत्तराफाल्गुनी", "Uttara Phalguni": "उत्तराफाल्गुनी", "Uttara_Phalguni": "उत्तराफाल्गुनी",
    "PurvaBhadrapada": "पूर्वाभाद्रपद", "Purva Bhadrapada": "पूर्वाभाद्रपद", "Purva_Bhadrapada": "पूर्वाभाद्रपद",
    "UttaraAshadha": "उत्तराषाढ़ा", "Uttara Ashadha": "उत्तराषाढ़ा", "Uttara_Ashadha": "उत्तराषाढ़ा",
    "Mrigashira": "मृगशीर्ष", "Mrigashirsha": "मृगशीर्ष", "Chitra": "चित्रा", "Dhanishta": "धनिष्ठा",
    "Ashwini": "अश्विनी", "Bharani": "भरणी", "Rohini": "रोहिणी", "Ardra": "आर्द्रा",
    "Pushya": "पुष्य", "Ashlesha": "आश्लेषा", "Magha": "मघा",
    "PurvaPhalguni": "पूर्वाफाल्गुनी", "Purva Phalguni": "पूर्वाफाल्गुनी", "Purva_Phalguni": "पूर्वाफाल्गुनी",
    "Hasta": "हस्त", "Swati": "स्वाती", "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा",
    "Mula": "मूला", "PurvaAshadha": "पूर्वाषाढ़ा", "Purva Ashadha": "पूर्वाषाढ़ा", "Purva_Ashadha": "पूर्वाषाढ़ा",
    "Shravana": "श्रवण", "Sravana": "श्रवण", "Shatabhisha": "शतभिषा",
    "UttaraBhadrapada": "उत्तराभाद्रपद", "Uttara Bhadrapada": "उत्तराभाद्रपद", "Uttara_Bhadrapada": "उत्तराभाद्रपद",
    "Revati": "रेवती", "Rebati": "रेवती", "Dwija": "भरणी"
};

const TITHI_MAP = {
    "Vidhiya": "द्वितीया", "Sapthami": "सप्तमी", "Dvadasi": "द्वादशी",
    "Padyami": "प्रतिपदा", "Thadiya": "तृतीया", "Chavithi": "चतुर्थी", "Chaviti": "चतुर्थी",
    "Panchami": "पंचमी", "Shasti": "षष्ठी", "Ashtami": "अष्टमी", "Navami": "नवमी",
    "Dasami": "दशमी", "Ekadasi": "एकादशी", "Trayodasi": "त्रयोदशी",
    "Chaturdasi": "चतुर्दशी", "Punnami": "पूर्णिमा", "Amavasya": "अमावस्या"
};

// ─── Case Filing Condition Definitions ───────────────────────────────────────

// Allowed ascendant houses for case filing
const ALLOWED_ASCENDANT_HOUSES = [3, 6, 7, 8, 11];

// Allowed Tithis (English keys from panchang)
const ALLOWED_TITHIS = ["Thadiya", "Sapthami", "Dasami", "Trayodasi", "Punnami", "Panchami"];
// tithi numbers map: 3=Thadiya, 7=Sapthami, 10=Dasami, 13=Trayodasi, 15=Punnami, 5=Panchami

// Allowed weekdays: Sunday=0, Tuesday=2, Wednesday=3, Thursday=4, Friday=5
const ALLOWED_WEEKDAYS = [0, 2, 3, 4, 5];

// Allowed Nakshatras for case filing (English keys)
const ALLOWED_NAKSHATRAS = [
    "Jyeshtha",
    "Ardra",
    "Bharani",
    "PurvaAshadha", "Purva Ashadha", "Purva_Ashadha",
    "PurvaBhadrapada", "Purva Bhadrapada", "Purva_Bhadrapada",
    "PurvaPhalguni", "Purva Phalguni", "Purva_Phalguni",
    "Mula",
    "Ashlesha",
    "Magha"
];

// Hindi display names for allowed nakshatras (deduplicated)
const ALLOWED_NAKSHATRA_HINDI = ["ज्येष्ठा", "आर्द्रा", "भरणी", "पूर्वाषाढ़ा", "पूर्वाभाद्रपद", "पूर्वाफाल्गुनी", "मूला", "आश्लेषा", "मघा"];

// Planets that must be in houses 3, 6, or 11 (and not in 8th)
const RESTRICTED_PLANETS = ["Saturn", "Sun", "Rahu"];
const RESTRICTED_HOUSES = [3, 6, 11];

// ─── Evaluation Function ──────────────────────────────────────────────────────
function evaluateCaseFiling(weekdayIdx, englishTithi, englishNakshatra, kundaliData) {
    // 1. Ascendant check
    const ascendantHouse = (kundaliData?.ascendant?.rashiIndex + 1) % 12 ?? null;
    const ascendantOk = ascendantHouse !== null && ALLOWED_ASCENDANT_HOUSES.includes(Number(ascendantHouse));

    // 2. Tithi check
    const tithiOk = ALLOWED_TITHIS.includes(englishTithi);

    // 3. Weekday check
    const weekdayOk = ALLOWED_WEEKDAYS.includes(weekdayIdx);

    // 4. Nakshatra check
    const nakshatraOk = ALLOWED_NAKSHATRAS.includes(englishNakshatra);

    // 5. No planet in 8th house
    const planets = kundaliData?.planets ?? {};
    const planetsIn8th = Object.entries(planets)
        .filter(([, p]) => Number(p?.house) === 8)
        .map(([name]) => name);
    const eighth8Empty = planetsIn8th.length === 0;

    // 6. Saturn, Sun, Rahu must be in 3, 6, or 11
    const restrictedPlanetStatus = RESTRICTED_PLANETS.map((name) => {
        const planet = planets[name];
        const house = planet ? Number(planet.house) : null;
        const ok = house !== null && RESTRICTED_HOUSES.includes(house);
        return { name, house, ok };
    });
    const restrictedOk = restrictedPlanetStatus.every(p => p.ok);

    // Overall result
    const allPassed = ascendantOk && tithiOk && weekdayOk && nakshatraOk && eighth8Empty && restrictedOk;
    const partialCount = [ascendantOk, tithiOk, weekdayOk, nakshatraOk, eighth8Empty, restrictedOk].filter(Boolean).length;

    return {
        allPassed,
        partialCount,
        ascendantHouse,
        ascendantOk,
        tithiOk,
        weekdayOk,
        nakshatraOk,
        eighth8Empty,
        planetsIn8th,
        restrictedPlanetStatus,
        restrictedOk,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CasePage() {
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightIdx, setHighlightIdx] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const [form, setForm] = useState({
        date: "",
        time: "",
        city: "Delhi",
        lat: 28.6139,
        lon: 77.2090,
    });

    const cityInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Initialise with current date/time
    useEffect(() => {
        const now = new Date();
        setForm(prev => ({
            ...prev,
            date: now.toISOString().slice(0, 10),
            time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
        }));
        fetch("/data/cities.json")
            .then(r => r.json())
            .then(data => setCities(data || []))
            .catch(err => console.error("Error loading cities:", err));
    }, []);

    // City autocomplete
    function filterCities(q) {
        if (!q?.trim()) { setFilteredCities([]); setShowSuggestions(false); return; }
        const query = q.toLowerCase();
        const matches = cities.filter(c =>
            c.city.toLowerCase().includes(query) || c.admin_name.toLowerCase().includes(query)
        ).slice(0, 10);
        setFilteredCities(matches);
        setShowSuggestions(true);
        setHighlightIdx(0);
    }

    function selectCity(cityObj) {
        setForm(prev => ({ ...prev, city: cityObj.city, lat: Number(cityObj.lat), lon: Number(cityObj.lng) }));
        setFilteredCities([]);
        setShowSuggestions(false);
        setHighlightIdx(-1);
    }

    function handleCityKeyDown(e) {
        if (!showSuggestions || !filteredCities.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx(p => (p + 1 >= filteredCities.length ? 0 : p + 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx(p => (p - 1 < 0 ? filteredCities.length - 1 : p - 1)); }
        else if (e.key === "Enter") { e.preventDefault(); if (highlightIdx >= 0) selectCity(filteredCities[highlightIdx]); }
        else if (e.key === "Escape") setShowSuggestions(false);
    }

    useEffect(() => {
        function outsideClick(e) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
                cityInputRef.current && !cityInputRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("click", outsideClick);
        return () => document.removeEventListener("click", outsideClick);
    }, []);

    function fillCurrentDateTime() {
        const now = new Date();
        setForm(prev => ({
            ...prev,
            date: now.toISOString().slice(0, 10),
            time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
            city: "Delhi", lat: 28.6139, lon: 77.2090,
        }));
        toast.success("Current date, time and location filled!");
    }

    // ─── Calculate ──────────────────────────────────────────────────────────────
    async function handleCalculate() {
        if (!form.date || !form.time) { toast.error("Please enter date and time."); return; }
        setLoading(true);
        try {
            // Panchang
            const panchang = getPanchangDetails(form.date, form.time, form.lat, form.lon);
            const dateObj = new Date(`${form.date}T${form.time}`);
            const weekdayIdx = dateObj.getDay();
            const tithiEnglish = panchang.englishTithi || "";
            const nakshatraEng = panchang.englishNakshatra || "";

            // Kundali API for planetary house positions
            const payload = {
                name: "जातक",
                gender: "Male",
                birthDate: form.date,
                birthTime: form.time,
                lat: Number(form.lat),
                lon: Number(form.lon),
                city: form.city,
                timeZone: "Asia/Kolkata",
            };

            const res = await fetch("https://kundalipwa.onrender.com/kundali", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Kundali API failed");
            const kundaliData = await res.json();


            // Evaluate
            const evaluation = evaluateCaseFiling(weekdayIdx, tithiEnglish, nakshatraEng, kundaliData);

            setResults({
                tithi: panchang.tithi?.name || TITHI_MAP[tithiEnglish] || tithiEnglish,
                nakshatra: NAKSHATRA_MAP[nakshatraEng] || nakshatraEng,
                weekday: HINDI_DAYS[weekdayIdx],
                weekdayEng: ENG_DAYS[weekdayIdx],
                evaluation,
                planets: kundaliData?.planets ?? {},
                asc: kundaliData?.ascendant?.rashiIndex ?? 0,
            });
            toast.success("Calculation completed!");
        } catch (err) {
            console.error(err);
            toast.error("Error calculating. Please check inputs and try again.");
        } finally {
            setLoading(false);
        }
    }

    // console.log((results.ascendant+1) % 12)

    // ─── Condition Card Helper ───────────────────────────────────────────────────
    function ConditionRow({ ok, label }) {
        return (
            <span className={`flex items-center gap-2 text-sm font-semibold ${ok ? "text-green-600" : "text-neutral-400"}`}>
                {ok ? <MdCheckCircle size={18} /> : <MdCancel size={18} />}
                {label}
            </span>
        );
    }


    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="w-[98%] mx-auto pt-2 text-black">

            {/* ── HEADER ── */}
            <div className="rounded-3xl overflow-hidden mb-4">
                <div className="bg-linear-to-r from-[#FFE984] to-[#FFB111] p-5 flex gap-4 items-center shadow-md">
                    <img src="/images/kundaliHead.png" className="w-12 brightness-0" alt="Case Logo" />
                    <div className="flex flex-col">
                        <span className="bg-linear-to-l from-[#F26A20] to-red-600 bg-clip-text text-transparent text-2xl font-bold">
                            मुकदमा करना
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">

                {/* ── FORM PANEL ── */}
                <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-yellow-200 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-[#d98b00] border-b pb-2 flex items-center gap-2">
                        <CiClock2 size={24} /> Fill the date
                    </h2>

                    <div className="space-y-4">
                        {/* Quick Fill */}
                        <button
                            onClick={fillCurrentDateTime}
                            className="w-full bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl py-2 px-4 text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95"
                        >
                            Fill Current Date, Time & Location
                        </button>

                        {/* Date */}
                        <div className="flex flex-col gap-4 max-md:flex-row">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="bg-neutral-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                                    value={form.date}
                                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold text-gray-700 mb-1">Time (24h)</label>
                                <input
                                    type="time"
                                    className="bg-neutral-50 border border-gray-300 rounded-xl p-3 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                                    value={form.time}
                                    onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* City Autocomplete */}
                        <div className="flex flex-col relative" ref={suggestionsRef}>
                            <label className="text-sm font-semibold text-gray-700 mb-1">Place/City</label>
                            <div className="relative">
                                <input
                                    ref={cityInputRef}
                                    type="text"
                                    placeholder="Search city (e.g., Delhi)..."
                                    className="w-full bg-neutral-50 border border-gray-300 rounded-xl p-3 pl-10 outline-none focus:border-amber-500 transition-colors text-black font-medium"
                                    value={form.city}
                                    onChange={e => { setForm(prev => ({ ...prev, city: e.target.value })); filterCities(e.target.value); }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={handleCityKeyDown}
                                    autoComplete="off"
                                />
                                <CiLocationOn className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            </div>
                            {showSuggestions && filteredCities.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-auto z-50 mt-1">
                                    {filteredCities.map((c, i) => (
                                        <div key={i} onClick={() => selectCity(c)}
                                            className={`p-3 cursor-pointer transition-colors ${highlightIdx === i ? "bg-amber-100 font-semibold" : "hover:bg-neutral-100"}`}>
                                            <div className="text-sm text-black">{c.city}</div>
                                            <div className="text-xs text-gray-500">{c.admin_name}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Calculate */}
                        <button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full bg-[#104072] hover:bg-[#0b2d52] disabled:bg-neutral-400 text-white rounded-xl py-3.5 font-bold transition-all duration-200 shadow-md mt-4 flex items-center justify-center gap-2 text-lg active:scale-98"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Calculating...
                                </>
                            ) : "Check"}
                        </button>
                    </div>

                    {/* Condition Reference Box */}
                    <div className="hidden mt-6 bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-gray-700 space-y-2">
                        <p className="font-bold text-amber-800 text-sm">आवश्यक शर्तें:</p>
                        <p>🏠 <strong>लग्न:</strong> 3, 6, 7, 8, 11 में से कोई एक</p>
                        <p>🌙 <strong>तिथि:</strong> 3, 5, 7, 10, 13, 15</p>
                        <p>📅 <strong>वार:</strong> रवि, मंगल, बुध, गुरु, शुक्र</p>
                        <p>⭐ <strong>नक्षत्र:</strong> ज्येष्ठा, आर्द्रा, भरणी, पू.आ., पू.भा., पू.फा., मूल, आश्लेषा, मघा</p>
                        <p>🚫 <strong>8वें भाव में कोई ग्रह नहीं</strong></p>
                        <p>🪐 <strong>शनि, सूर्य, राहु:</strong> 3, 6, 11 में से किसी में</p>
                    </div>
                </div>

                {/* ── RESULTS ── */}
                <div className="lg:col-span-8 bg-linear-to-r from-[#FFE984]/20 to-[#FFB111]/20 rounded-3xl p-6 border border-yellow-300 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {!results ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                            >

                                <h3 className="text-xl font-bold text-gray-700">Details Will be Shown Here</h3>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                                {/* ── Panchang Chips ── */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "तिथि", value: results.tithi },
                                        { label: "नक्षत्र", value: results.nakshatra },
                                        { label: "वार", value: results.weekday },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-white rounded-2xl p-4 text-center border border-yellow-200 shadow-xs">
                                            <span className="text-xs text-gray-500 font-semibold block mb-1">{label}</span>
                                            <span className="text-lg font-bold text-amber-700">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* ── OVERALL VERDICT ── */}
                                <div className={`rounded-3xl p-6 border-2 flex items-center gap-4 shadow-md ${results.evaluation.allPassed
                                    ? "bg-green-50 border-green-400"
                                    : results.evaluation.partialCount >= 4
                                        ? "bg-yellow-50 border-yellow-400"
                                        : "bg-red-50 border-red-300"
                                    }`}>

                                    <div>
                                        <p className={`text-2xl font-extrabold ${results.evaluation.allPassed ? "text-green-700"
                                            : results.evaluation.partialCount >= 4 ? "text-yellow-700"
                                                : "text-red-700"
                                            }`}>
                                            {results.evaluation.allPassed
                                                ? "मुकदमा दायर करने का शुभ दिन!"
                                                : results.evaluation.partialCount >= 4
                                                    ? "आंशिक योग — सावधानी से विचार करें"
                                                    : "यह दिन मुकदमे के लिए उचित नहीं है।"}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {results.evaluation.partialCount} / 6 Conditions Met
                                        </p>
                                    </div>
                                </div>

                                {/* ── CONDITION 1: ASCENDANT ── */}
                                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="bg-linear-to-r from-indigo-600 to-indigo-400 px-6 py-4 text-white flex justify-between items-center">
                                        <h3 className="text-xl">लग्न भाव</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm shadow-sm ${results.evaluation.ascendantOk ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-600"
                                            }`}>
                                            {results.evaluation.ascendantOk ? "Condition Met" : "Condition Not Met"}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <ConditionRow
                                            ok={results.evaluation.ascendantOk}
                                            label={`लग्न: भाव ${results.evaluation.ascendantHouse ?? "अज्ञात"} — आवश्यक: 3, 6, 7, 8, 11`}
                                        />
                                        <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-800">
                                            मुकदमे के लिए लग्न 3 (पराक्रम), 6 (शत्रु/रोग), 7 (विवाद/साझेदार), 8 (गुप्त/संघर्ष), या 11 (लाभ) भाव में होना चाहिए।
                                        </div>
                                    </div>
                                </div>

                                {/* ── CONDITION 2: TITHI ── */}
                                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="bg-linear-to-r from-amber-600 to-orange-400 px-6 py-4 text-white flex justify-between items-center">
                                        <h3 className="text-xl">तिथि </h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm shadow-sm ${results.evaluation.tithiOk ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-600"
                                            }`}>
                                            {results.evaluation.tithiOk ? "Condition Met" : "Condition Not Met"}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <ConditionRow
                                            ok={results.evaluation.tithiOk}
                                            label={`तिथि: ${results.tithi} — शुभ तिथि: तृतीया(3), पंचमी(5), सप्तमी(7), दशमी(10), त्रयोदशी(13), पूर्णिमा(15)`}
                                        />
                                        <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
                                            इन तिथियों को मुकदमा दायर करने के लिए ज्योतिष में शुभ माना जाता है।
                                        </div>
                                    </div>
                                </div>

                                {/* ── CONDITION 3: VAAR ── */}
                                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="bg-linear-to-r from-green-700 to-green-500 px-6 py-4 text-white flex justify-between items-center">
                                        <h3 className="text-xl">वार</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm shadow-sm ${results.evaluation.weekdayOk ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-600"
                                            }`}>
                                            {results.evaluation.weekdayOk ? "Condition Met" : "Condition Not Met"}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <ConditionRow
                                            ok={results.evaluation.weekdayOk}
                                            label={`वार: ${results.weekday} — शुभ वार: रविवार, मंगलवार, बुधवार, गुरुवार, शुक्रवार`}
                                        />
                                        <div className="bg-green-50 rounded-xl p-3 text-xs text-green-800">
                                            शनिवार और सोमवार को मुकदमे के लिए उचित नहीं माना गया है।
                                        </div>
                                    </div>
                                </div>

                                {/* ── CONDITION 4: NAKSHATRA ── */}
                                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="bg-linear-to-r from-rose-700 to-rose-400 px-6 py-4 text-white flex justify-between items-center">
                                        <h3 className="text-xl">नक्षत्र</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm shadow-sm ${results.evaluation.nakshatraOk ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-600"
                                            }`}>
                                            {results.evaluation.nakshatraOk ? "Condition Met" : "Condition Not Met"}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <ConditionRow
                                            ok={results.evaluation.nakshatraOk}
                                            label={`नक्षत्र: ${results.nakshatra}`}
                                        />
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {ALLOWED_NAKSHATRA_HINDI.map(n => (
                                                <span key={n} className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${results.nakshatra === n
                                                    ? "bg-rose-500 text-white border-rose-500"
                                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                                    }`}>{n}</span>
                                            ))}
                                        </div>
                                        <div className="bg-rose-50 rounded-xl p-3 text-xs text-rose-800">
                                            ये नक्षत्र मुकदमे की कार्यवाही के लिए ज्योतिषीय रूप से अनुकूल माने गए हैं।
                                        </div>
                                    </div>
                                </div>

                                {/* ── CONDITION 5: NO PLANET IN 8TH ── */}
                                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="bg-linear-to-r from-purple-700 to-purple-500 px-6 py-4 text-white flex justify-between items-center">
                                        <h3 className="text-xl">8वाँ भाव </h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm shadow-sm ${results.evaluation.eighth8Empty ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                            }`}>
                                            {results.evaluation.eighth8Empty ? "Condition Met" : "Condition Not Met"}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <ConditionRow
                                            ok={results.evaluation.eighth8Empty}
                                            label={results.evaluation.eighth8Empty
                                                ? "8वाँ भाव ग्रहों से रहित है — शुभ!"
                                                : `8वें भाव में ग्रह: ${results.evaluation.planetsIn8th.join(", ")}`}
                                        />
                                        <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-800">
                                            8वें भाव को बाधा, क्षति और गुप्त शत्रुओं का घर माना जाता है। इसमें कोई ग्रह नहीं होना चाहिए।
                                        </div>
                                    </div>
                                </div>

                                {/* ── CONDITION 6: SATURN, SUN, RAHU in 3/6/11 ── */}
                                <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden hover:shadow-lg transition-all">
                                    <div className="bg-linear-to-r from-teal-700 to-teal-500 px-6 py-4 text-white flex justify-between items-center">
                                        <h3 className="text-xl">ग्रहों की स्थिति</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-sm shadow-sm ${results.evaluation.restrictedOk ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-600"
                                            }`}>
                                            {results.evaluation.restrictedOk ? "Condition Met" : "Condition Not Met"}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {results.evaluation.restrictedPlanetStatus.map(({ name, house, ok }) => {
                                            const hindiName = name === "Saturn" ? "शनि" : name === "Sun" ? "सूर्य" : "राहु";
                                            return (
                                                <ConditionRow
                                                    key={name}
                                                    ok={ok}
                                                    label={`${hindiName} (${name}): भाव ${house ?? "अज्ञात"} — आवश्यक: 3, 6, 11`}
                                                />
                                            );
                                        })}
                                        <div className="bg-teal-50 rounded-xl p-3 text-xs text-teal-800">
                                            शनि, सूर्य और राहु को 3 (पराक्रम), 6 (शत्रुनाश), या 11 (लाभ) भाव में होना चाहिए। ये ग्रह शत्रुओं के विरुद्ध शक्ति प्रदान करते हैं।
                                        </div>
                                    </div>
                                </div>

                                {/* ── All Planet Positions Summary ── */}
                                {Object.keys(results.planets).length > 0 && (
                                    <div className="bg-white rounded-3xl border border-yellow-200 shadow-md overflow-hidden">
                                        <div className="bg-linear-to-r from-gray-700 to-gray-500 px-6 py-4 text-white">
                                            <h3 className="text-xl font-bold">सभी ग्रह स्थिति</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3">
                                                    <div className="font-bold">लग्न</div>
                                                    <div className="text-xs mt-0.5 opacity-80 font-semibold">Asc · भाव {(results.asc + 1) % 12} </div>
                                                    {(results.asc + 1) % 12 === 3 || (results.asc + 1) % 12 === 6 || (results.asc + 1) % 12 === 11 && <div className="text-xs text-green-500 mt-0.5">शुभ स्थान</div>}
                                                </div>
                                                {Object.entries(results.planets).map(([name, p]) => {
                                                    const hindiNames = {
                                                        Sun: "सूर्य", Moon: "चन्द्र", Mars: "मंगल", Mercury: "बुध",
                                                        Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
                                                        Rahu: "राहु", Ketu: "केतु"
                                                    };
                                                    const h = Number(p?.house);
                                                    const isRestricted = RESTRICTED_PLANETS.includes(name);
                                                    const restrictedOk = isRestricted && RESTRICTED_HOUSES.includes(h);
                                                    const inEighth = h === 8;
                                                    return (
                                                        <div key={name} className={`rounded-xl p-3 border text-sm font-semibold ${inEighth ? "bg-red-50 border-red-300 text-red-700"
                                                            : restrictedOk ? "bg-green-50 border-green-300 text-green-700"
                                                                : "bg-gray-50 border-gray-200 text-gray-700"
                                                            }`}>
                                                            <div className="font-bold">{hindiNames[name] || name}</div>
                                                            <div className="text-xs mt-0.5 opacity-80">{name} · भाव {h || "?"}</div>
                                                            {inEighth && <div className="text-xs text-red-500 mt-0.5">8वें भाव में</div>}
                                                            {restrictedOk && <div className="text-xs text-green-500 mt-0.5">शुभ स्थान</div>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
